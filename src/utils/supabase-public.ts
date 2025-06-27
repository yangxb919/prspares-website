import { createClient } from '@supabase/supabase-js';

// 创建公共客户端
export const createPublicClient = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

  // 如果没有配置 Supabase，抛出错误
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Supabase configuration missing. Please check NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in your environment variables.');
  }

  return createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      storageKey: 'supabase.auth.token',
      detectSessionInUrl: true, // 重要：检测URL中的会话参数
      flowType: 'implicit' // 使用隐式流程更适合客户端跳转
    },
    global: {
      headers: {
        'X-Client-Info': 'moldall-auth-client'
      }
    }
  });
};
