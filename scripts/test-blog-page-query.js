#!/usr/bin/env node

/**
 * 模拟博客页面的查询，看看是否能获取到数据
 */

const { createClient } = require('@supabase/supabase-js');

const CONFIG = {
  url: 'https://prspares.zeabur.app',
  anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyAgCiAgICAicm9sZSI6ICJhbm9uIiwKICAgICJpc3MiOiAic3VwYWJhc2UtZGVtbyIsCiAgICAiaWF0IjogMTY0MTc2OTIwMCwKICAgICJleHAiOiAxNzk5NTM1NjAwCn0.dc_X5iR_VP_qT0zsiyj_I_OZ2T9FtRU2BBNWN8Bu4GE'
};

async function main() {
  console.log('🧪 模拟博客页面查询\n');
  console.log('='.repeat(70));

  const supabase = createClient(CONFIG.url, CONFIG.anonKey);

  // 模拟 src/app/blog/page.tsx 的查询
  console.log('\n1️⃣  执行与前端相同的查询...\n');

  try {
    const { data, error } = await supabase
      .from('posts')
      .select(`
        id,
        title,
        slug,
        excerpt,
        content,
        status,
        published_at,
        created_at,
        meta,
        author_id,
        profiles:profiles(id, display_name, avatar_url)
      `)
      .eq('status', 'publish')
      .order('published_at', { ascending: false })
      .limit(20);

    if (error) {
      console.error('❌ 查询失败:', error);
      console.error('错误详情:', JSON.stringify(error, null, 2));
      
      console.log('\n💡 可能的原因:');
      console.log('   1. profiles 表的外键关联问题');
      console.log('   2. RLS 策略阻止了 JOIN 查询');
      console.log('   3. author_id 字段类型不匹配');
      
      // 尝试不带 profiles 的查询
      console.log('\n2️⃣  尝试不带 profiles 的查询...\n');
      
      const { data: simpleData, error: simpleError } = await supabase
        .from('posts')
        .select('id, title, slug, status, author_id')
        .eq('status', 'publish')
        .limit(5);

      if (simpleError) {
        console.error('❌ 简单查询也失败:', simpleError);
      } else {
        console.log('✅ 简单查询成功，返回', simpleData?.length, '条记录');
        console.log('\n示例数据:');
        console.log(JSON.stringify(simpleData?.[0], null, 2));
        
        console.log('\n⚠️  问题出在 profiles 关联上！');
        console.log('\n💡 解决方案:');
        console.log('   需要在目标数据库中设置外键关系：');
        console.log('   ALTER TABLE posts ADD CONSTRAINT posts_author_id_fkey');
        console.log('   FOREIGN KEY (author_id) REFERENCES profiles(id);');
      }
      
      return;
    }

    console.log('✅ 查询成功！');
    console.log(`   返回 ${data?.length || 0} 条记录\n`);

    if (data && data.length > 0) {
      console.log('📋 文章列表:\n');
      data.forEach((post, index) => {
        console.log(`${index + 1}. ${post.title}`);
        console.log(`   Slug: ${post.slug}`);
        console.log(`   作者: ${post.profiles?.display_name || '无'}`);
        console.log(`   发布时间: ${post.published_at}`);
        console.log('');
      });

      console.log('='.repeat(70));
      console.log('✅ 博客页面查询完全正常！');
      console.log('\n如果网站仍然看不到文章，请检查：');
      console.log('   1. 清除浏览器缓存');
      console.log('   2. 重启开发服务器');
      console.log('   3. 检查浏览器控制台的错误信息');
      console.log('   4. 确认 .env.local 文件已正确更新');
    } else {
      console.log('⚠️  查询成功但返回 0 条记录');
      console.log('   这不应该发生，因为数据库中有 12 篇文章');
    }

  } catch (err) {
    console.error('❌ 查询异常:', err);
  }
}

main().catch(error => {
  console.error('\n❌ 测试失败:', error);
  process.exit(1);
});

