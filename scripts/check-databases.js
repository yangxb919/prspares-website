#!/usr/bin/env node

/**
 * 检查源数据库和目标数据库的状态
 */

const { createClient } = require('@supabase/supabase-js');

// 源数据库配置（要迁移的数据）
const SOURCE_CONFIG = {
  url: 'https://eiikisplpnbeiscunkap.supabase.co',
  anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVpaWtpc3BscG5iZWlzY3Vua2FwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc0MDA0NjgsImV4cCI6MjA2Mjk3NjQ2OH0.JT5QFU6scD0822bFeFpw4z2BjgTv6Kk9xwDgtdjaFf0',
  serviceRoleKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVpaWtpc3BscG5iZWlzY3Vua2FwIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0NzQwMDQ2OCwiZXhwIjoyMDYyOTc2NDY4fQ.XiAOSd6yPdnnRzyw8V1DS6M27dLRJZuf8vMjhVbZk_I'
};

// 目标数据库配置（新的自部署数据库）
const TARGET_CONFIG = {
  url: 'https://prspares.zeabur.app',
  anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyAgCiAgICAicm9sZSI6ICJhbm9uIiwKICAgICJpc3MiOiAic3VwYWJhc2UtZGVtbyIsCiAgICAiaWF0IjogMTY0MTc2OTIwMCwKICAgICJleHAiOiAxNzk5NTM1NjAwCn0.dc_X5iR_VP_qT0zsiyj_I_OZ2T9FtRU2BBNWN8Bu4GE',
  serviceRoleKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyAgCiAgICAicm9sZSI6ICJzZXJ2aWNlX3JvbGUiLAogICAgImlzcyI6ICJzdXBhYmFzZS1kZW1vIiwKICAgICJpYXQiOiAxNjQxNzY5MjAwLAogICAgImV4cCI6IDE3OTk1MzU2MDAKfQ.DaYlNEoUrrEn2Ig7tqibS-PHK5vgusbcbo7X36XVt4Q'
};

// 要检查的表
const TABLES = ['product_prices', 'products'];

async function checkDatabase(config, name) {
  console.log(`\n${'='.repeat(60)}`);
  console.log(`📊 检查${name}`);
  console.log(`🔗 URL: ${config.url}`);
  console.log('='.repeat(60));

  const client = createClient(config.url, config.serviceRoleKey);
  const results = {};

  for (const table of TABLES) {
    try {
      // 检查表是否存在并获取记录数
      const { data, error, count } = await client
        .from(table)
        .select('*', { count: 'exact', head: true });

      if (error) {
        if (error.message.includes('does not exist') || error.code === '42P01') {
          results[table] = { exists: false, count: 0, error: '表不存在' };
          console.log(`  ❌ ${table}: 表不存在`);
        } else {
          results[table] = { exists: false, count: 0, error: error.message };
          console.log(`  ⚠️  ${table}: 错误 - ${error.message}`);
        }
      } else {
        results[table] = { exists: true, count: count || 0 };
        console.log(`  ✅ ${table}: ${count || 0} 条记录`);
        
        // 如果有数据，显示一条示例
        if (count > 0) {
          const { data: sample } = await client
            .from(table)
            .select('*')
            .limit(1);
          
          if (sample && sample.length > 0) {
            console.log(`     示例数据:`, JSON.stringify(sample[0]).substring(0, 100) + '...');
          }
        }
      }
    } catch (err) {
      results[table] = { exists: false, count: 0, error: err.message };
      console.log(`  ❌ ${table}: 异常 - ${err.message}`);
    }
  }

  return results;
}

async function main() {
  console.log('🔍 开始检查数据库状态...\n');
  console.log('⚠️  重要说明：');
  console.log('   数据迁移是【复制】操作，不是【移动】操作');
  console.log('   源数据库的数据会保持不变，不会被删除或修改');
  console.log('   我们只是把数据复制到新数据库\n');

  try {
    // 检查源数据库
    const sourceResults = await checkDatabase(SOURCE_CONFIG, '源数据库 (eiikisplpnbeiscunkap.supabase.co)');
    
    // 检查目标数据库
    const targetResults = await checkDatabase(TARGET_CONFIG, '目标数据库 (prspares.zeabur.app)');

    // 生成总结报告
    console.log('\n' + '='.repeat(60));
    console.log('📋 检查总结');
    console.log('='.repeat(60));

    let totalSourceRecords = 0;
    let totalTargetRecords = 0;

    console.log('\n源数据库 → 目标数据库:');
    for (const table of TABLES) {
      const source = sourceResults[table];
      const target = targetResults[table];
      
      totalSourceRecords += source.count || 0;
      totalTargetRecords += target.count || 0;

      console.log(`\n${table}:`);
      console.log(`  源: ${source.exists ? `✅ ${source.count} 条记录` : `❌ ${source.error}`}`);
      console.log(`  目标: ${target.exists ? `✅ ${target.count} 条记录` : `❌ ${target.error}`}`);
      
      if (source.exists && target.exists) {
        if (source.count === 0) {
          console.log(`  状态: ⚪ 源表为空，无需迁移`);
        } else if (target.count === 0) {
          console.log(`  状态: 🟢 可以安全迁移 (目标表为空)`);
        } else if (source.count === target.count) {
          console.log(`  状态: 🟡 记录数相同，可能已迁移`);
        } else {
          console.log(`  状态: 🟠 记录数不同，需要确认是否覆盖`);
        }
      } else if (source.exists && !target.exists) {
        console.log(`  状态: 🔴 目标表不存在，需要先创建表结构`);
      } else if (!source.exists) {
        console.log(`  状态: ⚪ 源表不存在，跳过`);
      }
    }

    console.log('\n总计:');
    console.log(`  源数据库: ${totalSourceRecords} 条记录`);
    console.log(`  目标数据库: ${totalTargetRecords} 条记录`);

    // 给出建议
    console.log('\n💡 建议:');
    if (totalSourceRecords === 0) {
      console.log('  ⚪ 源数据库为空，无需迁移');
    } else if (totalTargetRecords === 0) {
      console.log('  🟢 目标数据库为空，可以安全迁移');
      console.log('  ✅ 建议：直接执行迁移脚本');
    } else if (totalSourceRecords === totalTargetRecords) {
      console.log('  🟡 两个数据库记录数相同');
      console.log('  ⚠️  建议：检查数据是否已经迁移过');
    } else {
      console.log('  🟠 两个数据库记录数不同');
      console.log('  ⚠️  建议：确认是否要覆盖目标数据库的现有数据');
    }

    console.log('\n📝 注意事项:');
    console.log('  1. 迁移操作不会删除或修改源数据库的数据');
    console.log('  2. 迁移会使用 upsert 操作（根据 ID 更新或插入）');
    console.log('  3. 建议在迁移前备份目标数据库（如果有重要数据）');
    console.log('  4. 迁移过程会自动创建本地备份文件');

  } catch (error) {
    console.error('\n❌ 检查失败:', error.message);
    process.exit(1);
  }
}

main();

