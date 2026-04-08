#!/usr/bin/env node

/**
 * 迁移用户认证数据
 * 使用 Supabase Admin API 迁移用户账号
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

async function main() {
  console.log('🔐 开始迁移用户认证数据\n');
  console.log('='.repeat(70));

  const sourceClient = createClient(SOURCE_CONFIG.url, SOURCE_CONFIG.serviceRoleKey);
  const targetClient = createClient(TARGET_CONFIG.url, TARGET_CONFIG.serviceRoleKey);

  // 1. 从源数据库获取所有用户
  console.log('\n1️⃣  从源数据库获取用户列表...');
  
  const { data: sourceUsers, error: sourceError } = await sourceClient.auth.admin.listUsers();

  if (sourceError) {
    console.error('❌ 获取源用户失败:', sourceError.message);
    process.exit(1);
  }

  console.log(`✅ 找到 ${sourceUsers.users.length} 个用户账号\n`);

  // 显示用户信息
  console.log('📋 用户列表:');
  sourceUsers.users.forEach((user, index) => {
    console.log(`   ${index + 1}. ${user.email || user.phone || user.id}`);
    console.log(`      ID: ${user.id}`);
    console.log(`      创建时间: ${user.created_at}`);
    console.log(`      最后登录: ${user.last_sign_in_at || '从未登录'}`);
  });

  // 2. 创建备份
  const backupDir = path.join(__dirname, '..', 'backups', 'auth_users');
  if (!fs.existsSync(backupDir)) {
    fs.mkdirSync(backupDir, { recursive: true });
  }

  const backupFile = path.join(backupDir, `users_${Date.now()}.json`);
  fs.writeFileSync(backupFile, JSON.stringify(sourceUsers.users, null, 2));
  console.log(`\n💾 用户数据已备份: ${backupFile}`);

  // 3. 迁移用户到目标数据库
  console.log('\n2️⃣  开始迁移用户到目标数据库...\n');
  console.log('='.repeat(70));

  let successCount = 0;
  let failCount = 0;
  const errors = [];

  for (let i = 0; i < sourceUsers.users.length; i++) {
    const user = sourceUsers.users[i];
    const email = user.email || 'N/A';
    
    console.log(`\n[${i + 1}/${sourceUsers.users.length}] 迁移用户: ${email}`);
    console.log(`   ID: ${user.id}`);

    try {
      // 使用 Admin API 创建用户
      // 注意：这会创建新用户，密码需要用户重置
      const { data: newUser, error: createError } = await targetClient.auth.admin.createUser({
        email: user.email,
        phone: user.phone,
        email_confirm: true, // 自动确认邮箱
        phone_confirm: user.phone ? true : undefined,
        user_metadata: user.user_metadata || {},
        app_metadata: user.app_metadata || {},
      });

      if (createError) {
        // 检查是否是因为用户已存在
        if (createError.message.includes('already registered') || 
            createError.message.includes('already exists')) {
          console.log('   ⚠️  用户已存在，跳过');
          successCount++;
        } else {
          throw createError;
        }
      } else {
        console.log('   ✅ 创建成功');
        successCount++;
      }

    } catch (error) {
      console.error('   ❌ 创建失败:', error.message);
      failCount++;
      errors.push({
        user: email,
        id: user.id,
        error: error.message
      });
    }
  }

  // 4. 显示结果
  console.log('\n' + '='.repeat(70));
  console.log('📊 迁移结果');
  console.log('='.repeat(70));
  console.log(`   总用户数: ${sourceUsers.users.length}`);
  console.log(`   成功: ${successCount}`);
  console.log(`   失败: ${failCount}`);

  if (errors.length > 0) {
    console.log('\n❌ 失败的用户:');
    errors.forEach((err, i) => {
      console.log(`   ${i + 1}. ${err.user} (${err.id})`);
      console.log(`      错误: ${err.error}`);
    });
  }

  // 5. 重要提示
  console.log('\n' + '='.repeat(70));
  console.log('⚠️  重要提示');
  console.log('='.repeat(70));
  console.log('\n由于安全原因，用户密码无法直接迁移。');
  console.log('用户需要通过以下方式之一重新设置密码：\n');
  console.log('方案 1: 使用"忘记密码"功能');
  console.log('   - 用户访问登录页面');
  console.log('   - 点击"忘记密码"');
  console.log('   - 输入邮箱接收重置链接');
  console.log('   - 设置新密码\n');
  console.log('方案 2: 管理员手动重置密码');
  console.log('   - 在 Supabase Dashboard 中');
  console.log('   - 找到用户并重置密码');
  console.log('   - 将新密码发送给用户\n');
  console.log('方案 3: 让用户重新注册');
  console.log('   - 如果用户数量少');
  console.log('   - 可以让用户使用相同邮箱重新注册\n');

  if (successCount === sourceUsers.users.length) {
    console.log('✅ 所有用户账号已成功迁移！');
    console.log('\n📝 下一步:');
    console.log('   1. 通知用户需要重置密码');
    console.log('   2. 或者在 Dashboard 中为用户设置临时密码');
    console.log('   3. 继续测试网站其他功能');
  } else {
    console.log('⚠️  部分用户迁移失败，请检查错误信息');
  }

  // 6. 验证 profiles 表的关联
  console.log('\n3️⃣  验证 profiles 表关联...');
  
  const { data: targetProfiles, error: profileError } = await targetClient
    .from('profiles')
    .select('id, display_name');

  if (!profileError && targetProfiles) {
    console.log(`✅ profiles 表有 ${targetProfiles.length} 条记录`);
    
    // 检查是否所有用户都有对应的 profile
    const { data: targetUsers } = await targetClient.auth.admin.listUsers();
    if (targetUsers && targetUsers.users) {
      const profileIds = new Set(targetProfiles.map(p => p.id));
      const missingProfiles = targetUsers.users.filter(u => !profileIds.has(u.id));
      
      if (missingProfiles.length > 0) {
        console.log(`⚠️  有 ${missingProfiles.length} 个用户缺少 profile 记录`);
        console.log('   这些用户在首次登录时会自动创建 profile');
      } else {
        console.log('✅ 所有用户都有对应的 profile 记录');
      }
    }
  }
}

main().catch(error => {
  console.error('\n❌ 迁移失败:', error);
  console.error('错误详情:', error.stack);
  process.exit(1);
});

