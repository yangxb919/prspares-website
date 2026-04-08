#!/usr/bin/env node

/**
 * 从源数据库获取表结构定义
 * 通过查询示例数据来推断表结构
 */

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

const SOURCE_CONFIG = {
  url: 'https://eiikisplpnbeiscunkap.supabase.co',
  serviceRoleKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVpaWtpc3BscG5iZWlzY3Vua2FwIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0NzQwMDQ2OCwiZXhwIjoyMDYyOTc2NDY4fQ.XiAOSd6yPdnnRzyw8V1DS6M27dLRJZuf8vMjhVbZk_I'
};

const TABLES = [
  'categories',
  'tags', 
  'profiles',
  'products',
  'prices',
  'posts',
  'post_tags'
];

async function getTableStructure(client, tableName) {
  console.log(`\n📊 分析表: ${tableName}`);
  
  // 获取一条示例数据
  const { data, error } = await client
    .from(tableName)
    .select('*')
    .limit(1);

  if (error) {
    console.error(`   ❌ 错误: ${error.message}`);
    return null;
  }

  if (!data || data.length === 0) {
    console.log(`   ⚪ 表为空，无法推断结构`);
    return null;
  }

  const sample = data[0];
  const columns = {};
  
  for (const [key, value] of Object.entries(sample)) {
    let type = 'text';
    
    if (value === null) {
      type = 'text';
    } else if (typeof value === 'number') {
      type = Number.isInteger(value) ? 'integer' : 'numeric';
    } else if (typeof value === 'boolean') {
      type = 'boolean';
    } else if (typeof value === 'object') {
      type = 'jsonb';
    } else if (typeof value === 'string') {
      // 检查是否是 UUID
      if (/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(value)) {
        type = 'uuid';
      }
      // 检查是否是时间戳
      else if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/.test(value)) {
        type = 'timestamptz';
      }
      else {
        type = 'text';
      }
    }
    
    columns[key] = { type, sample: value };
  }

  console.log(`   ✅ 找到 ${Object.keys(columns).length} 个字段`);
  return { tableName, columns, sample };
}

async function generateCreateTableSQL(tableInfo) {
  if (!tableInfo) return null;
  
  const { tableName, columns } = tableInfo;
  
  let sql = `-- 创建表: ${tableName}\n`;
  sql += `CREATE TABLE IF NOT EXISTS public.${tableName} (\n`;
  
  const columnDefs = [];
  for (const [colName, colInfo] of Object.entries(columns)) {
    let def = `  ${colName} ${colInfo.type}`;
    
    // 主键通常是 id
    if (colName === 'id') {
      if (colInfo.type === 'uuid') {
        def += ' PRIMARY KEY DEFAULT gen_random_uuid()';
      } else if (colInfo.type === 'integer') {
        def += ' PRIMARY KEY GENERATED ALWAYS AS IDENTITY';
      }
    }
    
    // created_at 和 updated_at 通常有默认值
    if (colName === 'created_at' || colName === 'updated_at') {
      def += ' DEFAULT now()';
    }
    
    columnDefs.push(def);
  }
  
  sql += columnDefs.join(',\n');
  sql += '\n);\n\n';
  
  // 添加索引建议
  sql += `-- 建议的索引\n`;
  for (const colName of Object.keys(columns)) {
    if (colName.endsWith('_id') || colName === 'slug') {
      sql += `CREATE INDEX IF NOT EXISTS ${tableName}_${colName}_idx ON public.${tableName}(${colName});\n`;
    }
  }
  
  sql += '\n';
  return sql;
}

async function main() {
  console.log('🔍 开始分析源数据库表结构...\n');
  
  const client = createClient(SOURCE_CONFIG.url, SOURCE_CONFIG.serviceRoleKey);
  const tableStructures = [];
  
  for (const tableName of TABLES) {
    const structure = await getTableStructure(client, tableName);
    if (structure) {
      tableStructures.push(structure);
    }
  }
  
  console.log('\n' + '='.repeat(70));
  console.log('📝 生成 SQL 创建语句...\n');
  
  let fullSQL = `-- 数据库表结构
-- 从源数据库分析生成
-- 生成时间: ${new Date().toISOString()}
-- 
-- 使用方法:
-- 1. 登录目标数据库的 SQL Editor
-- 2. 复制并运行此 SQL 文件
-- 3. 然后重新运行数据迁移脚本

`;
  
  for (const tableInfo of tableStructures) {
    const sql = await generateCreateTableSQL(tableInfo);
    if (sql) {
      fullSQL += sql;
      console.log(`✅ ${tableInfo.tableName}`);
    }
  }
  
  // 保存到文件
  const outputDir = path.join(__dirname, '..', 'supabase', 'exported_schema');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  
  const outputFile = path.join(outputDir, `create_tables_${Date.now()}.sql`);
  fs.writeFileSync(outputFile, fullSQL);
  
  console.log('\n' + '='.repeat(70));
  console.log('✅ SQL 文件已生成！');
  console.log(`📄 文件位置: ${outputFile}`);
  console.log(`📊 文件大小: ${(fullSQL.length / 1024).toFixed(2)} KB`);
  
  console.log('\n📝 下一步:');
  console.log('   1. 打开目标数据库的 SQL Editor');
  console.log(`      URL: https://prspares.zeabur.app`);
  console.log('   2. 复制并运行生成的 SQL 文件');
  console.log('   3. 确认所有表创建成功');
  console.log('   4. 重新运行数据迁移脚本');
  
  // 同时保存表结构信息为 JSON
  const jsonFile = path.join(outputDir, `table_structures_${Date.now()}.json`);
  fs.writeFileSync(jsonFile, JSON.stringify(tableStructures, null, 2));
  console.log(`\n📋 表结构详情: ${jsonFile}`);
}

main().catch(error => {
  console.error('\n❌ 失败:', error.message);
  process.exit(1);
});

