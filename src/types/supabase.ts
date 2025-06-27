export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          display_name: string | null
          role: string | null
          created_at?: string
          updated_at?: string
        }
        Insert: {
          id: string
          display_name?: string | null
          role?: string | null
        }
        Update: {
          id?: string
          display_name?: string | null
          role?: string | null
        }
      }
      // 其他表...
    }
    // 其他函数或视图...
  }
}
