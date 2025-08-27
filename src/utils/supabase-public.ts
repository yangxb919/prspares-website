import { createClient } from '@supabase/supabase-js';

// 单例模式的 Supabase 客户端
let supabaseInstance: ReturnType<typeof createClient> | null = null;

// 创建公共客户端（单例模式）
export const createPublicClient = () => {
  // 如果已经有实例，直接返回
  if (supabaseInstance) {
    return supabaseInstance;
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

  // 如果没有配置 Supabase，抛出错误
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Supabase configuration missing. Please check NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in your environment variables.');
  }

  // 创建新实例并缓存
  supabaseInstance = createClient(supabaseUrl, supabaseAnonKey, {
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

  return supabaseInstance;
};
