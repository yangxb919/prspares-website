import { createPublicClient } from './supabase-public'

export async function ensureStorageSetup() {
  const supabase = createPublicClient()
  
  try {
    // 检查post-images存储桶是否存在
    const { data: buckets, error: listError } = await supabase.storage.listBuckets()
    
    if (listError) {
      console.error('无法列出存储桶:', listError)
      return false
    }
    
    const postImagesBucket = buckets?.find(bucket => bucket.id === 'post-images')
    
    if (!postImagesBucket) {
      console.log('post-images存储桶不存在，尝试创建...')
      
      // 创建post-images存储桶
      const { error: createError } = await supabase.storage.createBucket('post-images', {
        public: true,
        allowedMimeTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
        fileSizeLimit: 5 * 1024 * 1024 // 5MB
      })
      
      if (createError) {
        console.error('创建存储桶失败:', createError)
        return false
      }
      
      console.log('post-images存储桶创建成功')
    } else {
      console.log('post-images存储桶已存在')
    }
    
    return true
  } catch (error) {
    console.error('存储设置检查失败:', error)
    return false
  }
}

// 确保产品图片存储桶存在
export async function ensureProductImagesSetup() {
  const supabase = createPublicClient()
  
  try {
    // 检查product-images存储桶是否存在
    const { data: buckets, error: listError } = await supabase.storage.listBuckets()
    
    if (listError) {
      console.error('无法列出存储桶:', listError)
      return false
    }
    
    const productImagesBucket = buckets?.find(bucket => bucket.id === 'product-images')
    
    if (!productImagesBucket) {
      console.log('product-images存储桶不存在，尝试创建...')
      
      // 创建product-images存储桶
      const { error: createError } = await supabase.storage.createBucket('product-images', {
        public: true,
        allowedMimeTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
        fileSizeLimit: 10 * 1024 * 1024 // 10MB for product images
      })
      
      if (createError) {
        console.error('创建product-images存储桶失败:', createError)
        return false
      }
      
      console.log('product-images存储桶创建成功')
    } else {
      console.log('product-images存储桶已存在')
    }
    
    return true
  } catch (error) {
    console.error('产品图片存储设置检查失败:', error)
    return false
  }
}

// 测试上传功能
export async function testImageUpload() {
  const supabase = createPublicClient()
  
  try {
    // 创建一个小的测试文件
    const testBlob = new Blob(['test'], { type: 'text/plain' })
    const testFile = new File([testBlob], 'test.txt', { type: 'text/plain' })
    
    const { error } = await supabase.storage
      .from('post-images')
      .upload('test/test.txt', testFile)
    
    if (error) {
      console.error('测试上传失败:', error)
      return false
    }
    
    // 删除测试文件
    await supabase.storage
      .from('post-images')
      .remove(['test/test.txt'])
    
    console.log('存储功能测试成功')
    return true
  } catch (error) {
    console.error('存储功能测试失败:', error)
    return false
  }
}

// 测试产品图片上传功能
export async function testProductImageUpload() {
  const supabase = createPublicClient()
  
  try {
    // 创建一个小的测试文件
    const testBlob = new Blob(['test'], { type: 'text/plain' })
    const testFile = new File([testBlob], 'test.txt', { type: 'text/plain' })
    
    const { error } = await supabase.storage
      .from('product-images')
      .upload('test/test.txt', testFile)
    
    if (error) {
      console.error('产品图片测试上传失败:', error)
      return false
    }
    
    // 删除测试文件
    await supabase.storage
      .from('product-images')
      .remove(['test/test.txt'])
    
    console.log('产品图片存储功能测试成功')
    return true
  } catch (error) {
    console.error('产品图片存储功能测试失败:', error)
    return false
  }
} 