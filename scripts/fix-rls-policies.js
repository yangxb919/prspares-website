const { createClient } = require('@supabase/supabase-js');

// Hardcode credentials from .env.local
const supabaseUrl = 'https://prspares.zeabur.app';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyAgCiAgICAicm9sZSI6ICJzZXJ2aWNlX3JvbGUiLAogICAgImlzcyI6ICJzdXBhYmFzZS1kZW1vIiwKICAgICJpYXQiOiAxNjQxNzY5MjAwLAogICAgImV4cCI6IDE3OTk1MzU2MDAKfQ.DaYlNEoUrrEn2Ig7tqibS-PHK5vgusbcbo7X36XVt4Q';

const supabase = createClient(supabaseUrl, supabaseKey);

async function fixRLSPolicies() {
  console.log('\n🔧 Fixing RLS Policies for Posts Table\n');
  console.log('='.repeat(60));
  
  try {
    console.log('\n📋 Creating RLS policies for posts table...\n');
    
    // SQL to create RLS policies
    const sql = `
-- Enable RLS on posts table
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Public can view published posts" ON public.posts;
DROP POLICY IF EXISTS "Authenticated users can view all posts" ON public.posts;
DROP POLICY IF EXISTS "Authors can insert their own posts" ON public.posts;
DROP POLICY IF EXISTS "Authors can update their own posts" ON public.posts;
DROP POLICY IF EXISTS "Authors can delete their own posts" ON public.posts;
DROP POLICY IF EXISTS "Service role can do anything" ON public.posts;

-- Policy 1: Public can view published posts
CREATE POLICY "Public can view published posts"
ON public.posts
FOR SELECT
TO public
USING (status = 'publish');

-- Policy 2: Authenticated users can view all posts (for admin/author dashboard)
CREATE POLICY "Authenticated users can view all posts"
ON public.posts
FOR SELECT
TO authenticated
USING (true);

-- Policy 3: Authors can insert their own posts
CREATE POLICY "Authors can insert their own posts"
ON public.posts
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = author_id);

-- Policy 4: Authors can update their own posts
CREATE POLICY "Authors can update their own posts"
ON public.posts
FOR UPDATE
TO authenticated
USING (auth.uid() = author_id)
WITH CHECK (auth.uid() = author_id);

-- Policy 5: Authors can delete their own posts
CREATE POLICY "Authors can delete their own posts"
ON public.posts
FOR DELETE
TO authenticated
USING (auth.uid() = author_id);

-- Policy 6: Service role can do anything (bypass RLS)
CREATE POLICY "Service role can do anything"
ON public.posts
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);
`;

    console.log('Executing SQL...\n');
    
    // Execute the SQL
    const { data, error } = await supabase.rpc('exec_sql', { sql_query: sql });
    
    if (error) {
      console.error('❌ Error executing SQL:', error);
      console.log('\n⚠️ The exec_sql function might not exist. Let me try a different approach...\n');
      
      // Alternative: Print SQL for manual execution
      console.log('📋 Please run this SQL in your Supabase SQL Editor:\n');
      console.log('='.repeat(60));
      console.log(sql);
      console.log('='.repeat(60));
      console.log('\nSteps:');
      console.log('1. Go to: https://prspares.zeabur.app/project/default/sql');
      console.log('2. Copy the SQL above');
      console.log('3. Paste it into the SQL Editor');
      console.log('4. Click "Run"');
      console.log('5. Refresh the admin page');
    } else {
      console.log('✅ RLS policies created successfully!');
    }
    
  } catch (error) {
    console.error('❌ Unexpected error:', error);
    
    // Print SQL for manual execution
    console.log('\n📋 Please run this SQL manually in Supabase SQL Editor:\n');
    console.log('='.repeat(60));
    console.log(`
-- Enable RLS on posts table
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Public can view published posts" ON public.posts;
DROP POLICY IF EXISTS "Authenticated users can view all posts" ON public.posts;
DROP POLICY IF EXISTS "Authors can insert their own posts" ON public.posts;
DROP POLICY IF EXISTS "Authors can update their own posts" ON public.posts;
DROP POLICY IF EXISTS "Authors can delete their own posts" ON public.posts;
DROP POLICY IF EXISTS "Service role can do anything" ON public.posts;

-- Policy 1: Public can view published posts
CREATE POLICY "Public can view published posts"
ON public.posts
FOR SELECT
TO public
USING (status = 'publish');

-- Policy 2: Authenticated users can view all posts (for admin/author dashboard)
CREATE POLICY "Authenticated users can view all posts"
ON public.posts
FOR SELECT
TO authenticated
USING (true);

-- Policy 3: Authors can insert their own posts
CREATE POLICY "Authors can insert their own posts"
ON public.posts
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = author_id);

-- Policy 4: Authors can update their own posts
CREATE POLICY "Authors can update their own posts"
ON public.posts
FOR UPDATE
TO authenticated
USING (auth.uid() = author_id)
WITH CHECK (auth.uid() = author_id);

-- Policy 5: Authors can delete their own posts
CREATE POLICY "Authors can delete their own posts"
ON public.posts
FOR DELETE
TO authenticated
USING (auth.uid() = author_id);

-- Policy 6: Service role can do anything (bypass RLS)
CREATE POLICY "Service role can do anything"
ON public.posts
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);
`);
    console.log('='.repeat(60));
    console.log('\nSteps:');
    console.log('1. Go to: https://prspares.zeabur.app/project/default/sql');
    console.log('2. Copy the SQL above');
    console.log('3. Paste it into the SQL Editor');
    console.log('4. Click "Run"');
    console.log('5. Refresh the admin page');
  }
  
  console.log('\n' + '='.repeat(60));
  console.log('\n💡 What these policies do:\n');
  console.log('1. ✅ Public users can view published posts');
  console.log('2. ✅ Authenticated users (admin/author) can view all posts');
  console.log('3. ✅ Authors can create posts');
  console.log('4. ✅ Authors can update their own posts');
  console.log('5. ✅ Authors can delete their own posts');
  console.log('6. ✅ Service role bypasses all restrictions');
  console.log('');
  console.log('='.repeat(60) + '\n');
}

fixRLSPolicies();

