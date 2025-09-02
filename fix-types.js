#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// 需要修复的文件列表
const filesToFix = [
  'src/pages/admin/products/index.tsx',
  'src/pages/admin/products/[id].tsx',
  'src/pages/admin/articles/index.tsx',
  'src/pages/admin/articles/[id].tsx',
  'src/pages/admin/contacts/index.tsx',
  'src/pages/admin/newsletter/index.tsx',
  'src/pages/admin/seo/index.tsx',
  'src/components/features/LatestBlogPosts.tsx'
];

// 修复函数
function fixFile(filePath) {
  if (!fs.existsSync(filePath)) {
    console.log(`文件不存在: ${filePath}`);
    return;
  }

  let content = fs.readFileSync(filePath, 'utf8');
  let modified = false;

  // 添加导入语句
  if (!content.includes('from \'@/utils/type-converters\'')) {
    const importMatch = content.match(/^(import.*?;?\n)+/m);
    if (importMatch) {
      const lastImport = importMatch[0];
      const newImport = lastImport + 'import { convertToProduct, convertToProducts, convertToPost, convertToPosts, convertToContactSubmissions, convertToNewsletterSubscriptions, convertToPostSEOInfos, safeString, safeNumber } from \'@/utils/type-converters\';\n';
      content = content.replace(lastImport, newImport);
      modified = true;
    }
  }

  // 修复常见的类型转换问题
  const fixes = [
    // 产品相关
    {
      pattern: /setProducts\(data \|\| \[\]\)/g,
      replacement: 'setProducts(convertToProducts(data || []))'
    },
    {
      pattern: /setProduct\(productData\)/g,
      replacement: 'setProduct(convertToProduct(productData))'
    },
    // 文章相关
    {
      pattern: /setPosts\(data \|\| \[\]\)/g,
      replacement: 'setPosts(convertToPosts(data || []))'
    },
    {
      pattern: /const typedPosts = postsData as BlogPost\[\] \| null;/g,
      replacement: 'const typedPosts = convertToPosts(postsData || []);'
    },
    // 联系表单
    {
      pattern: /setContacts\(data \|\| \[\]\)/g,
      replacement: 'setContacts(convertToContactSubmissions(data || []))'
    },
    {
      pattern: /setFilteredContacts\(data \|\| \[\]\)/g,
      replacement: 'setFilteredContacts(convertToContactSubmissions(data || []))'
    },
    // 新闻订阅
    {
      pattern: /setSubscriptions\(data \|\| \[\]\)/g,
      replacement: 'setSubscriptions(convertToNewsletterSubscriptions(data || []))'
    },
    // SEO信息
    {
      pattern: /setPosts\(data \|\| \[\]\);/g,
      replacement: 'setPosts(convertToPostSEOInfos(data || []));'
    },
    // 安全的字符串和数字访问
    {
      pattern: /productData\.(\w+) \|\| ''/g,
      replacement: 'safeString(productData.$1)'
    },
    {
      pattern: /productData\.(\w+) \|\| 0/g,
      replacement: 'safeNumber(productData.$1)'
    },
    {
      pattern: /article\.(\w+) \|\| ''/g,
      replacement: 'safeString(article.$1)'
    },
    // 修复 .eq() 参数类型问题
    {
      pattern: /\.eq\('id', id\)/g,
      replacement: '.eq(\'id\', String(id))'
    },
    {
      pattern: /\.eq\('author_id', userId\)/g,
      replacement: '.eq(\'author_id\', String(userId))'
    }
  ];

  fixes.forEach(fix => {
    if (content.match(fix.pattern)) {
      content = content.replace(fix.pattern, fix.replacement);
      modified = true;
    }
  });

  // 特殊修复：产品表单数据
  if (filePath.includes('products/[id].tsx')) {
    const formDataFix = `
        setFormData({
          name: safeString(productData.name),
          slug: safeString(productData.slug),
          sku: safeString(productData.sku),
          type: (productData.type as 'simple' | 'variable' | 'virtual') || 'simple',
          short_desc: safeString(productData.short_desc),
          description: safeString(productData.description),
          regular_price: safeNumber(productData.regular_price).toString(),
          sale_price: safeNumber(productData.sale_price).toString(),
          sale_start: safeString(productData.sale_start),
          sale_end: safeString(productData.sale_end),
          tax_status: safeString(productData.tax_status, 'taxable'),
          stock_status: (productData.stock_status as 'instock' | 'outofstock') || 'instock',
          stock_quantity: safeNumber(productData.stock_quantity).toString(),
          weight: safeNumber(productData.weight).toString(),
          dim_length: safeNumber(productData.dim_length).toString(),
          dim_width: safeNumber(productData.dim_width).toString(),
          dim_height: safeNumber(productData.dim_height).toString(),
          images: Array.isArray(productData.images) ? productData.images.map((image: any) => image.url || image) : [],
          status: (productData.status as 'draft' | 'publish') || 'draft'
        })`;

    if (content.includes('setFormData({')) {
      content = content.replace(/setFormData\(\{[\s\S]*?\}\)/, formDataFix);
      modified = true;
    }
  }

  if (modified) {
    fs.writeFileSync(filePath, content);
    console.log(`✅ 修复完成: ${filePath}`);
  } else {
    console.log(`⏭️  无需修复: ${filePath}`);
  }
}

// 执行修复
console.log('🔧 开始修复TypeScript类型错误...\n');

filesToFix.forEach(fixFile);

console.log('\n✅ 所有文件修复完成！');
console.log('请运行 npm run type-check 验证修复结果');
