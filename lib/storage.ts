'use client';

import { TilEntry, TilStorage } from './types';
import { generateId } from './utils';

const STORAGE_KEY = 'til-calendar-data';

// localStorage에서 데이터 로드
export function loadStorage(): TilStorage {
  if (typeof window === 'undefined') {
    return { entries: [], lastUpdated: new Date().toISOString() };
  }

  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) {
      return JSON.parse(data);
    }
  } catch (error) {
    console.error('Failed to load storage:', error);
  }

  return { entries: [], lastUpdated: new Date().toISOString() };
}

// localStorage에 데이터 저장
export function saveStorage(storage: TilStorage): void {
  if (typeof window === 'undefined') return;

  try {
    storage.lastUpdated = new Date().toISOString();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(storage));
  } catch (error) {
    console.error('Failed to save storage:', error);
  }
}

// 모든 TIL 엔트리 가져오기
export function getAllEntries(): TilEntry[] {
  const storage = loadStorage();
  return storage.entries.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

// 특정 날짜의 TIL 엔트리 가져오기
export function getEntriesByDate(date: string): TilEntry[] {
  const entries = getAllEntries();
  return entries.filter(entry => entry.date === date);
}

// 새 TIL 엔트리 추가
export function addEntry(
  entry: Omit<TilEntry, 'id' | 'createdAt' | 'updatedAt'>
): TilEntry {
  const storage = loadStorage();
  const now = new Date().toISOString();

  const newEntry: TilEntry = {
    ...entry,
    id: generateId(),
    createdAt: now,
    updatedAt: now,
  };

  storage.entries.push(newEntry);
  saveStorage(storage);

  return newEntry;
}

// TIL 엔트리 수정
export function updateEntry(
  id: string,
  updates: Partial<Omit<TilEntry, 'id' | 'createdAt'>>
): TilEntry | null {
  const storage = loadStorage();
  const index = storage.entries.findIndex(e => e.id === id);

  if (index === -1) return null;

  storage.entries[index] = {
    ...storage.entries[index],
    ...updates,
    updatedAt: new Date().toISOString(),
  };

  saveStorage(storage);
  return storage.entries[index];
}

// TIL 엔트리 삭제
export function deleteEntry(id: string): boolean {
  const storage = loadStorage();
  const initialLength = storage.entries.length;
  storage.entries = storage.entries.filter(e => e.id !== id);

  if (storage.entries.length < initialLength) {
    saveStorage(storage);
    return true;
  }

  return false;
}

// 특정 ID의 TIL 엔트리 가져오기
export function getEntryById(id: string): TilEntry | null {
  const entries = getAllEntries();
  return entries.find(e => e.id === id) || null;
}
