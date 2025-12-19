#!/usr/bin/env node

/**
 * 列出数据库中的所有表和数据
 */

const { createClient } = require('@supabase/supabase-js');

// 源数据库配置
const SOURCE_CONFIG = {
  url: 'https://eiikisplpnbeiscunkap.supabase.co',
  serviceRoleKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVpaWtpc3BscG5iZWlzY3Vua2FwIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0NzQwMDQ2OCwiZXhwIjoyMDYyOTc2NDY4fQ.XiAOSd6yPdnnRzyw8V1DS6M27dLRJZuf8vMjhVbZk_I'
};

async function listAllTables() {
  console.log('🔍 正在扫描数据库中的所有表...\n');
  console.log(`📍 数据库: ${SOURCE_CONFIG.url}\n`);

  const client = createClient(SOURCE_CONFIG.url, SOURCE_CONFIG.serviceRoleKey);

  try {
    // 使用 PostgreSQL 系统表查询所有用户表
    const { data: tables, error } = await client.rpc('exec_sql', {
      sql: `
        SELECT 
          schemaname,
          tablename,
          pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) as size
        FROM pg_tables 
        WHERE schemaname IN ('public', 'auth', 'storage')
        ORDER BY schemaname, tablename;
      `
    });

    if (error) {
      // 如果 RPC 不可用，尝试直接查询常见的表
      console.log('⚠️  无法使用 RPC 查询，尝试手动检查常见表...\n');
      await checkCommonTables(client);
      return;
    }

    if (tables && tables.length > 0) {
      console.log('📊 找到以下表:\n');
      for (const table of tables) {
        console.log(`  ${table.schemaname}.${table.tablename} (${table.size})`);
      }
    }

  } catch (err) {
    console.log('⚠️  RPC 查询失败，尝试手动检查常见表...\n');
    await checkCommonTables(client);
  }
}

async function checkCommonTables(client) {
  // 常见的表名列表
  const commonTables = [
    // 产品相关
    'products',
    'product_prices',
    'prices',
    
    // 博客相关
    'posts',
    'blog_posts',
    'articles',
    'blogs',
    'content',
    
    // 用户相关
    'users',
    'profiles',
    'user_profiles',
    'accounts',
    
    // 分类和标签
    'categories',
    'tags',
    'post_tags',
    
    // 评论
    'comments',
    
    // 订单相关
    'orders',
    'order_items',
    
    // 其他
    'settings',
    'pages',
    'media',
    'files'
  ];

  console.log('📋 检查常见表:\n');
  console.log('='.repeat(80));

  const foundTables = [];
  let totalRecords = 0;

  for (const tableName of commonTables) {
    try {
      const { data, error, count } = await client
        .from(tableName)
        .select('*', { count: 'exact', head: true });

      if (!error) {
        foundTables.push({ name: tableName, count: count || 0 });
        totalRecords += count || 0;
        
        const status = count > 0 ? '✅' : '⚪';
        console.log(`${status} ${tableName.padEnd(25)} ${count || 0} 条记录`);
        
        // 如果有数据，获取一条示例
        if (count > 0) {
          const { data: sample } = await client
            .from(tableName)
            .select('*')
            .limit(1);
          
          if (sample && sample.length > 0) {
            const columns = Object.keys(sample[0]);
            console.log(`   字段: ${columns.slice(0, 5).join(', ')}${columns.length > 5 ? '...' : ''}`);
          }
        }
      }
    } catch (err) {
      // 表不存在，跳过
    }
  }

  console.log('='.repeat(80));
  console.log(`\n📊 总结:`);
  console.log(`   找到 ${foundTables.length} 个表`);
  console.log(`   总记录数: ${totalRecords} 条\n`);

  if (foundTables.length > 0) {
    console.log('📋 需要迁移的表:\n');
    foundTables.forEach(table => {
      if (table.count > 0) {
        console.log(`   ✅ ${table.name} (${table.count} 条记录)`);
      }
    });
  }

  // 检查 auth schema 中的用户
  console.log('\n🔐 检查认证用户数据...');
  try {
    // 尝试通过 auth.users 查询（需要 service_role）
    const { data: authData, error: authError } = await client.auth.admin.listUsers();
    
    if (!authError && authData) {
      console.log(`   ✅ 找到 ${authData.users?.length || 0} 个用户账号`);
      if (authData.users && authData.users.length > 0) {
        console.log(`   示例用户: ${authData.users[0].email || authData.users[0].id}`);
      }
    } else {
      console.log(`   ⚠️  无法访问用户数据: ${authError?.message || '权限不足'}`);
    }
  } catch (err) {
    console.log(`   ⚠️  无法访问用户数据: ${err.message}`);
  }

  // 检查 storage buckets
  console.log('\n📦 检查存储桶 (Storage Buckets)...');
  try {
    const { data: buckets, error: bucketsError } = await client.storage.listBuckets();
    
    if (!bucketsError && buckets) {
      console.log(`   ✅ 找到 ${buckets.length} 个存储桶`);
      for (const bucket of buckets) {
        console.log(`      - ${bucket.name} (${bucket.public ? '公开' : '私有'})`);
        
        // 列出存储桶中的文件
        const { data: files } = await client.storage.from(bucket.name).list();
        if (files && files.length > 0) {
          console.log(`        包含 ${files.length} 个文件`);
        }
      }
    } else {
      console.log(`   ⚪ 没有找到存储桶`);
    }
  } catch (err) {
    console.log(`   ⚠️  无法访问存储桶: ${err.message}`);
  }

  console.log('\n💡 提示:');
  console.log('   1. auth.users 表中的用户数据需要特殊处理');
  console.log('   2. storage 中的文件需要单独迁移');
  console.log('   3. 如果有其他自定义表，请手动添加到迁移列表');
}

listAllTables().catch(error => {
  console.error('\n❌ 扫描失败:', error.message);
  process.exit(1);
});

