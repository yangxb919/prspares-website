const { createClient } = require('@supabase/supabase-js');

// Hardcode credentials from .env.local
const supabaseUrl = 'https://prspares.zeabur.app';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyAgCiAgICAicm9sZSI6ICJzZXJ2aWNlX3JvbGUiLAogICAgImlzcyI6ICJzdXBhYmFzZS1kZW1vIiwKICAgICJpYXQiOiAxNjQxNzY5MjAwLAogICAgImV4cCI6IDE3OTk1MzU2MDAKfQ.DaYlNEoUrrEn2Ig7tqibS-PHK5vgusbcbo7X36XVt4Q';

const supabase = createClient(supabaseUrl, supabaseKey);

async function setAdminRole() {
  console.log('\n🔧 Setting Admin Role\n');
  console.log('='.repeat(60));
  
  try {
    // 1. Get all profiles
    console.log('\n1️⃣ Fetching all profiles...\n');
    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .select('*');
    
    if (profilesError) {
      console.error('❌ Error fetching profiles:', profilesError);
      return;
    }
    
    console.log(`✅ Found ${profiles?.length || 0} profiles:\n`);
    profiles.forEach((profile, index) => {
      console.log(`${index + 1}. ${profile.display_name || 'No name'}`);
      console.log(`   ID: ${profile.id}`);
      console.log(`   Role: ${profile.role || 'N/A'}`);
      console.log('');
    });
    
    // 2. Update the first profile to admin
    if (profiles && profiles.length > 0) {
      const targetProfile = profiles[0]; // lijiedong08
      
      console.log(`\n2️⃣ Setting ${targetProfile.display_name} as admin...\n`);
      
      const { data: updated, error: updateError } = await supabase
        .from('profiles')
        .update({ role: 'admin' })
        .eq('id', targetProfile.id)
        .select();
      
      if (updateError) {
        console.error('❌ Error updating profile:', updateError);
      } else {
        console.log('✅ Successfully updated profile to admin!');
        console.log('Updated profile:', updated);
      }
      
      // 3. Verify the update
      console.log('\n3️⃣ Verifying update...\n');
      
      const { data: verified, error: verifyError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', targetProfile.id)
        .single();
      
      if (verifyError) {
        console.error('❌ Error verifying update:', verifyError);
      } else {
        console.log('✅ Verified profile:');
        console.log(`   Name: ${verified.display_name}`);
        console.log(`   ID: ${verified.id}`);
        console.log(`   Role: ${verified.role}`);
      }
    }
    
  } catch (error) {
    console.error('❌ Unexpected error:', error);
  }
  
  console.log('\n' + '='.repeat(60));
  console.log('\n✅ Done! You can now log in as admin.\n');
  console.log('Next steps:');
  console.log('1. Refresh the admin page: http://localhost:3000/admin/articles');
  console.log('2. You should now see all 12 articles');
  console.log('');
  console.log('='.repeat(60) + '\n');
}

setAdminRole();

