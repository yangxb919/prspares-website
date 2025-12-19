const { createClient } = require('@supabase/supabase-js');

// Hardcode credentials from .env.local
const supabaseUrl = 'https://prspares.zeabur.app';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyAgCiAgICAicm9sZSI6ICJzZXJ2aWNlX3JvbGUiLAogICAgImlzcyI6ICJzdXBhYmFzZS1kZW1vIiwKICAgICJpYXQiOiAxNjQxNzY5MjAwLAogICAgImV4cCI6IDE3OTk1MzU2MDAKfQ.DaYlNEoUrrEn2Ig7tqibS-PHK5vgusbcbo7X36XVt4Q';

console.log('✅ Using Supabase URL:', supabaseUrl);
console.log('✅ Using Service Role Key');
console.log('');

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkPostsData() {
  console.log('\n🔍 Checking Posts Data in Database\n');
  console.log('='.repeat(60));
  
  try {
    // 1. Check if posts table exists and get all posts
    console.log('\n1️⃣ Fetching all posts from database...\n');
    const { data: posts, error: postsError } = await supabase
      .from('posts')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (postsError) {
      console.error('❌ Error fetching posts:', postsError);
      return;
    }
    
    console.log(`✅ Found ${posts?.length || 0} posts in database\n`);
    
    if (posts && posts.length > 0) {
      console.log('📋 Posts Summary:\n');
      posts.forEach((post, index) => {
        console.log(`${index + 1}. ${post.title || 'Untitled'}`);
        console.log(`   ID: ${post.id}`);
        console.log(`   Slug: ${post.slug || 'N/A'}`);
        console.log(`   Author ID: ${post.author_id || 'N/A'}`);
        console.log(`   Status: ${post.status || 'N/A'}`);
        console.log(`   Created: ${post.created_at || 'N/A'}`);
        console.log(`   Published: ${post.published_at || 'Not published'}`);
        console.log('');
      });
    } else {
      console.log('⚠️ No posts found in database');
    }
    
    // 2. Check profiles table
    console.log('\n2️⃣ Checking profiles table...\n');
    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .select('*');
    
    if (profilesError) {
      console.error('❌ Error fetching profiles:', profilesError);
    } else {
      console.log(`✅ Found ${profiles?.length || 0} profiles\n`);
      if (profiles && profiles.length > 0) {
        profiles.forEach((profile, index) => {
          console.log(`${index + 1}. ${profile.display_name || 'No name'}`);
          console.log(`   ID: ${profile.id}`);
          console.log(`   Role: ${profile.role || 'N/A'}`);
          console.log('');
        });
      }
    }
    
    // 3. Check if there are posts with matching author_ids
    if (posts && posts.length > 0 && profiles && profiles.length > 0) {
      console.log('\n3️⃣ Checking author relationships...\n');
      
      const profileIds = profiles.map(p => p.id);
      const postsWithAuthors = posts.filter(p => profileIds.includes(p.author_id));
      const postsWithoutAuthors = posts.filter(p => !profileIds.includes(p.author_id));
      
      console.log(`✅ Posts with valid authors: ${postsWithAuthors.length}`);
      console.log(`⚠️ Posts without valid authors: ${postsWithoutAuthors.length}\n`);
      
      if (postsWithoutAuthors.length > 0) {
        console.log('Posts without valid authors:');
        postsWithoutAuthors.forEach(post => {
          console.log(`  - ${post.title} (ID: ${post.id}, Author ID: ${post.author_id})`);
        });
        console.log('');
      }
    }
    
    // 4. Test query with specific user
    console.log('\n4️⃣ Testing query with admin user...\n');
    
    if (profiles && profiles.length > 0) {
      const adminProfile = profiles.find(p => p.role === 'admin');
      
      if (adminProfile) {
        console.log(`Testing with admin user: ${adminProfile.display_name} (${adminProfile.id})\n`);
        
        // Test fetching all posts (admin should see all)
        const { data: adminPosts, error: adminError } = await supabase
          .from('posts')
          .select('*')
          .order('created_at', { ascending: false });
        
        if (adminError) {
          console.error('❌ Error fetching posts as admin:', adminError);
        } else {
          console.log(`✅ Admin can see ${adminPosts?.length || 0} posts`);
        }
      } else {
        console.log('⚠️ No admin profile found');
      }
    }
    
    // 5. Check RLS policies
    console.log('\n5️⃣ Checking RLS policies on posts table...\n');
    
    const { data: policies, error: policiesError } = await supabase
      .rpc('pg_policies')
      .eq('tablename', 'posts');
    
    if (policiesError) {
      console.log('⚠️ Could not fetch RLS policies (this is normal if using service role key)');
    } else if (policies) {
      console.log(`Found ${policies.length} RLS policies on posts table`);
    }
    
  } catch (error) {
    console.error('❌ Unexpected error:', error);
  }
  
  console.log('\n' + '='.repeat(60));
  console.log('\n💡 Troubleshooting Tips:\n');
  console.log('1. If no posts found:');
  console.log('   - Check if posts were migrated correctly');
  console.log('   - Run: node scripts/migrate-data.js');
  console.log('');
  console.log('2. If posts exist but not showing in admin:');
  console.log('   - Check browser console for errors');
  console.log('   - Check if user is logged in correctly');
  console.log('   - Check if author_id matches profile id');
  console.log('');
  console.log('3. If RLS policies are blocking access:');
  console.log('   - Check Supabase dashboard → Authentication → Policies');
  console.log('   - Make sure posts table has proper read policies');
  console.log('');
  console.log('='.repeat(60) + '\n');
}

checkPostsData();

