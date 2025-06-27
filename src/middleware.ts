import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  // Create a simple response object
  let response = NextResponse.next()

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
    const protectedRoutes = ['/dashboard', '/profile', '/settings', '/user'] // 暂时移除 '/admin'
    const isProtectedRoute = protectedRoutes.some(route => 
      request.nextUrl.pathname === route || request.nextUrl.pathname.startsWith(route + '/'))

    // If accessing a protected route without being logged in, redirect to the login page
    if (isProtectedRoute && !session) {
      console.log('No session found for protected route:', request.nextUrl.pathname)
      // 使用相对URL进行重定向，避免硬编码的域名问题
      return NextResponse.redirect(new URL('/auth/signin', request.url))
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
  matcher: ['/dashboard', '/profile', '/settings', '/user/:path*'], // 暂时移除 '/admin', '/admin/:path*'
}
