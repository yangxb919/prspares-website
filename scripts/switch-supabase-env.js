// DEPRECATED (2026-04-08)
// 此脚本原本用于在自建 zeabur 实例 (prspares.zeabur.app) 和官方 Supabase
// (eiikisplpnbeiscunkap.supabase.co) 之间切换。现已统一使用官方实例，
// zeabur 实例已废弃，不再需要切换。
//
// 如需修改数据库连接，请直接编辑 .env.local / .env.production 中的
// NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY / SUPABASE_SERVICE_ROLE。

console.error('[DEPRECATED] switch-supabase-env.js is no longer supported.');
console.error('Only one Supabase instance is in use: https://eiikisplpnbeiscunkap.supabase.co');
console.error('Edit .env.local directly if you need to change credentials.');
process.exit(1);
