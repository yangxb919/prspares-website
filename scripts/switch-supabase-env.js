const fs = require('fs');
const path = require('path');

const envPath = path.join(__dirname, '..', '.env.local');

// 读取当前 .env.local
let envContent = fs.readFileSync(envPath, 'utf-8');

// 检查当前使用的是哪个数据库
const isUsingNew = envContent.includes('NEXT_PUBLIC_SUPABASE_URL=https://prspares.zeabur.app');

console.log('\n🔄 Supabase Environment Switcher\n');
console.log('Current database:', isUsingNew ? 'NEW (prspares.zeabur.app)' : 'OLD (supabase.co)');

if (isUsingNew) {
  console.log('\n➡️  Switching to OLD database (with email support)...\n');
  
  // 注释掉新数据库配置
  envContent = envContent.replace(
    /^(NEXT_PUBLIC_SUPABASE_URL=https:\/\/prspares\.zeabur\.app)/gm,
    '# $1'
  );
  envContent = envContent.replace(
    /^(NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9\.eyAgCiAgICAicm9sZSI6ICJhbm9uIiwKICAgICJpc3MiOiAic3VwYWJhc2UtZGVtbyIsCiAgICAiaWF0IjogMTY0MTc2OTIwMCwKICAgICJleHAiOiAxNzk5NTM1NjAwCn0\.dc_X5iR_VP_qT0zsiyj_I_OZ2T9FtRU2BBNWN8Bu4GE)/gm,
    '# $1'
  );
  envContent = envContent.replace(
    /^(SUPABASE_SERVICE_ROLE=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9\.eyAgCiAgICAicm9sZSI6ICJzZXJ2aWNlX3JvbGUiLAogICAgImlzcyI6ICJzdXBhYmFzZS1kZW1vIiwKICAgICJpYXQiOiAxNjQxNzY5MjAwLAogICAgImV4cCI6IDE3OTk1MzU2MDAKfQ\.DaYlNEoUrrEn2Ig7tqibS-PHK5vgusbcbo7X36XVt4Q)/gm,
    '# $1'
  );
  
  // 取消注释旧数据库配置
  envContent = envContent.replace(
    /^# (NEXT_PUBLIC_SUPABASE_URL=https:\/\/eiikisplpnbeiscunkap\.supabase\.co)/gm,
    '$1'
  );
  envContent = envContent.replace(
    /^# (NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9\.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVpaWtpc3BscG5iZWlzY3Vua2FwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc0MDA0NjgsImV4cCI6MjA2Mjk3NjQ2OH0\.JT5QFU6scD0822bFeFpw4z2BjgTv6Kk9xwDgtdjaFf0)/gm,
    '$1'
  );
  envContent = envContent.replace(
    /^# (SUPABASE_SERVICE_ROLE=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9\.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVpaWtpc3BscG5iZWlzY3Vua2FwIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0NzQwMDQ2OCwiZXhwIjoyMDYyOTc2NDY4fQ\.XiAOSd6yPdnnRzyw8V1DS6M27dLRJZuf8vMjhVbZk_I)/gm,
    '$1'
  );
  
  console.log('✅ Switched to OLD database');
  console.log('📧 Email service: ENABLED (Supabase hosted)');
  console.log('⚠️  Note: This is the OLD database with migrated data');
  
} else {
  console.log('\n➡️  Switching to NEW database (self-hosted)...\n');
  
  // 注释掉旧数据库配置
  envContent = envContent.replace(
    /^(NEXT_PUBLIC_SUPABASE_URL=https:\/\/eiikisplpnbeiscunkap\.supabase\.co)/gm,
    '# $1'
  );
  envContent = envContent.replace(
    /^(NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9\.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVpaWtpc3BscG5iZWlzY3Vua2FwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc0MDA0NjgsImV4cCI6MjA2Mjk3NjQ2OH0\.JT5QFU6scD0822bFeFpw4z2BjgTv6Kk9xwDgtdjaFf0)/gm,
    '# $1'
  );
  envContent = envContent.replace(
    /^(SUPABASE_SERVICE_ROLE=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9\.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVpaWtpc3BscG5iZWlzY3Vua2FwIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0NzQwMDQ2OCwiZXhwIjoyMDYyOTc2NDY4fQ\.XiAOSd6yPdnnRzyw8V1DS6M27dLRJZuf8vMjhVbZk_I)/gm,
    '# $1'
  );
  
  // 取消注释新数据库配置
  envContent = envContent.replace(
    /^# (NEXT_PUBLIC_SUPABASE_URL=https:\/\/prspares\.zeabur\.app)/gm,
    '$1'
  );
  envContent = envContent.replace(
    /^# (NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9\.eyAgCiAgICAicm9sZSI6ICJhbm9uIiwKICAgICJpc3MiOiAic3VwYWJhc2UtZGVtbyIsCiAgICAiaWF0IjogMTY0MTc2OTIwMCwKICAgICJleHAiOiAxNzk5NTM1NjAwCn0\.dc_X5iR_VP_qT0zsiyj_I_OZ2T9FtRU2BBNWN8Bu4GE)/gm,
    '$1'
  );
  envContent = envContent.replace(
    /^# (SUPABASE_SERVICE_ROLE=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9\.eyAgCiAgICAicm9sZSI6ICJzZXJ2aWNlX3JvbGUiLAogICAgImlzcyI6ICJzdXBhYmFzZS1kZW1vIiwKICAgICJpYXQiOiAxNjQxNzY5MjAwLAogICAgImV4cCI6IDE3OTk1MzU2MDAKfQ\.DaYlNEoUrrEn2Ig7tqibS-PHK5vgusbcbo7X36XVt4Q)/gm,
    '$1'
  );
  
  console.log('✅ Switched to NEW database');
  console.log('⚠️  Email service: DISABLED (needs SMTP configuration)');
  console.log('📝 To enable email, configure SMTP in Supabase Dashboard');
}

// 写回文件
fs.writeFileSync(envPath, envContent);

console.log('\n📝 Updated .env.local file');
console.log('🔄 Please restart your development server for changes to take effect\n');
console.log('Run: npm run dev\n');

