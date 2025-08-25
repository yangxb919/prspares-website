const fs = require('fs');
const path = require('path');

// 配置
const CONFIG = {
  buildDir: '.next',
  staticDir: '.next/static',
  outputFile: 'bundle-analysis.json',
  reportFile: 'bundle-report.html'
};

// 格式化文件大小
function formatSize(bytes) {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// 获取文件信息
function getFileInfo(filePath) {
  const stats = fs.statSync(filePath);
  const ext = path.extname(filePath);
  const name = path.basename(filePath);
  
  return {
    name,
    path: filePath,
    size: stats.size,
    extension: ext,
    type: getFileType(ext),
    isChunk: name.includes('chunk') || name.includes('pages'),
    isVendor: name.includes('vendor') || name.includes('node_modules'),
    lastModified: stats.mtime
  };
}

// 获取文件类型
function getFileType(ext) {
  const types = {
    '.js': 'JavaScript',
    '.css': 'CSS',
    '.html': 'HTML',
    '.json': 'JSON',
    '.svg': 'SVG',
    '.png': 'Image',
    '.jpg': 'Image',
    '.jpeg': 'Image',
    '.gif': 'Image',
    '.webp': 'Image',
    '.avif': 'Image',
    '.woff': 'Font',
    '.woff2': 'Font',
    '.ttf': 'Font',
    '.eot': 'Font'
  };
  
  return types[ext] || 'Other';
}

// 递归获取所有文件
function getAllFiles(dir, baseDir = dir) {
  const files = [];
  
  if (!fs.existsSync(dir)) {
    return files;
  }
  
  const items = fs.readdirSync(dir);
  
  items.forEach(item => {
    const itemPath = path.join(dir, item);
    const stats = fs.statSync(itemPath);
    
    if (stats.isDirectory()) {
      // 跳过某些目录
      if (!['node_modules', '.git', 'cache'].includes(item)) {
        files.push(...getAllFiles(itemPath, baseDir));
      }
    } else if (stats.isFile()) {
      const relativePath = path.relative(baseDir, itemPath);
      files.push({
        ...getFileInfo(itemPath),
        relativePath
      });
    }
  });
  
  return files;
}

// 分析构建产物
function analyzeBuild() {
  console.log('📊 开始分析构建产物...\n');
  
  // 获取所有文件
  const allFiles = getAllFiles(CONFIG.buildDir);
  const staticFiles = getAllFiles(CONFIG.staticDir);
  
  // 按类型分组
  const filesByType = {};
  const filesByExtension = {};
  let totalSize = 0;
  
  allFiles.forEach(file => {
    // 按类型分组
    if (!filesByType[file.type]) {
      filesByType[file.type] = [];
    }
    filesByType[file.type].push(file);
    
    // 按扩展名分组
    if (!filesByExtension[file.extension]) {
      filesByExtension[file.extension] = [];
    }
    filesByExtension[file.extension].push(file);
    
    totalSize += file.size;
  });
  
  // 生成统计信息
  const analysis = {
    timestamp: new Date().toISOString(),
    totalFiles: allFiles.length,
    totalSize,
    staticFiles: staticFiles.length,
    
    // 按类型统计
    byType: Object.entries(filesByType).map(([type, files]) => ({
      type,
      count: files.length,
      totalSize: files.reduce((sum, f) => sum + f.size, 0),
      files: files.sort((a, b) => b.size - a.size).slice(0, 10) // 只保留最大的10个文件
    })).sort((a, b) => b.totalSize - a.totalSize),
    
    // 按扩展名统计
    byExtension: Object.entries(filesByExtension).map(([ext, files]) => ({
      extension: ext,
      count: files.length,
      totalSize: files.reduce((sum, f) => sum + f.size, 0),
      averageSize: files.reduce((sum, f) => sum + f.size, 0) / files.length
    })).sort((a, b) => b.totalSize - a.totalSize),
    
    // 最大的文件
    largestFiles: allFiles.sort((a, b) => b.size - a.size).slice(0, 20),
    
    // JavaScript 分析
    javascript: analyzeJavaScript(allFiles.filter(f => f.extension === '.js')),
    
    // CSS 分析
    css: analyzeCSS(allFiles.filter(f => f.extension === '.css')),
    
    // 图片分析
    images: analyzeImages(allFiles.filter(f => f.type === 'Image'))
  };
  
  return analysis;
}

// 分析 JavaScript 文件
function analyzeJavaScript(jsFiles) {
  const chunks = jsFiles.filter(f => f.isChunk);
  const vendors = jsFiles.filter(f => f.isVendor);
  const pages = jsFiles.filter(f => f.name.includes('pages'));
  
  return {
    totalFiles: jsFiles.length,
    totalSize: jsFiles.reduce((sum, f) => sum + f.size, 0),
    chunks: {
      count: chunks.length,
      size: chunks.reduce((sum, f) => sum + f.size, 0)
    },
    vendors: {
      count: vendors.length,
      size: vendors.reduce((sum, f) => sum + f.size, 0)
    },
    pages: {
      count: pages.length,
      size: pages.reduce((sum, f) => sum + f.size, 0)
    },
    largest: jsFiles.sort((a, b) => b.size - a.size).slice(0, 10)
  };
}

// 分析 CSS 文件
function analyzeCSS(cssFiles) {
  return {
    totalFiles: cssFiles.length,
    totalSize: cssFiles.reduce((sum, f) => sum + f.size, 0),
    largest: cssFiles.sort((a, b) => b.size - a.size).slice(0, 10)
  };
}

// 分析图片文件
function analyzeImages(imageFiles) {
  const byFormat = {};
  
  imageFiles.forEach(file => {
    const format = file.extension.toLowerCase();
    if (!byFormat[format]) {
      byFormat[format] = [];
    }
    byFormat[format].push(file);
  });
  
  return {
    totalFiles: imageFiles.length,
    totalSize: imageFiles.reduce((sum, f) => sum + f.size, 0),
    byFormat: Object.entries(byFormat).map(([format, files]) => ({
      format,
      count: files.length,
      totalSize: files.reduce((sum, f) => sum + f.size, 0)
    })),
    largest: imageFiles.sort((a, b) => b.size - a.size).slice(0, 10)
  };
}

// 生成 HTML 报告
function generateHTMLReport(analysis) {
  const html = `
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Bundle 分析报告</title>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin: 0; padding: 20px; background: #f5f5f5; }
        .container { max-width: 1200px; margin: 0 auto; }
        .header { background: white; padding: 20px; border-radius: 8px; margin-bottom: 20px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
        .card { background: white; padding: 20px; border-radius: 8px; margin-bottom: 20px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
        .grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 20px; }
        .stat { text-align: center; padding: 15px; background: #f8f9fa; border-radius: 6px; }
        .stat-value { font-size: 2em; font-weight: bold; color: #007bff; }
        .stat-label { color: #666; margin-top: 5px; }
        table { width: 100%; border-collapse: collapse; margin-top: 15px; }
        th, td { padding: 12px; text-align: left; border-bottom: 1px solid #eee; }
        th { background: #f8f9fa; font-weight: 600; }
        .size { font-family: monospace; }
        .progress-bar { width: 100%; height: 20px; background: #e9ecef; border-radius: 10px; overflow: hidden; }
        .progress-fill { height: 100%; background: linear-gradient(90deg, #007bff, #0056b3); }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>📊 Bundle 分析报告</h1>
            <p>生成时间: ${new Date(analysis.timestamp).toLocaleString('zh-CN')}</p>
        </div>
        
        <div class="grid">
            <div class="stat">
                <div class="stat-value">${analysis.totalFiles}</div>
                <div class="stat-label">总文件数</div>
            </div>
            <div class="stat">
                <div class="stat-value">${formatSize(analysis.totalSize)}</div>
                <div class="stat-label">总大小</div>
            </div>
            <div class="stat">
                <div class="stat-value">${analysis.staticFiles}</div>
                <div class="stat-label">静态文件</div>
            </div>
        </div>
        
        <div class="card">
            <h2>📁 按文件类型分析</h2>
            <table>
                <thead>
                    <tr><th>类型</th><th>文件数</th><th>总大小</th><th>占比</th></tr>
                </thead>
                <tbody>
                    ${analysis.byType.map(type => `
                        <tr>
                            <td>${type.type}</td>
                            <td>${type.count}</td>
                            <td class="size">${formatSize(type.totalSize)}</td>
                            <td>
                                <div class="progress-bar">
                                    <div class="progress-fill" style="width: ${(type.totalSize / analysis.totalSize * 100).toFixed(1)}%"></div>
                                </div>
                                ${(type.totalSize / analysis.totalSize * 100).toFixed(1)}%
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>
        
        <div class="card">
            <h2>📄 最大的文件</h2>
            <table>
                <thead>
                    <tr><th>文件名</th><th>类型</th><th>大小</th><th>路径</th></tr>
                </thead>
                <tbody>
                    ${analysis.largestFiles.slice(0, 15).map(file => `
                        <tr>
                            <td>${file.name}</td>
                            <td>${file.type}</td>
                            <td class="size">${formatSize(file.size)}</td>
                            <td><code>${file.relativePath}</code></td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>
        
        <div class="grid">
            <div class="card">
                <h3>🟨 JavaScript 分析</h3>
                <p><strong>总大小:</strong> ${formatSize(analysis.javascript.totalSize)}</p>
                <p><strong>文件数:</strong> ${analysis.javascript.totalFiles}</p>
                <p><strong>代码块:</strong> ${analysis.javascript.chunks.count} 个 (${formatSize(analysis.javascript.chunks.size)})</p>
                <p><strong>第三方库:</strong> ${analysis.javascript.vendors.count} 个 (${formatSize(analysis.javascript.vendors.size)})</p>
            </div>
            
            <div class="card">
                <h3>🎨 CSS 分析</h3>
                <p><strong>总大小:</strong> ${formatSize(analysis.css.totalSize)}</p>
                <p><strong>文件数:</strong> ${analysis.css.totalFiles}</p>
            </div>
        </div>
    </div>
</body>
</html>`;
  
  return html;
}

// 主函数
async function main() {
  try {
    const analysis = analyzeBuild();
    
    // 保存 JSON 报告
    fs.writeFileSync(CONFIG.outputFile, JSON.stringify(analysis, null, 2));
    console.log(`✅ JSON 报告已保存: ${CONFIG.outputFile}`);
    
    // 生成 HTML 报告
    const htmlReport = generateHTMLReport(analysis);
    fs.writeFileSync(CONFIG.reportFile, htmlReport);
    console.log(`✅ HTML 报告已保存: ${CONFIG.reportFile}`);
    
    // 显示摘要
    console.log('\n📊 构建分析摘要:');
    console.log(`📁 总文件数: ${analysis.totalFiles}`);
    console.log(`📦 总大小: ${formatSize(analysis.totalSize)}`);
    console.log(`🟨 JavaScript: ${formatSize(analysis.javascript.totalSize)} (${analysis.javascript.totalFiles} 个文件)`);
    console.log(`🎨 CSS: ${formatSize(analysis.css.totalSize)} (${analysis.css.totalFiles} 个文件)`);
    console.log(`🖼️  图片: ${formatSize(analysis.images.totalSize)} (${analysis.images.totalFiles} 个文件)`);
    
    console.log('\n🔝 最大的文件:');
    analysis.largestFiles.slice(0, 5).forEach((file, index) => {
      console.log(`  ${index + 1}. ${file.name} - ${formatSize(file.size)} (${file.type})`);
    });
    
  } catch (error) {
    console.error('❌ 分析失败:', error.message);
    process.exit(1);
  }
}

// 运行脚本
if (require.main === module) {
  main();
}

module.exports = { analyzeBuild, CONFIG };
