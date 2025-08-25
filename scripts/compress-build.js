const fs = require('fs');
const path = require('path');
const zlib = require('zlib');
const { promisify } = require('util');

// 配置
const CONFIG = {
  buildDir: '.next',
  outputDir: '.next/compressed',
  staticDir: '.next/static',
  compressionLevel: 9, // 最高压缩级别
  extensions: ['.js', '.css', '.html', '.json', '.svg'],
  minFileSize: 1024, // 只压缩大于1KB的文件
};

// 异步函数
const gzip = promisify(zlib.gzip);
const brotli = promisify(zlib.brotliCompress);
const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);
const mkdir = promisify(fs.mkdir);

// 确保目录存在
async function ensureDir(dir) {
  try {
    await mkdir(dir, { recursive: true });
  } catch (error) {
    if (error.code !== 'EEXIST') {
      throw error;
    }
  }
}

// 获取文件大小
function getFileSize(filePath) {
  try {
    return fs.statSync(filePath).size;
  } catch {
    return 0;
  }
}

// 格式化文件大小
function formatSize(bytes) {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// 压缩单个文件
async function compressFile(filePath, outputDir) {
  const fileName = path.basename(filePath);
  const fileSize = getFileSize(filePath);
  
  // 跳过小文件
  if (fileSize < CONFIG.minFileSize) {
    return null;
  }
  
  try {
    const content = await readFile(filePath);
    const stats = {
      original: fileSize,
      gzip: 0,
      brotli: 0,
      file: fileName
    };
    
    // Gzip 压缩
    const gzipContent = await gzip(content, { level: CONFIG.compressionLevel });
    const gzipPath = path.join(outputDir, `${fileName}.gz`);
    await writeFile(gzipPath, gzipContent);
    stats.gzip = gzipContent.length;
    
    // Brotli 压缩
    const brotliContent = await brotli(content, {
      params: {
        [zlib.constants.BROTLI_PARAM_QUALITY]: 11, // 最高质量
        [zlib.constants.BROTLI_PARAM_SIZE_HINT]: content.length,
      }
    });
    const brotliPath = path.join(outputDir, `${fileName}.br`);
    await writeFile(brotliPath, brotliContent);
    stats.brotli = brotliContent.length;
    
    return stats;
  } catch (error) {
    console.error(`压缩文件失败 ${fileName}:`, error.message);
    return null;
  }
}

// 递归获取所有文件
function getAllFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stats = fs.statSync(filePath);
    
    if (stats.isDirectory()) {
      // 跳过某些目录
      if (!['node_modules', '.git', 'compressed'].includes(file)) {
        getAllFiles(filePath, fileList);
      }
    } else if (stats.isFile()) {
      const ext = path.extname(file);
      if (CONFIG.extensions.includes(ext)) {
        fileList.push(filePath);
      }
    }
  });
  
  return fileList;
}

// 分析构建产物
async function analyzeBuild() {
  console.log('📊 分析构建产物...\n');
  
  const staticFiles = getAllFiles(CONFIG.staticDir);
  let totalOriginal = 0;
  let totalGzip = 0;
  let totalBrotli = 0;
  
  console.log('文件类型分析:');
  const fileTypes = {};
  
  staticFiles.forEach(file => {
    const ext = path.extname(file);
    const size = getFileSize(file);
    
    if (!fileTypes[ext]) {
      fileTypes[ext] = { count: 0, size: 0 };
    }
    
    fileTypes[ext].count++;
    fileTypes[ext].size += size;
    totalOriginal += size;
  });
  
  // 显示文件类型统计
  Object.entries(fileTypes).forEach(([ext, data]) => {
    console.log(`  ${ext}: ${data.count} 个文件, ${formatSize(data.size)}`);
  });
  
  console.log(`\n总计: ${staticFiles.length} 个文件, ${formatSize(totalOriginal)}\n`);
  
  return { staticFiles, totalOriginal };
}

// 主压缩函数
async function compressBuild() {
  console.log('🗜️  开始构建产物压缩...\n');
  
  // 分析构建产物
  const { staticFiles, totalOriginal } = await analyzeBuild();
  
  // 确保输出目录存在
  await ensureDir(CONFIG.outputDir);
  
  // 压缩统计
  const compressionStats = [];
  let processedFiles = 0;
  
  console.log('压缩进度:');
  
  // 并行压缩文件 (限制并发数)
  const concurrency = 5;
  const chunks = [];
  for (let i = 0; i < staticFiles.length; i += concurrency) {
    chunks.push(staticFiles.slice(i, i + concurrency));
  }
  
  for (const chunk of chunks) {
    const promises = chunk.map(async (file) => {
      const relativePath = path.relative(CONFIG.staticDir, file);
      const outputDir = path.join(CONFIG.outputDir, path.dirname(relativePath));
      await ensureDir(outputDir);
      
      const stats = await compressFile(file, outputDir);
      if (stats) {
        compressionStats.push(stats);
      }
      
      processedFiles++;
      const progress = ((processedFiles / staticFiles.length) * 100).toFixed(1);
      process.stdout.write(`\r  处理进度: ${progress}% (${processedFiles}/${staticFiles.length})`);
    });
    
    await Promise.all(promises);
  }
  
  console.log('\n\n📈 压缩统计报告:');
  
  // 计算总体统计
  const totalStats = compressionStats.reduce((acc, stats) => {
    acc.original += stats.original;
    acc.gzip += stats.gzip;
    acc.brotli += stats.brotli;
    return acc;
  }, { original: 0, gzip: 0, brotli: 0 });
  
  const gzipSavings = ((totalStats.original - totalStats.gzip) / totalStats.original * 100).toFixed(1);
  const brotliSavings = ((totalStats.original - totalStats.brotli) / totalStats.original * 100).toFixed(1);
  
  console.log(`\n✅ 压缩完成:`);
  console.log(`📦 原始大小: ${formatSize(totalStats.original)}`);
  console.log(`🗜️  Gzip 压缩: ${formatSize(totalStats.gzip)} (节省 ${gzipSavings}%)`);
  console.log(`🚀 Brotli 压缩: ${formatSize(totalStats.brotli)} (节省 ${brotliSavings}%)`);
  console.log(`📁 压缩文件: ${compressionStats.length * 2} 个`);
  
  // 显示最大的文件
  console.log(`\n📋 最大的文件 (前10个):`);
  const sortedStats = compressionStats
    .sort((a, b) => b.original - a.original)
    .slice(0, 10);
    
  sortedStats.forEach((stats, index) => {
    const gzipSaving = ((stats.original - stats.gzip) / stats.original * 100).toFixed(1);
    const brotliSaving = ((stats.original - stats.brotli) / stats.original * 100).toFixed(1);
    console.log(`  ${index + 1}. ${stats.file}`);
    console.log(`     原始: ${formatSize(stats.original)} | Gzip: ${formatSize(stats.gzip)} (-${gzipSaving}%) | Brotli: ${formatSize(stats.brotli)} (-${brotliSaving}%)`);
  });
  
  // 生成压缩报告
  const report = {
    timestamp: new Date().toISOString(),
    totalFiles: staticFiles.length,
    compressedFiles: compressionStats.length,
    originalSize: totalStats.original,
    gzipSize: totalStats.gzip,
    brotliSize: totalStats.brotli,
    gzipSavings: parseFloat(gzipSavings),
    brotliSavings: parseFloat(brotliSavings),
    topFiles: sortedStats
  };
  
  await writeFile(
    path.join(CONFIG.outputDir, 'compression-report.json'),
    JSON.stringify(report, null, 2)
  );
  
  console.log(`\n📄 压缩报告已保存: ${path.join(CONFIG.outputDir, 'compression-report.json')}`);
}

// 运行脚本
if (require.main === module) {
  compressBuild().catch(console.error);
}

module.exports = { compressBuild, CONFIG };
