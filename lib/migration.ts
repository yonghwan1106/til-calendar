'use client';

import { supabase } from './supabase';
import { TilEntry, Category, CATEGORIES } from './types';

const STORAGE_KEY = 'til-calendar-data';

interface OldTilStorage {
  entries: TilEntry[];
  lastUpdated: string;
}

// 유효한 카테고리인지 확인
function isValidCategory(category: string): category is Category {
  return category in CATEGORIES;
}

// 기존 카테고리를 새 카테고리로 마이그레이션
function migrateCategory(category: string): Category {
  const migration: Record<string, Category> = {
    'coding': 'ai',
    'language': 'other',
  };

  if (migration[category]) {
    return migration[category];
  }

  if (isValidCategory(category)) {
    return category;
  }

  return 'other';
}

// localStorage에서 데이터 읽기
export function getLocalStorageData(): TilEntry[] {
  if (typeof window === 'undefined') {
    return [];
  }

  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) {
      const storage = JSON.parse(data) as OldTilStorage;
      return storage.entries.map(entry => ({
        ...entry,
        category: migrateCategory(entry.category),
      }));
    }
  } catch (error) {
    console.error('Failed to read localStorage:', error);
  }

  return [];
}

// localStorage 데이터를 Supabase로 마이그레이션
export async function migrateToSupabase(): Promise<{ success: number; failed: number }> {
  const entries = getLocalStorageData();

  if (entries.length === 0) {
    return { success: 0, failed: 0 };
  }

  let success = 0;
  let failed = 0;

  for (const entry of entries) {
    const { error } = await supabase
      .from('entries')
      .insert({
        date: entry.date,
        title: entry.title,
        content: entry.content || null,
        category: entry.category,
        created_at: entry.createdAt,
        updated_at: entry.updatedAt,
      });

    if (error) {
      console.error('Failed to migrate entry:', entry.id, error);
      failed++;
    } else {
      success++;
    }
  }

  return { success, failed };
}

// localStorage 데이터 존재 여부 확인
export function hasLocalStorageData(): boolean {
  if (typeof window === 'undefined') {
    return false;
  }

  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) {
      const storage = JSON.parse(data) as OldTilStorage;
      return storage.entries.length > 0;
    }
  } catch {
    return false;
  }

  return false;
}

// 마이그레이션 완료 후 localStorage 정리 (선택적)
export function clearLocalStorage(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(STORAGE_KEY);
}
