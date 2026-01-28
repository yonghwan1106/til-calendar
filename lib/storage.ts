'use client';

import { TilEntry, Category, CATEGORIES } from './types';
import { supabase, DbTilEntry } from './supabase';

// 유효한 카테고리인지 확인
function isValidCategory(category: string): category is Category {
  return category in CATEGORIES;
}

// DB 엔트리를 앱 엔트리로 변환
function dbToApp(db: DbTilEntry): TilEntry {
  return {
    id: db.id,
    date: db.date,
    title: db.title,
    content: db.content || undefined,
    category: isValidCategory(db.category) ? db.category : 'other',
    createdAt: db.created_at,
    updatedAt: db.updated_at,
  };
}

// 모든 TIL 엔트리 가져오기
export async function getAllEntries(): Promise<TilEntry[]> {
  const { data, error } = await supabase
    .from('entries')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Failed to fetch entries:', error);
    return [];
  }

  return (data || []).map(dbToApp);
}

// 특정 날짜의 TIL 엔트리 가져오기
export async function getEntriesByDate(date: string): Promise<TilEntry[]> {
  const { data, error } = await supabase
    .from('entries')
    .select('*')
    .eq('date', date)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Failed to fetch entries by date:', error);
    return [];
  }

  return (data || []).map(dbToApp);
}

// 새 TIL 엔트리 추가
export async function addEntry(
  entry: Omit<TilEntry, 'id' | 'createdAt' | 'updatedAt'>
): Promise<TilEntry | null> {
  const { data, error } = await supabase
    .from('entries')
    .insert({
      date: entry.date,
      title: entry.title,
      content: entry.content || null,
      category: entry.category,
    })
    .select()
    .single();

  if (error) {
    console.error('Failed to add entry:', error);
    return null;
  }

  return dbToApp(data);
}

// TIL 엔트리 수정
export async function updateEntry(
  id: string,
  updates: Partial<Omit<TilEntry, 'id' | 'createdAt'>>
): Promise<TilEntry | null> {
  const updateData: Record<string, unknown> = {};
  if (updates.date !== undefined) updateData.date = updates.date;
  if (updates.title !== undefined) updateData.title = updates.title;
  if (updates.content !== undefined) updateData.content = updates.content || null;
  if (updates.category !== undefined) updateData.category = updates.category;

  const { data, error } = await supabase
    .from('entries')
    .update(updateData)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Failed to update entry:', error);
    return null;
  }

  return dbToApp(data);
}

// TIL 엔트리 삭제
export async function deleteEntry(id: string): Promise<boolean> {
  const { error } = await supabase
    .from('entries')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Failed to delete entry:', error);
    return false;
  }

  return true;
}

// 특정 ID의 TIL 엔트리 가져오기
export async function getEntryById(id: string): Promise<TilEntry | null> {
  const { data, error } = await supabase
    .from('entries')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error('Failed to fetch entry:', error);
    return null;
  }

  return dbToApp(data);
}
