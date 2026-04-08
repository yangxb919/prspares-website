#!/usr/bin/env node

/**
 * 第一步：迁移数据表
 * 迁移所有业务数据表（不包括用户认证和文件）
 */

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// 源数据库配置
const SOURCE_CONFIG = {
  url: 'https://eiikisplpnbeiscunkap.supabase.co',
  serviceRoleKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVpaWtpc3BscG5iZWlzY3Vua2FwIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0NzQwMDQ2OCwiZXhwIjoyMDYyOTc2NDY4fQ.XiAOSd6yPdnnRzyw8V1DS6M27dLRJZuf8vMjhVbZk_I'
};

// 目标数据库配置
const TARGET_CONFIG = {
  url: 'https://prspares.zeabur.app',
  serviceRoleKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyAgCiAgICAicm9sZSI6ICJzZXJ2aWNlX3JvbGUiLAogICAgImlzcyI6ICJzdXBhYmFzZS1kZW1vIiwKICAgICJpYXQiOiAxNjQxNzY5MjAwLAogICAgImV4cCI6IDE3OTk1MzU2MDAKfQ.DaYlNEoUrrEn2Ig7tqibS-PHK5vgusbcbo7X36XVt4Q'
};

// 需要迁移的表（按依赖顺序排列）
const TABLES_TO_MIGRATE = [
  // 基础表（无外键依赖）
  { name: 'categories', description: '分类' },
  { name: 'tags', description: '标签' },
  { name: 'profiles', description: '用户资料' },
  
  // 产品相关
  { name: 'products', description: '产品' },
  { name: 'prices', description: '产品价格' },
  
  // 博客相关
  { name: 'posts', description: '博客文章' },
  
  // 关联表（有外键依赖）
  { name: 'post_tags', description: '文章-标签关联' },
];

const BATCH_SIZE = 100;

async function main() {
  console.log('🚀 开始数据表迁移 - 第一步\n');
  console.log('📋 迁移计划:');
  console.log('   ✅ 第 1 步: 迁移数据表（当前）');
  console.log('   ⏭️  第 2 步: 迁移用户认证（稍后）');
  console.log('   ⏭️  第 3 步: 迁移存储文件（稍后）');
  console.log('');

  // 创建客户端
  const sourceClient = createClient(SOURCE_CONFIG.url, SOURCE_CONFIG.serviceRoleKey);
  const targetClient = createClient(TARGET_CONFIG.url, TARGET_CONFIG.serviceRoleKey);

  // 创建备份目录
  const timestamp = Date.now();
  const backupDir = path.join(__dirname, '..', 'backups', `migration_${timestamp}`);
  if (!fs.existsSync(backupDir)) {
    fs.mkdirSync(backupDir, { recursive: true });
  }
  console.log(`📁 备份目录: ${backupDir}\n`);

  const migrationReport = {
    startTime: new Date().toISOString(),
    sourceDatabase: SOURCE_CONFIG.url,
    targetDatabase: TARGET_CONFIG.url,
    tables: {},
    summary: {
      totalTables: TABLES_TO_MIGRATE.length,
      successTables: 0,
      failedTables: 0,
      totalRecordsExported: 0,
      totalRecordsImported: 0,
      totalErrors: 0
    },
    errors: []
  };

  // 迁移每个表
  for (let i = 0; i < TABLES_TO_MIGRATE.length; i++) {
    const tableInfo = TABLES_TO_MIGRATE[i];
    const tableName = tableInfo.name;
    const description = tableInfo.description;
    
    console.log(`\n${'='.repeat(70)}`);
    console.log(`📊 [${i + 1}/${TABLES_TO_MIGRATE.length}] 迁移表: ${tableName} (${description})`);
    console.log('='.repeat(70));

    try {
      const result = await migrateTable(
        sourceClient, 
        targetClient, 
        tableName, 
        backupDir
      );
      
      migrationReport.tables[tableName] = {
        ...result,
        description
      };
      
      migrationReport.summary.totalRecordsExported += result.exported;
      migrationReport.summary.totalRecordsImported += result.imported;
      migrationReport.summary.totalErrors += result.errors;
      
      if (result.errors === 0) {
        migrationReport.summary.successTables++;
        console.log(`✅ ${tableName} 迁移成功`);
      } else {
        migrationReport.summary.failedTables++;
        console.log(`⚠️  ${tableName} 迁移完成但有错误`);
      }
      
      console.log(`   导出: ${result.exported} 条 | 导入: ${result.imported} 条 | 错误: ${result.errors} 条`);
      
    } catch (error) {
      console.error(`❌ ${tableName} 迁移失败:`, error.message);
      migrationReport.tables[tableName] = {
        exported: 0,
        imported: 0,
        errors: 1,
        errorMessage: error.message,
        description
      };
      migrationReport.summary.failedTables++;
      migrationReport.summary.totalErrors++;
      migrationReport.errors.push({
        table: tableName,
        error: error.message,
        stack: error.stack
      });
    }
  }

  // 保存迁移报告
  migrationReport.endTime = new Date().toISOString();
  const reportPath = path.join(backupDir, 'migration_report.json');
  fs.writeFileSync(reportPath, JSON.stringify(migrationReport, null, 2));

  // 打印总结
  console.log('\n' + '='.repeat(70));
  console.log('📋 迁移总结报告');
  console.log('='.repeat(70));
  
  console.log('\n📊 统计:');
  console.log(`   总表数: ${migrationReport.summary.totalTables}`);
  console.log(`   成功: ${migrationReport.summary.successTables} 个表`);
  console.log(`   失败: ${migrationReport.summary.failedTables} 个表`);
  console.log(`   导出记录: ${migrationReport.summary.totalRecordsExported} 条`);
  console.log(`   导入记录: ${migrationReport.summary.totalRecordsImported} 条`);
  console.log(`   错误: ${migrationReport.summary.totalErrors} 条`);

  console.log('\n📋 详细结果:');
  for (const [table, result] of Object.entries(migrationReport.tables)) {
    const status = result.errors === 0 ? '✅' : '⚠️';
    console.log(`   ${status} ${table.padEnd(20)} ${result.description}`);
    console.log(`      导出: ${result.exported} | 导入: ${result.imported} | 错误: ${result.errors}`);
  }

  console.log(`\n📄 详细报告: ${reportPath}`);
  console.log(`📁 备份文件: ${backupDir}`);
  
  if (migrationReport.summary.totalErrors > 0) {
    console.log('\n⚠️  迁移过程中出现错误，请查看报告了解详情');
    console.log('   原数据库的数据保持不变');
  } else {
    console.log('\n✅ 数据表迁移成功完成！');
  }

  console.log('\n📝 下一步:');
  console.log('   1. 验证新数据库中的数据是否正确');
  console.log('   2. 更新 .env.local 文件切换到新数据库');
  console.log('   3. 测试网站功能是否正常');
  console.log('   4. 稍后迁移用户认证数据（4 个账号）');
  console.log('   5. 稍后迁移存储文件（3 个文件）');
}

/**
 * 迁移单个表
 */
async function migrateTable(sourceClient, targetClient, tableName, backupDir) {
  const result = {
    exported: 0,
    imported: 0,
    errors: 0,
    startTime: new Date().toISOString()
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
      
      const { error } = await targetClient
        .from(tableName)
        .upsert(batch, { 
          onConflict: 'id',
          ignoreDuplicates: false 
        });

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

  result.endTime = new Date().toISOString();
  return result;
}

// 运行主程序
main().catch(error => {
  console.error('\n❌ 迁移失败:', error);
  console.error('错误详情:', error.stack);
  process.exit(1);
});

