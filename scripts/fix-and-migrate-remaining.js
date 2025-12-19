#!/usr/bin/env node

/**
 * 修复并迁移剩余的表
 * 处理 GENERATED ALWAYS AS IDENTITY 的问题
 */

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

const SOURCE_CONFIG = {
  url: 'https://eiikisplpnbeiscunkap.supabase.co',
  serviceRoleKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVpaWtpc3BscG5iZWlzY3Vua2FwIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0NzQwMDQ2OCwiZXhwIjoyMDYyOTc2NDY4fQ.XiAOSd6yPdnnRzyw8V1DS6M27dLRJZuf8vMjhVbZk_I'
};

const TARGET_CONFIG = {
  url: 'https://prspares.zeabur.app',
  serviceRoleKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyAgCiAgICAicm9sZSI6ICJzZXJ2aWNlX3JvbGUiLAogICAgImlzcyI6ICJzdXBhYmFzZS1kZW1vIiwKICAgICJpYXQiOiAxNjQxNzY5MjAwLAogICAgImV4cCI6IDE3OTk1MzU2MDAKfQ.DaYlNEoUrrEn2Ig7tqibS-PHK5vgusbcbo7X36XVt4Q'
};

// 需要修复的表
const TABLES_TO_FIX = [
  { name: 'categories', hasId: true },
  { name: 'tags', hasId: true },
  { name: 'products', hasId: true },
  { name: 'posts', hasId: true },
  { name: 'post_tags', hasId: false } // 这个表没有 id 列
];

const BATCH_SIZE = 100;

async function migrateTableWithIdentity(sourceClient, targetClient, tableName, hasId) {
  console.log(`\n${'='.repeat(70)}`);
  console.log(`📊 迁移表: ${tableName}`);
  console.log('='.repeat(70));

  // 1. 从备份读取数据
  const backupFile = path.join(__dirname, '..', 'backups', 'migration_1763036190291', `${tableName}.json`);
  
  if (!fs.existsSync(backupFile)) {
    console.log(`❌ 备份文件不存在: ${backupFile}`);
    return { exported: 0, imported: 0, errors: 0 };
  }

  const data = JSON.parse(fs.readFileSync(backupFile, 'utf8'));
  console.log(`📂 从备份读取: ${data.length} 条记录`);

  if (data.length === 0) {
    console.log(`⚪ 表为空，跳过`);
    return { exported: data.length, imported: 0, errors: 0 };
  }

  let imported = 0;
  let errors = 0;

  // 2. 如果有 ID 列，需要特殊处理
  if (hasId) {
    console.log(`\n🔧 使用 OVERRIDING SYSTEM VALUE 模式导入...`);
    
    // 使用 REST API 的 RPC 功能执行原始 SQL
    for (let i = 0; i < data.length; i += BATCH_SIZE) {
      const batch = data.slice(i, i + BATCH_SIZE);
      
      try {
        // 构建 INSERT 语句
        const columns = Object.keys(batch[0]);
        const values = batch.map(row => {
          const vals = columns.map(col => {
            const val = row[col];
            if (val === null) return 'NULL';
            if (typeof val === 'number') return val;
            if (typeof val === 'boolean') return val;
            if (typeof val === 'object') return `'${JSON.stringify(val).replace(/'/g, "''")}'::jsonb`;
            return `'${String(val).replace(/'/g, "''")}'`;
          });
          return `(${vals.join(',')})`;
        }).join(',');

        const sql = `
          INSERT INTO public.${tableName} (${columns.join(',')})
          OVERRIDING SYSTEM VALUE
          VALUES ${values}
          ON CONFLICT (id) DO UPDATE SET
            ${columns.filter(c => c !== 'id').map(c => `${c} = EXCLUDED.${c}`).join(',')}
        `;

        // 直接使用 fetch 调用 PostgREST
        const response = await fetch(`${TARGET_CONFIG.url}/rest/v1/rpc/exec_sql`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'apikey': TARGET_CONFIG.serviceRoleKey,
            'Authorization': `Bearer ${TARGET_CONFIG.serviceRoleKey}`
          },
          body: JSON.stringify({ sql })
        });

        if (response.ok) {
          imported += batch.length;
        } else {
          // 如果 RPC 不可用，尝试逐条插入（不带 ID）
          console.log(`\n⚠️  RPC 不可用，尝试逐条插入...`);
          for (const row of batch) {
            const { id, ...rowWithoutId } = row;
            const { error } = await targetClient
              .from(tableName)
              .insert(rowWithoutId);
            
            if (!error) {
              imported++;
            } else {
              errors++;
            }
          }
        }

        process.stdout.write(`\r   已导入: ${imported} / ${data.length} 条记录`);
      } catch (error) {
        console.error(`\n   ⚠️  批次导入失败:`, error.message);
        errors += batch.length;
      }
    }
  } else {
    // 没有 ID 列的表，直接插入
    console.log(`\n📥 直接导入...`);
    
    for (let i = 0; i < data.length; i += BATCH_SIZE) {
      const batch = data.slice(i, i + BATCH_SIZE);
      
      const { error } = await targetClient
        .from(tableName)
        .insert(batch);

      if (error) {
        console.error(`\n   ⚠️  批次 ${Math.floor(i / BATCH_SIZE) + 1} 导入失败:`, error.message);
        errors += batch.length;
      } else {
        imported += batch.length;
      }

      process.stdout.write(`\r   已导入: ${imported} / ${data.length} 条记录`);
    }
  }

  console.log(`\n`);
  
  if (errors === 0) {
    console.log(`✅ ${tableName} 迁移成功`);
  } else {
    console.log(`⚠️  ${tableName} 迁移完成但有 ${errors} 条错误`);
  }

  return { exported: data.length, imported, errors };
}

async function main() {
  console.log('🔧 修复并迁移剩余的表\n');
  
  const sourceClient = createClient(SOURCE_CONFIG.url, SOURCE_CONFIG.serviceRoleKey);
  const targetClient = createClient(TARGET_CONFIG.url, TARGET_CONFIG.serviceRoleKey);

  const results = {};
  let totalImported = 0;
  let totalErrors = 0;

  for (const tableInfo of TABLES_TO_FIX) {
    const result = await migrateTableWithIdentity(
      sourceClient,
      targetClient,
      tableInfo.name,
      tableInfo.hasId
    );
    
    results[tableInfo.name] = result;
    totalImported += result.imported;
    totalErrors += result.errors;
  }

  console.log('\n' + '='.repeat(70));
  console.log('📋 迁移总结');
  console.log('='.repeat(70));
  
  for (const [table, result] of Object.entries(results)) {
    const status = result.errors === 0 ? '✅' : '⚠️';
    console.log(`${status} ${table.padEnd(20)} 导出: ${result.exported} | 导入: ${result.imported} | 错误: ${result.errors}`);
  }

  console.log(`\n📊 总计:`);
  console.log(`   成功导入: ${totalImported} 条记录`);
  console.log(`   错误: ${totalErrors} 条`);

  if (totalErrors === 0) {
    console.log('\n✅ 所有剩余数据迁移成功！');
    console.log('\n📊 完整迁移统计:');
    console.log('   之前成功: 566 条 (profiles + prices)');
    console.log(`   本次成功: ${totalImported} 条`);
    console.log(`   总计: ${566 + totalImported} 条记录`);
  }
}

main().catch(error => {
  console.error('\n❌ 迁移失败:', error);
  process.exit(1);
});

