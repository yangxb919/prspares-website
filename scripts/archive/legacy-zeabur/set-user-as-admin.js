const { createClient } = require('@supabase/supabase-js');

// Hardcode credentials from .env.local
const supabaseUrl = 'https://prspares.zeabur.app';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyAgCiAgICAicm9sZSI6ICJzZXJ2aWNlX3JvbGUiLAogICAgImlzcyI6ICJzdXBhYmFzZS1kZW1vIiwKICAgICJpYXQiOiAxNjQxNzY5MjAwLAogICAgImV4cCI6IDE3OTk1MzU2MDAKfQ.DaYlNEoUrrEn2Ig7tqibS-PHK5vgusbcbo7X36XVt4Q';

const supabase = createClient(supabaseUrl, supabaseKey);

// 你想要设置为 admin 的用户邮箱或 display_name
const TARGET_USER = 'yangbowen919'; // 修改为你当前登录的用户名

async function setUserAsAdmin() {
  console.log('\n🔧 设置用户为 Admin\n');
  console.log('='.repeat(60));
  
  try {
    // 1. 查找用户
    console.log(`\n1️⃣ 查找用户: ${TARGET_USER}\n`);
    const { data: users, error: findError } = await supabase
      .from('profiles')
      .select('*')
      .or(`display_name.eq.${TARGET_USER},id.eq.${TARGET_USER}`);
    
    if (findError) {
      console.error('❌ Error finding user:', findError);
      return;
    }
    
    if (!users || users.length === 0) {
      console.error(`❌ 找不到用户: ${TARGET_USER}`);
      console.log('\n可用的用户:');
      const { data: allUsers } = await supabase.from('profiles').select('display_name, id, role');
      console.table(allUsers);
      return;
    }
    
    const user = users[0];
    console.log('✅ 找到用户:');
    console.log(`   Display Name: ${user.display_name}`);
    console.log(`   ID: ${user.id}`);
    console.log(`   当前角色: ${user.role}`);
    
    if (user.role === 'admin') {
      console.log('\n✅ 用户已经是 admin 角色了！');
      return;
    }
    
    // 2. 更新角色为 admin
    console.log(`\n2️⃣ 更新角色为 admin...\n`);
    const { data, error: updateError } = await supabase
      .from('profiles')
      .update({ role: 'admin' })
      .eq('id', user.id)
      .select();
    
    if (updateError) {
      console.error('❌ Error updating role:', updateError);
      return;
    }
    
    console.log('✅ 角色更新成功！');
    console.log(`   ${user.display_name} 现在是 admin 了！`);
    
    // 3. 验证更新
    console.log(`\n3️⃣ 验证更新...\n`);
    const { data: updatedUser, error: verifyError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();
    
    if (verifyError) {
      console.error('❌ Error verifying update:', verifyError);
      return;
    }
    
    console.log('✅ 验证成功:');
    console.log(`   Display Name: ${updatedUser.display_name}`);
    console.log(`   ID: ${updatedUser.id}`);
    console.log(`   新角色: ${updatedUser.role}`);
    
    console.log('\n' + '='.repeat(60));
    console.log('\n✅ 完成！现在请：');
    console.log('1. 退出登录: http://localhost:3000/logout');
    console.log('2. 重新登录');
    console.log('3. 访问管理页面: http://localhost:3000/admin/articles');
    console.log('4. 你应该能看到所有 12 篇文章了！\n');
    
  } catch (error) {
    console.error('❌ Unexpected error:', error);
  }
}

setUserAsAdmin();

