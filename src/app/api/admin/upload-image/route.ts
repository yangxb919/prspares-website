
import { NextRequest, NextResponse } from 'next/server'
import { createClient as createSupabaseClient } from '@supabase/supabase-js'
import { createClient as createServerSupabaseClient } from '@/utils/supabase-server'
import sharp from 'sharp'

export async function POST(req: NextRequest) {
    try {
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
        const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
        const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE

        if (!supabaseUrl || !anonKey) {
            return NextResponse.json({ error: 'Supabase not configured' }, { status: 500 })
        }

        const isDev = process.env.NODE_ENV !== 'production'
        const host = req.headers.get('host') || ''
        const isLocalhost =
            host.startsWith('localhost') ||
            host.startsWith('127.0.0.1') ||
            host.startsWith('[::1]')

        const formData = await req.formData()
        const file = formData.get('file') as File
        const bucket = (formData.get('bucket') ?? 'product-images').toString()
        const customPath = formData.get('path')?.toString()

        if (!file) {
            return NextResponse.json({ error: 'No file provided' }, { status: 400 })
        }

        const allowedBuckets = new Set(['product-images', 'post-images'])
        if (!allowedBuckets.has(bucket)) {
            return NextResponse.json({ error: 'Invalid bucket' }, { status: 400 })
        }

        // Dev-only bypass: if Supabase Auth is down (or not configured with redirects),
        // still allow local development uploads on localhost.
        const bypassAuth = isDev && isLocalhost

        // Cookie-based auth (works when using @supabase/ssr cookies)
        const cookieClient = bypassAuth ? null : createServerSupabaseClient()
        const { data: cookieAuth, error: cookieAuthError } = bypassAuth
            ? { data: { user: null }, error: null }
            : await cookieClient!.auth.getUser()

        // Bearer token auth (works when client only has localStorage session)
        const authHeader = req.headers.get('authorization') || ''
        const bearerToken = authHeader.toLowerCase().startsWith('bearer ')
            ? authHeader.slice('bearer '.length).trim()
            : null

        let user = cookieAuth?.user ?? null
        if (!user && !bypassAuth) {
            if (!bearerToken) {
                if (cookieAuthError) {
                    console.error('Cookie auth error:', cookieAuthError)
                }
                return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
            }

            const tokenClient = createSupabaseClient(supabaseUrl, anonKey, {
                auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
            })
            const { data: tokenAuth, error: tokenAuthError } = await tokenClient.auth.getUser(bearerToken)
            if (tokenAuthError || !tokenAuth?.user) {
                console.error('Bearer auth error:', tokenAuthError)
                return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
            }
            user = tokenAuth.user
        }

        // Server-side privileged client for role check + storage upload
        const effectiveKey = serviceRoleKey || anonKey
        const supabaseAdmin = createSupabaseClient(supabaseUrl, effectiveKey)

        if (!bypassAuth) {
            // Enforce admin/author access (avoid an open upload endpoint)
            const { data: profile, error: profileError } = await supabaseAdmin
                .from('profiles')
                .select('role')
                .eq('id', user!.id)
                .maybeSingle()

            if (profileError) {
                console.error('Profile lookup error:', profileError)
                // Dev-friendly fallback: don't block upload if profiles table/RLS is misconfigured locally.
                if (!isDev) {
                    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
                }
            }

            const role = profile?.role
            if (role !== 'admin' && role !== 'author') {
                if (!isDev) {
                    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
                }
            }
        }

        // Convert File to Buffer
        const arrayBuffer = await file.arrayBuffer()
        const buffer = Buffer.from(arrayBuffer)

        // Process image with sharp
        // Resize to max width 1920px, convert to webp, quality 80
        const processedBuffer = await sharp(buffer)
            .resize(1920, null, {
                fit: 'inside',
                withoutEnlargement: true
            })
            .webp({ quality: 80 })
            .toBuffer()

        const fileExt = 'webp' // Always webp
        let fileName = customPath || `${Date.now()}_${Math.random().toString(36).substr(2, 9)}.${fileExt}`
        if (!fileName.toLowerCase().endsWith(`.${fileExt}`)) {
            // If a custom path was provided without an extension (or with a different one),
            // normalize it to .webp to match the actual processed output.
            fileName = fileName.replace(/\.[^/.]+$/, '')
            fileName = `${fileName}.${fileExt}`
        }

        // Upload to Supabase
        const { data, error } = await supabaseAdmin.storage
            .from(bucket)
            .upload(fileName, processedBuffer, {
                contentType: 'image/webp',
                cacheControl: '31536000', // 1 year cache for optimized images
                upsert: false
            })

        if (error) {
            console.error('Supabase upload error:', error)
            return NextResponse.json({ error: error.message }, { status: 500 })
        }

        // Get public URL
        const { data: { publicUrl } } = supabaseAdmin.storage
            .from(bucket)
            .getPublicUrl(fileName)

        return NextResponse.json({
            url: publicUrl,
            fileName: fileName
        })

    } catch (error: any) {
        console.error('Image upload processing error:', error)
        return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 })
    }
}
