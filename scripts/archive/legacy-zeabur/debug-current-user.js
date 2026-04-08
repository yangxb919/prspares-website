const { createClient } = require('@supabase/supabase-js');

// Hardcode credentials from .env.local
const supabaseUrl = 'https://prspares.zeabur.app';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyAgCiAgICAicm9sZSI6ICJzZXJ2aWNlX3JvbGUiLAogICAgImlzcyI6ICJzdXBhYmFzZS1kZW1vIiwKICAgICJpYXQiOiAxNjQxNzY5MjAwLAogICAgImV4cCI6IDE3OTk1MzU2MDAKfQ.DaYlNEoUrrEn2Ig7tqibS-PHK5vgusbcbo7X36XVt4Q';

const supabase = createClient(supabaseUrl, supabaseKey);

async function debugCurrentUser() {
  console.log('\n🔍 调试当前用户和文章数据\n');
  console.log('='.repeat(60));
  
  try {
    // 1. 查看所有 profiles
    console.log('\n1️⃣ 所有用户 (profiles):\n');
    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .select('*');
    
    if (profilesError) {
      console.error('❌ Error fetching profiles:', profilesError);
    } else {
      console.table(profiles);
    }
    
    // 2. 查看所有 posts
    console.log('\n2️⃣ 所有文章 (posts):\n');
    const { data: posts, error: postsError } = await supabase
      .from('posts')
      .select('id, title, author_id, status, published_at');
    
    if (postsError) {
      console.error('❌ Error fetching posts:', postsError);
    } else {
      console.table(posts);
    }
    
    // 3. 检查 author_id 匹配
    console.log('\n3️⃣ 检查 author_id 匹配情况:\n');
    if (profiles && posts) {
      const profileIds = profiles.map(p => p.id);
      const postAuthorIds = [...new Set(posts.map(p => p.author_id))];
      
      console.log('Profile IDs:', profileIds);
      console.log('Post Author IDs:', postAuthorIds);
      
      postAuthorIds.forEach(authorId => {
        const hasProfile = profileIds.includes(authorId);
        console.log(`\n${hasProfile ? '✅' : '❌'} Author ID: ${authorId}`);
        if (hasProfile) {
          const profile = profiles.find(p => p.id === authorId);
          console.log(`   Profile: ${profile.display_name} (${profile.role})`);
        } else {
          console.log('   ⚠️ 没有对应的 profile！');
        }
      });
    }
    
    // 4. 模拟不同角色的查询
    console.log('\n4️⃣ 模拟不同角色的查询:\n');
    
    if (profiles && profiles.length > 0) {
      for (const profile of profiles) {
        console.log(`\n👤 用户: ${profile.display_name} (${profile.role})`);
        console.log(`   ID: ${profile.id}`);
        
        let query = supabase.from('posts').select('id, title, author_id');
        
        if (profile.role === 'author') {
          query = query.eq('author_id', profile.id);
          console.log(`   查询条件: author_id = ${profile.id}`);
        } else {
          console.log(`   查询条件: 所有文章（admin 权限）`);
        }
        
        const { data, error } = await query;
        
        if (error) {
          console.error(`   ❌ 查询失败:`, error);
        } else {
          console.log(`   ✅ 可以看到 ${data.length} 篇文章`);
          if (data.length > 0) {
            data.forEach(post => {
              console.log(`      - ${post.title}`);
            });
          }
        }
      }
    }
    
    console.log('\n' + '='.repeat(60));
    console.log('\n💡 问题分析:\n');
    console.log('如果你登录的用户角色是 "author"，那么只能看到 author_id 等于自己 ID 的文章。');
    console.log('如果你登录的用户角色是 "admin"，那么可以看到所有文章。');
    console.log('\n解决方案:');
    console.log('1. 确认你登录的用户角色是 admin');
    console.log('2. 或者将文章的 author_id 改为你当前登录用户的 ID');
    console.log('3. 或者修改代码逻辑，让所有用户都能看到所有文章\n');
    
  } catch (error) {
    console.error('❌ Unexpected error:', error);
  }
}

debugCurrentUser();

