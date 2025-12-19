const fs = require('fs');
const path = require('path');

console.log('\n🔍 Checking Password Reset Configuration...\n');
console.log('='.repeat(60));

// 读取 .env.local
const envPath = path.join(__dirname, '..', '.env.local');
const envContent = fs.readFileSync(envPath, 'utf-8');

const env = {};
envContent.split('\n').forEach(line => {
  if (line.trim().startsWith('#') || !line.trim()) return;
  const equalIndex = line.indexOf('=');
  if (equalIndex > 0) {
    const key = line.substring(0, equalIndex).trim();
    const value = line.substring(equalIndex + 1).trim();
    if (key) env[key] = value;
  }
});

console.log('\n📋 Current Configuration:\n');

// 检查 Supabase URL
const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL;
console.log('1. Supabase URL:', supabaseUrl);

if (supabaseUrl) {
  if (supabaseUrl.includes('zeabur.app')) {
    console.log('   ✅ Using self-hosted Supabase');
  } else if (supabaseUrl.includes('supabase.co')) {
    console.log('   ✅ Using hosted Supabase');
  }
}

// 检查 Site URL
const siteUrl = env.NEXT_PUBLIC_SITE_URL;
console.log('\n2. Site URL:', siteUrl || '❌ NOT SET');

if (!siteUrl) {
  console.log('   ⚠️  Warning: NEXT_PUBLIC_SITE_URL is not set');
  console.log('   💡 Add to .env.local: NEXT_PUBLIC_SITE_URL=http://localhost:3005');
}

console.log('\n' + '='.repeat(60));
console.log('\n📝 Required Supabase Dashboard Configuration:\n');

console.log('1. Site URL Configuration:');
console.log('   - Go to: Authentication → URL Configuration');
console.log('   - Set Site URL to: http://localhost:3005 (or your domain)');

console.log('\n2. Redirect URLs:');
console.log('   - Add these URLs to Redirect URLs list:');
console.log('     • http://localhost:3005/reset-password');
console.log('     • http://localhost:3005/auth/reset-password');
console.log('     • https://prspares.xyz/reset-password');
console.log('     • https://prspares.xyz/auth/reset-password');

console.log('\n3. Email Template:');
console.log('   - Go to: Authentication → Email Templates → Reset Password');
console.log('   - Ensure the link uses: {{ .SiteURL }}/reset-password?token={{ .Token }}&type=recovery');

console.log('\n' + '='.repeat(60));
console.log('\n🧪 Testing Steps:\n');

console.log('1. Clear browser cache and cookies');
console.log('2. Visit: http://localhost:3005/forgot-password');
console.log('3. Enter email and submit');
console.log('4. Check email - link should point to: http://localhost:3005/reset-password');
console.log('5. Click link and reset password');
console.log('6. Should NOT see "Auth session missing!" error');

console.log('\n' + '='.repeat(60));
console.log('\n📚 Documentation:\n');
console.log('- Full guide: docs/SUPABASE_REDIRECT_URL_CONFIG.md');
console.log('- SMTP setup: docs/SMTP_CONFIGURATION_GUIDE.md');
console.log('- Password reset: docs/PASSWORD_RESET_GUIDE.md');

console.log('\n' + '='.repeat(60));
console.log('\n✅ Code Changes Applied:\n');
console.log('- Updated: src/app/reset-password/page.tsx');
console.log('- Updated: src/pages/auth/reset-password.tsx');
console.log('- Added: verifyOtp() to establish session before password reset');

console.log('\n' + '='.repeat(60));
console.log('\n🚀 Next Steps:\n');
console.log('1. Configure Supabase Dashboard (see above)');
console.log('2. Restart dev server: npm run dev');
console.log('3. Test password reset flow');
console.log('4. Check browser console for any errors');

console.log('\n' + '='.repeat(60) + '\n');

