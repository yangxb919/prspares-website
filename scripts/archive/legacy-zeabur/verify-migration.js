#!/usr/bin/env node

/**
 * 验证数据迁移的完整性
 */

const { createClient } = require('@supabase/supabase-js');

const SOURCE_CONFIG = {
  url: 'https://eiikisplpnbeiscunkap.supabase.co',
  serviceRoleKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVpaWtpc3BscG5iZWlzY3Vua2FwIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0NzQwMDQ2OCwiZXhwIjoyMDYyOTc2NDY4fQ.XiAOSd6yPdnnRzyw8V1DS6M27dLRJZuf8vMjhVbZk_I'
};

const TARGET_CONFIG = {
  url: 'https://prspares.zeabur.app',
  serviceRoleKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyAgCiAgICAicm9sZSI6ICJzZXJ2aWNlX3JvbGUiLAogICAgImlzcyI6ICJzdXBhYmFzZS1kZW1vIiwKICAgICJpYXQiOiAxNjQxNzY5MjAwLAogICAgImV4cCI6IDE3OTk1MzU2MDAKfQ.DaYlNEoUrrEn2Ig7tqibS-PHK5vgusbcbo7X36XVt4Q'
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

async function verifyTable(sourceClient, targetClient, tableName) {
  // 获取源数据库记录数
  const { count: sourceCount, error: sourceError } = await sourceClient
    .from(tableName)
    .select('*', { count: 'exact', head: true });

  // 获取目标数据库记录数
  const { count: targetCount, error: targetError } = await targetClient
    .from(tableName)
    .select('*', { count: 'exact', head: true });

  const match = sourceCount === targetCount;
  const status = match ? '✅' : '❌';

  return {
    table: tableName,
    sourceCount: sourceCount || 0,
    targetCount: targetCount || 0,
    match,
    status
  };
}

async function main() {
  console.log('🔍 验证数据迁移完整性\n');
  console.log('='.repeat(70));
  
  const sourceClient = createClient(SOURCE_CONFIG.url, SOURCE_CONFIG.serviceRoleKey);
  const targetClient = createClient(TARGET_CONFIG.url, TARGET_CONFIG.serviceRoleKey);

  const results = [];
  let totalSource = 0;
  let totalTarget = 0;
  let allMatch = true;

  for (const tableName of TABLES) {
    const result = await verifyTable(sourceClient, targetClient, tableName);
    results.push(result);
    totalSource += result.sourceCount;
    totalTarget += result.targetCount;
    
    if (!result.match) {
      allMatch = false;
    }

    console.log(`${result.status} ${tableName.padEnd(20)} 源: ${result.sourceCount.toString().padStart(3)} | 目标: ${result.targetCount.toString().padStart(3)}`);
  }

  console.log('='.repeat(70));
  console.log(`\n📊 总计:`);
  console.log(`   源数据库: ${totalSource} 条记录`);
  console.log(`   目标数据库: ${totalTarget} 条记录`);
  console.log(`   匹配: ${allMatch ? '✅ 完全一致' : '❌ 有差异'}`);

  if (allMatch) {
    console.log('\n✅ 数据迁移验证通过！');
    console.log('   所有表的记录数完全匹配');
    console.log('\n📝 下一步:');
    console.log('   1. 更新 .env.local 切换到新数据库');
    console.log('   2. 重启开发服务器测试网站功能');
    console.log('   3. 确认无误后更新生产环境配置');
  } else {
    console.log('\n⚠️  发现数据差异，请检查：');
    results.filter(r => !r.match).forEach(r => {
      console.log(`   - ${r.table}: 源 ${r.sourceCount} vs 目标 ${r.targetCount}`);
    });
  }
}

main().catch(error => {
  console.error('\n❌ 验证失败:', error.message);
  process.exit(1);
});

