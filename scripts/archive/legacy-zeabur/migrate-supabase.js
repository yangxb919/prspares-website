#!/usr/bin/env node

/**
 * Supabase 数据迁移脚本
 * 用于将数据从一个 Supabase 实例迁移到另一个
 * 
 * 使用方法:
 * node scripts/migrate-supabase.js
 */

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// ==================== 配置区域 ====================
// 源数据库配置（当前数据库）
const SOURCE_CONFIG = {
  url: 'https://prspares.zeabur.app',
  anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyAgCiAgICAicm9sZSI6ICJhbm9uIiwKICAgICJpc3MiOiAic3VwYWJhc2UtZGVtbyIsCiAgICAiaWF0IjogMTY0MTc2OTIwMCwKICAgICJleHAiOiAxNzk5NTM1NjAwCn0.dc_X5iR_VP_qT0zsiyj_I_OZ2T9FtRU2BBNWN8Bu4GE',
  serviceRoleKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyAgCiAgICAicm9sZSI6ICJzZXJ2aWNlX3JvbGUiLAogICAgImlzcyI6ICJzdXBhYmFzZS1kZW1vIiwKICAgICJpYXQiOiAxNjQxNzY5MjAwLAogICAgImV4cCI6IDE3OTk1MzU2MDAKfQ.DaYlNEoUrrEn2Ig7tqibS-PHK5vgusbcbo7X36XVt4Q'
};

// 目标数据库配置（新数据库）
// ⚠️ 请在运行前填写新数据库的配置
const TARGET_CONFIG = {
  url: process.env.NEW_SUPABASE_URL || 'YOUR_NEW_SUPABASE_URL',
  anonKey: process.env.NEW_SUPABASE_ANON_KEY || 'YOUR_NEW_ANON_KEY',
  serviceRoleKey: process.env.NEW_SUPABASE_SERVICE_ROLE || 'YOUR_NEW_SERVICE_ROLE_KEY'
};

// 需要迁移的表列表
const TABLES_TO_MIGRATE = [
  'product_prices',
  'products',
  // 如果有其他表，请添加到这里
];

// 每批次处理的记录数
const BATCH_SIZE = 100;

// ==================== 主程序 ====================

async function main() {
  console.log('🚀 开始 Supabase 数据迁移...\n');

  // 验证配置
  if (TARGET_CONFIG.url === 'YOUR_NEW_SUPABASE_URL') {
    console.error('❌ 错误: 请先配置目标数据库信息！');
    console.log('\n请设置以下环境变量或修改脚本中的 TARGET_CONFIG:');
    console.log('  - NEW_SUPABASE_URL');
    console.log('  - NEW_SUPABASE_ANON_KEY');
    console.log('  - NEW_SUPABASE_SERVICE_ROLE\n');
    process.exit(1);
  }

  // 创建客户端
  const sourceClient = createClient(SOURCE_CONFIG.url, SOURCE_CONFIG.serviceRoleKey);
  const targetClient = createClient(TARGET_CONFIG.url, TARGET_CONFIG.serviceRoleKey);

  // 创建备份目录
  const backupDir = path.join(__dirname, '..', 'backups', `backup_${Date.now()}`);
  if (!fs.existsSync(backupDir)) {
    fs.mkdirSync(backupDir, { recursive: true });
  }
  console.log(`📁 备份目录: ${backupDir}\n`);

  const migrationReport = {
    startTime: new Date().toISOString(),
    tables: {},
    errors: []
  };

  // 迁移每个表
  for (const tableName of TABLES_TO_MIGRATE) {
    console.log(`\n${'='.repeat(60)}`);
    console.log(`📊 处理表: ${tableName}`);
    console.log('='.repeat(60));

    try {
      const result = await migrateTable(sourceClient, targetClient, tableName, backupDir);
      migrationReport.tables[tableName] = result;
      
      console.log(`✅ ${tableName} 迁移完成`);
      console.log(`   - 导出: ${result.exported} 条记录`);
      console.log(`   - 导入: ${result.imported} 条记录`);
      if (result.errors > 0) {
        console.log(`   ⚠️  错误: ${result.errors} 条记录`);
      }
    } catch (error) {
      console.error(`❌ ${tableName} 迁移失败:`, error.message);
      migrationReport.errors.push({
        table: tableName,
        error: error.message
      });
    }
  }

  // 保存迁移报告
  migrationReport.endTime = new Date().toISOString();
  const reportPath = path.join(backupDir, 'migration_report.json');
  fs.writeFileSync(reportPath, JSON.stringify(migrationReport, null, 2));

  // 打印总结
  console.log('\n' + '='.repeat(60));
  console.log('📋 迁移总结');
  console.log('='.repeat(60));
  
  let totalExported = 0;
  let totalImported = 0;
  let totalErrors = 0;

  for (const [table, result] of Object.entries(migrationReport.tables)) {
    totalExported += result.exported;
    totalImported += result.imported;
    totalErrors += result.errors;
    console.log(`${table}:`);
    console.log(`  导出: ${result.exported} | 导入: ${result.imported} | 错误: ${result.errors}`);
  }

  console.log('\n总计:');
  console.log(`  导出: ${totalExported} 条记录`);
  console.log(`  导入: ${totalImported} 条记录`);
  console.log(`  错误: ${totalErrors} 条记录`);
  console.log(`\n📄 详细报告: ${reportPath}`);
  
  if (totalErrors > 0) {
    console.log('\n⚠️  迁移过程中出现错误，请查看报告了解详情');
  } else {
    console.log('\n✅ 迁移成功完成！');
  }
}

/**
 * 迁移单个表
 */
async function migrateTable(sourceClient, targetClient, tableName, backupDir) {
  const result = {
    exported: 0,
    imported: 0,
    errors: 0
  };

  // 1. 从源数据库导出数据
  console.log(`\n1️⃣  从源数据库导出 ${tableName}...`);
  const allData = [];
  let offset = 0;
  let hasMore = true;

  while (hasMore) {
    const { data, error } = await sourceClient
      .from(tableName)
      .select('*')
      .range(offset, offset + BATCH_SIZE - 1);

    if (error) {
      throw new Error(`导出失败: ${error.message}`);
    }

    if (data && data.length > 0) {
      allData.push(...data);
      offset += BATCH_SIZE;
      process.stdout.write(`\r   已导出: ${allData.length} 条记录`);
    } else {
      hasMore = false;
    }
  }

  result.exported = allData.length;
  console.log(`\n   ✓ 导出完成: ${result.exported} 条记录`);

  // 2. 保存备份到本地
  const backupFile = path.join(backupDir, `${tableName}.json`);
  fs.writeFileSync(backupFile, JSON.stringify(allData, null, 2));
  console.log(`   ✓ 备份已保存: ${backupFile}`);

  // 3. 导入到目标数据库
  if (allData.length > 0) {
    console.log(`\n2️⃣  导入到目标数据库...`);
    
    // 分批导入
    for (let i = 0; i < allData.length; i += BATCH_SIZE) {
      const batch = allData.slice(i, i + BATCH_SIZE);
      
      const { data, error } = await targetClient
        .from(tableName)
        .upsert(batch, { onConflict: 'id' });

      if (error) {
        console.error(`\n   ⚠️  批次 ${Math.floor(i / BATCH_SIZE) + 1} 导入失败:`, error.message);
        result.errors += batch.length;
      } else {
        result.imported += batch.length;
      }

      process.stdout.write(`\r   已导入: ${result.imported} / ${allData.length} 条记录`);
    }

    console.log(`\n   ✓ 导入完成`);
  } else {
    console.log(`\n2️⃣  表为空，跳过导入`);
  }

  return result;
}

// 运行主程序
main().catch(error => {
  console.error('\n❌ 迁移失败:', error);
  process.exit(1);
});

