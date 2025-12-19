const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// 手动读取 .env.local 文件
const envPath = path.join(__dirname, '..', '.env.local');
const envContent = fs.readFileSync(envPath, 'utf-8');
envContent.split('\n').forEach(line => {
  // 跳过注释和空行
  if (line.trim().startsWith('#') || !line.trim()) return;

  const equalIndex = line.indexOf('=');
  if (equalIndex > 0) {
    const key = line.substring(0, equalIndex).trim();
    const value = line.substring(equalIndex + 1).trim();
    if (key) {
      process.env[key] = value;
    }
  }
});

async function testEmailConfig() {
  console.log('\n🔍 Testing Supabase Email Configuration...\n');

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  console.log('Supabase URL:', supabaseUrl);
  console.log('Using self-hosted Supabase:', supabaseUrl.includes('zeabur.app'));

  const supabase = createClient(supabaseUrl, supabaseKey);

  // 测试发送重置邮件
  const testEmail = 'lijiedong08@gmail.com';
  
  console.log(`\n📧 Attempting to send password reset email to: ${testEmail}\n`);

  try {
    const { data, error } = await supabase.auth.resetPasswordForEmail(testEmail, {
      redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3005'}/reset-password`,
    });

    if (error) {
      console.error('❌ Error sending email:', error);
      console.error('\nError details:');
      console.error('- Message:', error.message);
      console.error('- Status:', error.status);
      console.error('- Code:', error.code);
      
      console.log('\n📝 Possible causes:');
      console.log('1. Self-hosted Supabase instance does not have SMTP configured');
      console.log('2. Email service is disabled in Supabase settings');
      console.log('3. SMTP credentials are incorrect or missing');
      
      console.log('\n💡 Solutions:');
      console.log('1. Configure SMTP in your Supabase instance');
      console.log('2. Use the hosted Supabase service (supabase.co) which has email pre-configured');
      console.log('3. Implement a custom email solution using a service like SendGrid, Mailgun, or Resend');
      
      return false;
    }

    console.log('✅ Email sent successfully!');
    console.log('Data:', data);
    return true;

  } catch (error) {
    console.error('❌ Unexpected error:', error);
    return false;
  }
}

// 检查环境变量
function checkEnvVars() {
  console.log('\n🔧 Checking Environment Variables...\n');
  
  const requiredVars = [
    'NEXT_PUBLIC_SUPABASE_URL',
    'NEXT_PUBLIC_SUPABASE_ANON_KEY',
  ];

  let allPresent = true;
  
  for (const varName of requiredVars) {
    const value = process.env[varName];
    if (value) {
      console.log(`✅ ${varName}: ${value.substring(0, 30)}...`);
    } else {
      console.log(`❌ ${varName}: MISSING`);
      allPresent = false;
    }
  }

  return allPresent;
}

async function main() {
  console.log('='.repeat(60));
  console.log('  Supabase Email Configuration Test');
  console.log('='.repeat(60));

  if (!checkEnvVars()) {
    console.error('\n❌ Missing required environment variables!');
    process.exit(1);
  }

  await testEmailConfig();

  console.log('\n' + '='.repeat(60));
}

main();

