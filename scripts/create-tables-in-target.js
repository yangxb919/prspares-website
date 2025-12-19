#!/usr/bin/env node

/**
 * 在目标数据库中创建表结构
 */

const fs = require('fs');
const path = require('path');

const TARGET_DB_URL = 'https://prspares.zeabur.app';
const TARGET_SERVICE_ROLE = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyAgCiAgICAicm9sZSI6ICJzZXJ2aWNlX3JvbGUiLAogICAgImlzcyI6ICJzdXBhYmFzZS1kZW1vIiwKICAgICJpYXQiOiAxNjQxNzY5MjAwLAogICAgImV4cCI6IDE3OTk1MzU2MDAKfQ.DaYlNEoUrrEn2Ig7tqibS-PHK5vgusbcbo7X36XVt4Q';

// 读取生成的 SQL 文件
const sqlFile = path.join(__dirname, '..', 'supabase', 'exported_schema', 'create_tables_1763032058894.sql');
const sql = fs.readFileSync(sqlFile, 'utf8');

console.log('🔧 在目标数据库中创建表结构...\n');
console.log(`📍 目标数据库: ${TARGET_DB_URL}`);
console.log(`📄 SQL 文件: ${sqlFile}\n`);

// 分割 SQL 语句
const statements = sql
  .split(';')
  .map(s => s.trim())
  .filter(s => s && !s.startsWith('--'));

console.log(`📊 找到 ${statements.length} 条 SQL 语句\n`);

async function executeSQL(statement, index) {
  try {
    const response = await fetch(`${TARGET_DB_URL}/rest/v1/rpc/exec_sql`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': TARGET_SERVICE_ROLE,
        'Authorization': `Bearer ${TARGET_SERVICE_ROLE}`
      },
      body: JSON.stringify({ sql: statement })
    });

    if (response.ok) {
      return { success: true, statement };
    } else {
      const error = await response.text();
      return { success: false, statement, error };
    }
  } catch (error) {
    return { success: false, statement, error: error.message };
  }
}

async function main() {
  console.log('开始执行 SQL 语句...\n');
  console.log('='.repeat(70));
  
  let successCount = 0;
  let failCount = 0;
  const errors = [];

  for (let i = 0; i < statements.length; i++) {
    const statement = statements[i];
    const preview = statement.substring(0, 60).replace(/\n/g, ' ');
    
    process.stdout.write(`[${i + 1}/${statements.length}] ${preview}...`);
    
    const result = await executeSQL(statement, i);
    
    if (result.success) {
      console.log(' ✅');
      successCount++;
    } else {
      console.log(' ❌');
      console.log(`    错误: ${result.error}`);
      failCount++;
      errors.push({ statement: preview, error: result.error });
    }
  }

  console.log('='.repeat(70));
  console.log('\n📊 执行结果:');
  console.log(`   成功: ${successCount} 条`);
  console.log(`   失败: ${failCount} 条`);

  if (errors.length > 0) {
    console.log('\n❌ 失败的语句:');
    errors.forEach((err, i) => {
      console.log(`   ${i + 1}. ${err.statement}`);
      console.log(`      ${err.error}`);
    });
    
    console.log('\n⚠️  部分 SQL 执行失败');
    console.log('💡 建议: 手动在 SQL Editor 中运行 SQL 文件');
    console.log(`   1. 访问: ${TARGET_DB_URL}`);
    console.log(`   2. 打开 SQL Editor`);
    console.log(`   3. 复制并运行: ${sqlFile}`);
  } else {
    console.log('\n✅ 所有表结构创建成功！');
    console.log('\n📝 下一步:');
    console.log('   运行数据迁移脚本:');
    console.log('   node scripts/migrate-data-tables.js');
  }
}

main().catch(error => {
  console.error('\n❌ 执行失败:', error.message);
  process.exit(1);
});

