import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  db: { schema: 'til' }
});

// 데이터베이스 테이블 타입
export interface DbTilEntry {
  id: string;
  date: string;
  title: string;
  content: string | null;
  category: string;
  created_at: string;
  updated_at: string;
}
