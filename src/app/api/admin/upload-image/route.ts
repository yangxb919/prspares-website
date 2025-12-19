
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase-server'
import sharp from 'sharp'

export async function POST(req: NextRequest) {
    try {
        const supabase = createClient()

        // Check authentication
        const { data: { user }, error: authError } = await supabase.auth.getUser()
        if (authError || !user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const formData = await req.formData()
        const file = formData.get('file') as File
        const bucket = formData.get('bucket') as string || 'product-images'
        const customPath = formData.get('path') as string

        if (!file) {
            return NextResponse.json({ error: 'No file provided' }, { status: 400 })
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
        const fileName = customPath || `${Date.now()}_${Math.random().toString(36).substr(2, 9)}.${fileExt}`

        // Upload to Supabase
        const { data, error } = await supabase.storage
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
        const { data: { publicUrl } } = supabase.storage
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
