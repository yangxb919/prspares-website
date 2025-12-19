#!/usr/bin/env node

/**
 * 检查博客文章的详细信息
 */

const { createClient } = require('@supabase/supabase-js');

const TARGET_CONFIG = {
  url: 'https://prspares.zeabur.app',
  serviceRoleKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyAgCiAgICAicm9sZSI6ICJzZXJ2aWNlX3JvbGUiLAogICAgImlzcyI6ICJzdXBhYmFzZS1kZW1vIiwKICAgICJpYXQiOiAxNjQxNzY5MjAwLAogICAgImV4cCI6IDE3OTk1MzU2MDAKfQ.DaYlNEoUrrEn2Ig7tqibS-PHK5vgusbcbo7X36XVt4Q'
};

async function main() {
  console.log('🔍 检查博客文章详细信息\n');
  console.log('='.repeat(70));

  const client = createClient(TARGET_CONFIG.url, TARGET_CONFIG.serviceRoleKey);

  // 1. 检查文章总数
  const { data: posts, error, count } = await client
    .from('posts')
    .select('*', { count: 'exact' });

  if (error) {
    console.error('❌ 查询失败:', error.message);
    process.exit(1);
  }

  console.log(`\n📊 文章总数: ${count} 篇\n`);

  // 2. 显示所有文章
  console.log('📋 文章列表:\n');
  posts.forEach((post, index) => {
    console.log(`${index + 1}. ${post.title}`);
    console.log(`   ID: ${post.id}`);
    console.log(`   Slug: ${post.slug}`);
    console.log(`   状态: ${post.status}`);
    console.log(`   发布时间: ${post.published_at || '未发布'}`);
    console.log(`   作者ID: ${post.author_id || '无'}`);
    console.log('');
  });

  // 3. 检查 RLS 策略
  console.log('='.repeat(70));
  console.log('🔒 检查 Row Level Security (RLS) 策略\n');

  // 使用 anon key 测试（模拟前端访问）
  const anonClient = createClient(
    TARGET_CONFIG.url,
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyAgCiAgICAicm9sZSI6ICJhbm9uIiwKICAgICJpc3MiOiAic3VwYWJhc2UtZGVtbyIsCiAgICAiaWF0IjogMTY0MTc2OTIwMCwKICAgICJleHAiOiAxNzk5NTM1NjAwCn0.dc_X5iR_VP_qT0zsiyj_I_OZ2T9FtRU2BBNWN8Bu4GE'
  );

  const { data: anonPosts, error: anonError, count: anonCount } = await anonClient
    .from('posts')
    .select('id, title, slug, status', { count: 'exact' });

  if (anonError) {
    console.log('❌ 匿名访问失败:', anonError.message);
    console.log('\n⚠️  可能的原因:');
    console.log('   1. RLS 策略未配置或配置错误');
    console.log('   2. posts 表启用了 RLS 但没有允许匿名读取的策略');
    console.log('\n💡 解决方案:');
    console.log('   需要在 Supabase Dashboard 中配置 RLS 策略');
    console.log('   或者暂时禁用 posts 表的 RLS');
  } else {
    console.log(`✅ 匿名访问成功: 可以读取 ${anonCount} 篇文章`);
    if (anonCount === 0) {
      console.log('\n⚠️  虽然访问成功，但返回 0 篇文章');
      console.log('   可能是 RLS 策略过滤了所有文章');
    }
  }

  // 4. 检查文章状态
  console.log('\n='.repeat(70));
  console.log('📈 文章状态统计\n');

  const statusCount = {};
  posts.forEach(post => {
    const status = post.status || 'null';
    statusCount[status] = (statusCount[status] || 0) + 1;
  });

  Object.entries(statusCount).forEach(([status, count]) => {
    console.log(`   ${status}: ${count} 篇`);
  });

  // 5. 建议
  console.log('\n='.repeat(70));
  console.log('💡 建议\n');

  if (anonError || anonCount === 0) {
    console.log('需要配置 RLS 策略以允许公开访问文章：\n');
    console.log('方案 1: 在 SQL Editor 中运行以下 SQL：');
    console.log('```sql');
    console.log('-- 允许所有人读取已发布的文章');
    console.log('CREATE POLICY "Allow public read access to published posts"');
    console.log('ON public.posts');
    console.log('FOR SELECT');
    console.log('USING (status = \'published\');');
    console.log('```\n');
    console.log('方案 2: 暂时禁用 RLS（不推荐用于生产环境）：');
    console.log('```sql');
    console.log('ALTER TABLE public.posts DISABLE ROW LEVEL SECURITY;');
    console.log('```\n');
  } else {
    console.log('✅ 文章可以正常访问');
    console.log('   如果网站仍然无法显示文章，请检查：');
    console.log('   1. 前端代码的查询条件');
    console.log('   2. 浏览器控制台的错误信息');
    console.log('   3. 网络请求是否成功');
  }
}

main().catch(error => {
  console.error('\n❌ 检查失败:', error);
  process.exit(1);
});

