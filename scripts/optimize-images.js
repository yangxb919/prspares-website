const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

// 配置
const CONFIG = {
  inputDir: 'public/images',
  outputDir: 'public/images/optimized',
  backupDir: 'public/images/backup',
  formats: ['webp', 'avif', 'jpeg'],
  quality: {
    jpeg: 85,
    webp: 85,
    avif: 80
  },
  sizes: {
    hero: [1200, 800, 600, 400],
    product: [800, 600, 400, 300],
    tool: [600, 400, 300, 200],
    thumbnail: [300, 200, 150]
  }
};

// 确保目录存在
function ensureDir(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

// 获取图片类型
function getImageType(filename) {
  if (filename.includes('hero')) return 'hero';
  if (filename.includes('tool')) return 'tool';
  if (filename.includes('thumb')) return 'thumbnail';
  return 'product';
}

// 压缩单个图片
async function optimizeImage(inputPath, outputDir, filename) {
  try {
    const imageType = getImageType(filename);
    const sizes = CONFIG.sizes[imageType];
    const baseName = path.parse(filename).name;
    
    console.log(`处理图片: ${filename} (类型: ${imageType})`);
    
    // 创建不同格式和尺寸的图片
    for (const format of CONFIG.formats) {
      for (const width of sizes) {
        const outputFilename = `${baseName}-${width}w.${format}`;
        const outputPath = path.join(outputDir, outputFilename);
        
        let sharpInstance = sharp(inputPath)
          .resize(width, null, {
            withoutEnlargement: true,
            fit: 'inside'
          });
        
        // 根据格式设置质量
        switch (format) {
          case 'jpeg':
            sharpInstance = sharpInstance.jpeg({ 
              quality: CONFIG.quality.jpeg,
              progressive: true
            });
            break;
          case 'webp':
            sharpInstance = sharpInstance.webp({ 
              quality: CONFIG.quality.webp,
              effort: 6
            });
            break;
          case 'avif':
            sharpInstance = sharpInstance.avif({ 
              quality: CONFIG.quality.avif,
              effort: 6
            });
            break;
        }
        
        await sharpInstance.toFile(outputPath);
        
        // 获取文件大小信息
        const originalSize = fs.statSync(inputPath).size;
        const optimizedSize = fs.statSync(outputPath).size;
        const savings = ((originalSize - optimizedSize) / originalSize * 100).toFixed(1);
        
        console.log(`  ✓ ${outputFilename} (节省 ${savings}%)`);
      }
    }
    
    return true;
  } catch (error) {
    console.error(`处理图片失败 ${filename}:`, error.message);
    return false;
  }
}

// 备份原始图片
function backupOriginalImages() {
  console.log('备份原始图片...');
  ensureDir(CONFIG.backupDir);

  function copyRecursive(src, dest) {
    const stats = fs.statSync(src);

    if (stats.isDirectory()) {
      // 跳过备份和优化目录，避免递归
      const dirName = path.basename(src);
      if (dirName === 'backup' || dirName === 'optimized') {
        return;
      }

      ensureDir(dest);
      const files = fs.readdirSync(src);
      files.forEach(file => {
        const srcPath = path.join(src, file);
        const destPath = path.join(dest, file);
        copyRecursive(srcPath, destPath);
      });
    } else if (stats.isFile() && /\.(jpg|jpeg|png|gif)$/i.test(src)) {
      fs.copyFileSync(src, dest);
      console.log(`  备份: ${path.relative(CONFIG.inputDir, src)}`);
    }
  }

  copyRecursive(CONFIG.inputDir, CONFIG.backupDir);
}

// 获取所有图片文件
function getAllImageFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);

  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stats = fs.statSync(filePath);

    if (stats.isDirectory()) {
      // 跳过备份和优化目录
      if (file !== 'backup' && file !== 'optimized') {
        getAllImageFiles(filePath, fileList);
      }
    } else if (stats.isFile() && /\.(jpg|jpeg|png|gif)$/i.test(file)) {
      fileList.push({
        path: filePath,
        name: file,
        relativePath: path.relative(CONFIG.inputDir, filePath)
      });
    }
  });

  return fileList;
}

// 生成图片映射文件
function generateImageMap(optimizedImages) {
  const imageMap = {};
  
  optimizedImages.forEach(img => {
    const baseName = path.parse(img.name).name;
    const imageType = getImageType(img.name);
    const sizes = CONFIG.sizes[imageType];
    
    imageMap[img.relativePath] = {
      original: img.relativePath,
      type: imageType,
      formats: {}
    };
    
    CONFIG.formats.forEach(format => {
      imageMap[img.relativePath].formats[format] = sizes.map(width => 
        `images/optimized/${baseName}-${width}w.${format}`
      );
    });
  });
  
  const mapPath = path.join(CONFIG.outputDir, 'image-map.json');
  fs.writeFileSync(mapPath, JSON.stringify(imageMap, null, 2));
  console.log(`图片映射文件已生成: ${mapPath}`);
}

// 主函数
async function main() {
  console.log('🖼️  开始图片优化...\n');
  
  // 确保输出目录存在
  ensureDir(CONFIG.outputDir);
  
  // 备份原始图片
  if (!fs.existsSync(CONFIG.backupDir)) {
    backupOriginalImages();
  } else {
    console.log('备份目录已存在，跳过备份步骤');
  }
  
  // 获取所有图片文件
  const imageFiles = getAllImageFiles(CONFIG.inputDir);
  console.log(`\n找到 ${imageFiles.length} 个图片文件\n`);
  
  // 处理每个图片
  let successCount = 0;
  let totalOriginalSize = 0;
  let totalOptimizedSize = 0;
  
  for (const imageFile of imageFiles) {
    const success = await optimizeImage(
      imageFile.path, 
      CONFIG.outputDir, 
      imageFile.name
    );
    
    if (success) {
      successCount++;
      totalOriginalSize += fs.statSync(imageFile.path).size;
    }
  }
  
  // 计算优化后的总大小
  const optimizedFiles = fs.readdirSync(CONFIG.outputDir);
  optimizedFiles.forEach(file => {
    if (file !== 'image-map.json') {
      totalOptimizedSize += fs.statSync(path.join(CONFIG.outputDir, file)).size;
    }
  });
  
  // 生成图片映射
  generateImageMap(imageFiles);
  
  // 输出统计信息
  console.log('\n📊 优化完成统计:');
  console.log(`✓ 成功处理: ${successCount}/${imageFiles.length} 个图片`);
  console.log(`📦 原始大小: ${(totalOriginalSize / 1024 / 1024).toFixed(2)} MB`);
  console.log(`🗜️  优化后大小: ${(totalOptimizedSize / 1024 / 1024).toFixed(2)} MB`);
  console.log(`💾 节省空间: ${((totalOriginalSize - totalOptimizedSize) / totalOriginalSize * 100).toFixed(1)}%`);
  console.log(`🎯 生成文件: ${optimizedFiles.length - 1} 个优化图片`);
}

// 运行脚本
if (require.main === module) {
  main().catch(console.error);
}

module.exports = { optimizeImage, CONFIG };
