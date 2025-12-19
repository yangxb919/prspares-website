#!/usr/bin/env node

/**
 * 测试网站与新数据库的连接
 */

const { createClient } = require('@supabase/supabase-js');

// 新数据库配置
const SUPABASE_URL = 'https://prspares.zeabur.app';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyAgCiAgICAicm9sZSI6ICJhbm9uIiwKICAgICJpc3MiOiAic3VwYWJhc2UtZGVtbyIsCiAgICAiaWF0IjogMTY0MTc2OTIwMCwKICAgICJleHAiOiAxNzk5NTM1NjAwCn0.dc_X5iR_VP_qT0zsiyj_I_OZ2T9FtRU2BBNWN8Bu4GE';

console.log('🧪 测试网站数据库连接\n');
console.log('='.repeat(70));
console.log(`📍 数据库 URL: ${SUPABASE_URL}`);
console.log('='.repeat(70));

async function testConnection() {
  const client = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

  const tests = [
    {
      name: '博客文章 (posts)',
      test: async () => {
        const { data, error, count } = await client
          .from('posts')
          .select('id, title, slug', { count: 'exact' })
          .limit(3);
        
        if (error) throw error;
        return { count, sample: data };
      }
    },
    {
      name: '产品价格 (prices)',
      test: async () => {
        const { data, error, count } = await client
          .from('prices')
          .select('id, product_title, price', { count: 'exact' })
          .limit(3);
        
        if (error) throw error;
        return { count, sample: data };
      }
    },
    {
      name: '产品 (products)',
      test: async () => {
        const { data, error, count } = await client
          .from('products')
          .select('id, name, slug', { count: 'exact' })
          .limit(3);
        
        if (error) throw error;
        return { count, sample: data };
      }
    },
    {
      name: '分类 (categories)',
      test: async () => {
        const { data, error, count } = await client
          .from('categories')
          .select('id, name, slug', { count: 'exact' });
        
        if (error) throw error;
        return { count, sample: data };
      }
    },
    {
      name: '标签 (tags)',
      test: async () => {
        const { data, error, count } = await client
          .from('tags')
          .select('id, name, slug', { count: 'exact' });
        
        if (error) throw error;
        return { count, sample: data };
      }
    },
    {
      name: '用户资料 (profiles)',
      test: async () => {
        const { data, error, count } = await client
          .from('profiles')
          .select('id, display_name', { count: 'exact' });
        
        if (error) throw error;
        return { count, sample: data };
      }
    }
  ];

  console.log('\n📊 测试结果:\n');

  let allPassed = true;
  const results = [];

  for (const testCase of tests) {
    try {
      const result = await testCase.test();
      console.log(`✅ ${testCase.name.padEnd(30)} ${result.count} 条记录`);
      
      if (result.sample && result.sample.length > 0) {
        const sample = result.sample[0];
        const preview = Object.entries(sample)
          .slice(0, 2)
          .map(([k, v]) => `${k}: ${v}`)
          .join(', ');
        console.log(`   示例: ${preview}`);
      }
      
      results.push({ name: testCase.name, status: 'success', count: result.count });
    } catch (error) {
      console.log(`❌ ${testCase.name.padEnd(30)} 失败`);
      console.log(`   错误: ${error.message}`);
      allPassed = false;
      results.push({ name: testCase.name, status: 'failed', error: error.message });
    }
  }

  console.log('\n' + '='.repeat(70));
  
  if (allPassed) {
    console.log('✅ 所有测试通过！数据库连接正常\n');
    console.log('📝 下一步:');
    console.log('   1. 启动开发服务器: npm run dev');
    console.log('   2. 访问网站测试各项功能');
    console.log('   3. 测试博客文章显示');
    console.log('   4. 测试产品价格查询');
    console.log('   5. 测试用户登录（需要重置密码）');
  } else {
    console.log('❌ 部分测试失败，请检查配置\n');
  }

  return allPassed;
}

testConnection().catch(error => {
  console.error('\n❌ 测试失败:', error.message);
  process.exit(1);
});

