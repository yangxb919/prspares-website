import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import { checkRateLimit } from '@/lib/rate-limit'

// --- Client IP ---
// 🔴 nginx 那边是 `proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for`。
// 这个变量展开后是「客户端自己带的值, 真实 IP」—— 真实 IP 在**最后**一个。
// 这里以前取 split(',')[0]（第一个），也就是客户端可以自己写：随便加一行
// `X-Forwarded-For: 1.2.3.4` 就同时绕过了限流和下面那份 IP 黑名单，
// 我们花了两个月往 BLOCKED_IP_PREFIXES 里加的机房段全部形同虚设。
// 单层 nginx 代理，取最后一跳才是客户端伪造不了的那个。
function getClientIp(request: NextRequest): string {
  const xff = request.headers.get('x-forwarded-for')
  if (xff) {
    const parts = xff.split(',').map((s) => s.trim()).filter(Boolean)
    if (parts.length > 0) return parts[parts.length - 1]
  }
  return request.headers.get('x-real-ip')?.trim() || 'unknown'
}

// --- Bot Detection ---
// 2026-09-02 重构。以前这里是「泛化拦截」：UA 里只要带 bot / crawl / spider
// 就 403，白名单只列了几个搜索引擎。实测代价（当天线上逐个试过）：
//   403 —— Applebot(Siri/Spotlight)、redditbot(Reddit 链接预览，正是我们做
//          社群分发的渠道)、Discordbot、Pinterestbot、SeznamBot
//   200 —— GPTBot、Bingbot、Google-InspectionTool、TelegramBot
// 同一类错误已经犯过一次：GPTBot 早先也被这条正则拦成 403，05-12 放行之后
// ChatGPT 渠道会话 +83%，现在的新询盘主要就靠那条线。
//
// 所以改成「点名拦截」：只有明确该拦的才 403，不认识的 UA 一律放行、走限流。
// 顺带删掉了对通用 HTTP 客户端（curl / wget / python-requests / go-http-client
// / headless 浏览器）的拦截 —— 真想采集的人改一行 UA 就绕过去了，这条实际
// 只挡住了我们自己的监控脚本和 SEO 巡检工具，属于净亏。
const BLOCKED_UA_PATTERNS = [
  // SEO / 外链数据采集：吃带宽，不带流量
  /ahrefsbot/i, /semrushbot/i, /dotbot/i, /mj12bot/i, /blexbot/i,
  /dataforseo/i, /serpstatbot/i, /barkrowler/i, /seekportbot/i,
  /megaindex/i, /linkdexbot/i,
  // B2B 名单采集 —— 下面两个是 2026-09-02 从 nginx 日志里抓到的，
  // 当天 403 里最大的两股就是它们
  /globradarbot/i, /apexleadbot/i, /zoominfobot/i,
  // 抓内容但不给我们目标市场带流量
  /bytespider/i, /petalbot/i, /yisouspider/i,
  // 漏洞扫描与端口探测
  /sqlmap/i, /nikto/i, /masscan/i, /zgrab/i, /nuclei/i,
  /censys/i, /internetmeasurement/i, /expanse/i,
]

// Known datacenter / bot IP ranges — we match the start of the IP string.
// Extended 2026-05-15 after GA4 data showed 84/223 (37.7%) "users" came from
// Singapore with 0% engagement_rate, 0s engagement_time, 0 key_events —
// textbook SG datacenter bot traffic that bypassed the previous list.
const BLOCKED_IP_PREFIXES: string[] = [
  // AWS ap-southeast-1 (Singapore)
  '13.212.', '13.213.', '13.214.', '13.215.',
  '13.228.', '13.229.', '13.250.', '13.251.',
  '18.136.', '18.138.', '18.139.', '18.140.', '18.141.', '18.142.', '18.143.',
  '54.151.', '54.179.', '54.251.', '54.252.', '54.254.', '54.255.',
  '52.74.', '52.76.', '52.77.',
  '108.137.', '108.138.',
  '122.248.',
  '175.41.',
  '3.0.', '3.1.',
  // GCP asia-southeast1 (Singapore)
  '34.87.', '34.124.', '34.126.', '34.142.', '34.143.',
  // Linode SG (entire /16 is Singapore datacenter)
  '139.162.', '172.105.',
  // Vultr (heavy SG presence — large fraction of these /16 route to SGP)
  '45.32.', '45.77.', '108.61.',
  // OVH SGP
  '51.79.',
  // DigitalOcean SGP1 (additional /16 beyond the original set)
  '165.22.', '178.128.',

  // ── 2026-05-22 nginx log audit findings ────────────────────────
  // After GA4 kept reporting Singapore at 37%+ for a full week despite
  // the SG prefix expansions above, pulled the actual VPS access log
  // and discovered the real bot traffic is mostly from European
  // datacenter ISPs and Indian residential bot clusters — not Singapore.
  // GA4's city dimension was mis-labeling them. These prefixes catch
  // ~1500 hits over the 7-day window.

  // Techoff SRV Limited (datacenter, registered Andorra & Netherlands)
  // — single biggest source: ~1150 hits across 8 IPs in /24
  '195.178.110.',  // Andorra-registered /24, 700+ hits / 5 IPs
  '45.148.10.',    // Netherlands-registered /24, 450+ hits / 3 IPs

  // Indian residential bot clusters
  // (same ISP family, registered to individual names — typical bot proxies)
  '103.215.74.',   // "Rekha M. Jain", 290 hits
  '103.215.75.',   // 2026-05-22: bot operator migrated +1 /24 same day prefix
                   // shipped. 188 hits to product pages within hours of deploy.
  '103.168.66.',   // "Mahavir Milapchand Jain", 123 hits
  '103.153.183.',  // "Harsh Jain", 170 hits

  // Smaller-volume but consistently scraping
  '37.114.41.',    // Smartnet Limited DE
  '176.123.30.',   // Public Telecom Yemen
  '195.64.239.',   // TELECOMTRADE Ukraine
]

function shouldBlock(request: NextRequest): boolean {
  const ua = request.headers.get('user-agent') || ''

  // 1. 没有 UA，或短到不可能是真客户端 —— nginx 日志里扫 /wp-load.php、
  //    /xmini4.php 的那批就是这类
  if (!ua || ua.length < 10) return true

  // 2. 点名拉黑的采集器与扫描器
  if (BLOCKED_UA_PATTERNS.some(p => p.test(ua))) return true

  // 3. 机房 bot IP 段
  const ip = getClientIp(request)
  if (ip !== 'unknown' && BLOCKED_IP_PREFIXES.some(prefix => ip.startsWith(prefix))) return true

  return false
}

// --- Crawler allow-list ---
// AI answer engines (ChatGPT, Perplexity, Claude, Gemini, etc.) increasingly
// surface B2B suppliers; blocking them caps GEO/AI referral ceiling at ~0.
// Trade-off: more bandwidth. Rate-limit below still applies as abuse guard.
const AI_CRAWLERS = /gptbot|chatgpt-user|oai-searchbot|perplexitybot|perplexity-user|claudebot|anthropic-ai|claude-web|google-extended|applebot-extended|youbot|meta-externalagent|duckassistbot|amazonbot|mistralai-user|cohere-ai|ccbot/i
// 2026-09-02 补：applebot（Siri / Spotlight，此前被 /bot/i 拦成 403）、
// seznambot、googleother、google-inspectiontool（GSC 手动请求收录会用到）、
// bingpreview、adidxbot、naver 的 yeti、qwantify。
const SEARCH_CRAWLERS = /googlebot|adsbot-google|mediapartners-google|google-adsbot|googleother|google-inspectiontool|bingbot|bingpreview|adidxbot|yandex|baiduspider|duckduckbot|applebot|seznambot|qwantify|yeti/i
// 2026-09-02 补：redditbot（我们在 Reddit 做社群分发，它抓不到就没有链接预览
// 卡片，等于自己把点击率砍掉）、discordbot、telegrambot、pinterest、
// mastodon、bluesky、embedly / iframely（很多论坛和 CMS 用它们生成预览）。
const SOCIAL_CRAWLERS = /facebookexternalhit|twitterbot|linkedinbot|slackbot|whatsapp|redditbot|discordbot|telegrambot|pinterest|mastodon|bluesky|embedly|iframely|skypeuripreview|vkshare|tumblr|flipboard/i

// --- Rate limiting ---
// 2026-09-02 重设。旧配置是全站 60 次/分钟/IP，毛病出在计数口径上：
// Next.js 的 <Link> 默认开预取，一次普通页面浏览除了 HTML 本身，还会带出
// 约 7 个 `?_rsc=` 请求（导航栏那几条链接）。也就是一页吃掉 8 次额度 ——
// 60 次实际只够看 7 个页面，采购商快速翻目录页就会撞上，而且撞上后返回的
// 是一行纯文本。全站 70 个文件用 next/link，没有一处写 prefetch={false}。
// 实测（并发 80 次 /products/screens）：56 个 200 + 24 个 429。
//
// 现在：预取请求根本不计数（那是浏览器替用户提前拿的，不是人在点），
// 真实导航放宽到 240 次/分钟，写接口维持 60 次/分钟。
const RATE_LIMIT_PAGE = 240
const RATE_LIMIT_API = 60
// 好爬虫以前是直接 skip 限流，等于任何人把 UA 改成 Googlebot 就能无限打。
// 改成给一个宽松额度兜底，正常抓取够用，滥用还是拦得住。
const RATE_LIMIT_CRAWLER = 600

// 浏览器替用户提前拿的预取请求，不算在人的额度里。
function isPrefetch(request: NextRequest): boolean {
  return (
    request.headers.get('next-router-prefetch') === '1' ||
    request.headers.get('purpose') === 'prefetch' ||
    request.nextUrl.searchParams.has('_rsc')
  )
}

// 撞限流时别再甩一行纯文本给客户看。HTML 导航给一个能看懂、
// 有出路（WhatsApp）的页面；其余（RSC / API / 图片）保持纯文本。
function tooManyRequests(request: NextRequest): NextResponse {
  const headers: Record<string, string> = {
    'Retry-After': '60',
    'Cache-Control': 'no-store',
    'X-Robots-Tag': 'noindex',
  }
  const wantsHtml = (request.headers.get('accept') || '').includes('text/html')
  if (!wantsHtml) {
    return new NextResponse('Too Many Requests', { status: 429, headers })
  }
  const html = `<!doctype html>
<html lang="en"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="robots" content="noindex">
<title>One moment — PRSPARES</title>
<style>
  body{margin:0;min-height:100vh;display:flex;align-items:center;justify-content:center;
       background:#f7f8fa;color:#1a2233;
       font:16px/1.6 -apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Helvetica,Arial,sans-serif}
  main{max-width:30rem;padding:2.5rem 1.5rem;text-align:center}
  h1{margin:0 0 .75rem;font-size:1.5rem;font-weight:650;letter-spacing:-.01em}
  p{margin:0 0 1rem;color:#4a5568}
  a{display:inline-block;margin-top:.5rem;padding:.7rem 1.4rem;border-radius:.5rem;
    background:#0f9d58;color:#fff;text-decoration:none;font-weight:600}
</style></head>
<body><main>
  <h1>One moment, please</h1>
  <p>We received a lot of requests from your connection in the last minute, so this one was paused. Wait about a minute and reload &mdash; there is nothing wrong with your account or your order.</p>
  <p>If you are sourcing right now and would rather not wait, message us directly and we will quote from there.</p>
  <a href="https://wa.me/85363902425">Chat on WhatsApp</a>
</main></body></html>`
  return new NextResponse(html, {
    status: 429,
    headers: { ...headers, 'Content-Type': 'text/html; charset=utf-8' },
  })
}

export async function middleware(request: NextRequest) {
  // --- Bot blocking (before any other logic) ---
  const ua = request.headers.get('user-agent') || ''
  const isGoodCrawler = AI_CRAWLERS.test(ua) || SEARCH_CRAWLERS.test(ua) || SOCIAL_CRAWLERS.test(ua)

  if (!isGoodCrawler && shouldBlock(request)) {
    return new NextResponse('Forbidden', { status: 403 })
  }

  // --- Rate limiting ---
  if (!isPrefetch(request)) {
    const ip = getClientIp(request)
    const cap = isGoodCrawler
      ? RATE_LIMIT_CRAWLER
      : request.nextUrl.pathname.startsWith('/api/')
        ? RATE_LIMIT_API
        : RATE_LIMIT_PAGE
    const { allowed } = checkRateLimit(ip, cap, 60_000)
    if (!allowed) {
      return tooManyRequests(request)
    }
  }

  // Propagate the pathname as a response header so server layouts can read it
  // via next/headers — used to pick html lang + hide Header/Footer on SEA landing pages.
  const requestHeaders = new Headers(request.headers)
  requestHeaders.set('x-pathname', request.nextUrl.pathname)

  // Create a simple response object
  let response = NextResponse.next({
    request: { headers: requestHeaders },
  })

  // Auth gating only matters on these routes. Everything else (blog, products,
  // home — the entire anonymous surface) returns immediately: the Supabase
  // getSession()/refreshSession() round-trip below costs a network hop to
  // Supabase on EVERY page view and was a primary TTFB contributor.
  const AUTH_ROUTES = ['/pricing', '/dashboard', '/profile', '/settings', '/user', '/admin', '/login']
  const needsAuth = AUTH_ROUTES.some(route =>
    request.nextUrl.pathname === route || request.nextUrl.pathname.startsWith(route + '/'))
  if (!needsAuth) {
    return response
  }

  try {
    console.log('Middleware running for:', request.nextUrl.pathname)
    console.log('Request cookies:', request.cookies.getAll().map(c => `${c.name}=${c.value.substring(0, 20)}...`))
    
    // Create Supabase client
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            const cookie = request.cookies.get(name)?.value
            console.log(`Getting cookie ${name}:`, cookie ? `${cookie.substring(0, 20)}...` : 'not found')
            return cookie
          },
          set(name: string, value: string, options: any) {
            console.log(`Setting cookie ${name}:`, value.substring(0, 20) + '...')
            // Set cookie in both request and response
            response.cookies.set({
              name,
              value,
              ...options,
            })
          },
          remove(name: string, options: any) {
            console.log(`Removing cookie ${name}`)
            // Remove cookie from both request and response
            response.cookies.delete({
              name,
              ...options,
            })
          },
        },
      }
    )

    // Check session with refresh attempt
    let { data } = await supabase.auth.getSession()
    let session = data.session
    
    console.log('Initial session:', session ? 'found' : 'not found')

    // If no session found, try to refresh
    if (!session) {
      console.log('Attempting to refresh session...')
      const { data: refreshData } = await supabase.auth.refreshSession()
      session = refreshData.session
      console.log('Refreshed session:', session ? 'found' : 'not found')
    }

    // Only protect specific routes that require authentication
    // Public pages (home, blog, about, etc.) can be freely accessed
    const protectedRoutes = ['/pricing', '/dashboard', '/profile', '/settings', '/user'] // Added /pricing
    const isProtectedRoute = protectedRoutes.some(route =>
      request.nextUrl.pathname === route || request.nextUrl.pathname.startsWith(route + '/'))

    // If accessing a protected route without being logged in, redirect to the login page
    if (isProtectedRoute && !session) {
      console.log('No session found for protected route:', request.nextUrl.pathname)
      // Redirect to login with the current path as next parameter
      const loginUrl = new URL('/login', request.url)
      loginUrl.searchParams.set('next', request.nextUrl.pathname)
      return NextResponse.redirect(loginUrl)
    }

    // Additional check for /pricing route - verify email confirmation
    if (request.nextUrl.pathname.startsWith('/pricing') && session) {
      const user = session.user
      const confirmed = user.email_confirmed_at || (user as any)?.confirmed_at

      if (!confirmed) {
        console.log('User email not confirmed for pricing route:', user.email)
        const loginUrl = new URL('/login', request.url)
        loginUrl.searchParams.set('next', request.nextUrl.pathname)
        loginUrl.searchParams.set('unconfirmed', '1')
        return NextResponse.redirect(loginUrl)
      }
    }

    // 暂时注释掉admin路由的保护，允许所有用户访问
    console.log('Allowing access to admin route for testing purposes')
    /*
    // For admin routes, check user role
    if (request.nextUrl.pathname.startsWith('/admin') && session) {
      try {
        console.log('Admin route access attempt by user:', session.user.email, 'ID:', session.user.id)
        
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', session.user.id)
          .maybeSingle()

        console.log('Profile query result:', { profile, error: error?.message })

        // 暂时允许任何有session的用户访问admin页面
        if (!profile) {
          console.log('No profile found, but allowing access since user has session')
        } else {
          console.log('Profile found:', profile)
        }
        
        // if (!profile || (profile.role !== 'admin' && profile.role !== 'author')) {
        //   console.log('User does not have admin access:', session.user.email, 'Profile:', profile)
        //   return NextResponse.redirect(new URL('/', request.url))
        // }
        
        console.log('Admin access granted for user:', session.user.email, 'Role:', profile?.role || 'no profile')
      } catch (error) {
        console.error('Error checking user role:', error)
        // Allow access if role check fails to avoid breaking the app
        console.log('Allowing access due to role check error')
      }
    }
    */

    return response
  } catch (error) {
    console.error('Middleware error:', error)
    // Allow the request to continue even if an error occurs
    return response
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization)
     * - favicon.ico, favicon.png
     * - public assets (images, fonts, etc.)
     */
    '/((?!_next/static|_next/image|favicon\\.ico|favicon\\.png|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|woff|woff2|ttf|eot|txt|xml|json)).*)',
  ],
}
