'use client';

import { useState, useEffect, useCallback } from 'react';
import Calendar from './components/Calendar';
import TilForm from './components/TilForm';
import TilCard from './components/TilCard';
import Stats from './components/Stats';
import SearchBar from './components/SearchBar';
import { TilEntry, Category } from '@/lib/types';
import {
  getAllEntries,
  getEntriesByDate,
  addEntry,
  updateEntry,
  deleteEntry,
} from '@/lib/storage';
import { formatDate, filterEntries } from '@/lib/utils';

export default function Home() {
  const [entries, setEntries] = useState<TilEntry[]>([]);
  const [selectedDate, setSelectedDate] = useState(formatDate(new Date()));
  const [selectedDateEntries, setSelectedDateEntries] = useState<TilEntry[]>([]);
  const [editEntry, setEditEntry] = useState<TilEntry | null>(null);
  const [searchFilters, setSearchFilters] = useState({ keyword: '', category: '' });
  const [isSearchMode, setIsSearchMode] = useState(false);
  const [searchResults, setSearchResults] = useState<TilEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // 초기 데이터 로드
  useEffect(() => {
    const loadedEntries = getAllEntries();
    setEntries(loadedEntries);
    setIsLoading(false);
  }, []);

  // 선택된 날짜의 엔트리 업데이트
  useEffect(() => {
    if (!isSearchMode) {
      setSelectedDateEntries(getEntriesByDate(selectedDate));
    }
  }, [selectedDate, entries, isSearchMode]);

  // 새 TIL 추가
  const handleAddEntry = useCallback((data: { title: string; content?: string; category: Category }) => {
    const newEntry = addEntry({
      ...data,
      date: selectedDate,
    });
    setEntries(prev => [newEntry, ...prev]);
    setEditEntry(null);
  }, [selectedDate]);

  // TIL 수정
  const handleUpdateEntry = useCallback((data: { title: string; content?: string; category: Category }) => {
    if (!editEntry) return;

    const updated = updateEntry(editEntry.id, data);
    if (updated) {
      setEntries(prev => prev.map(e => (e.id === updated.id ? updated : e)));
    }
    setEditEntry(null);
  }, [editEntry]);

  // TIL 삭제
  const handleDeleteEntry = useCallback((id: string) => {
    const success = deleteEntry(id);
    if (success) {
      setEntries(prev => prev.filter(e => e.id !== id));
    }
  }, []);

  // 검색
  const handleSearch = useCallback((filters: { keyword: string; category: string }) => {
    setSearchFilters(filters);

    if (filters.keyword || filters.category) {
      setIsSearchMode(true);
      const results = filterEntries(entries, filters);
      setSearchResults(results);
    } else {
      setIsSearchMode(false);
      setSearchResults([]);
    }
  }, [entries]);

  // 날짜 선택
  const handleDateSelect = useCallback((date: string) => {
    setSelectedDate(date);
    setIsSearchMode(false);
    setSearchFilters({ keyword: '', category: '' });
  }, []);

  // 폼 제출 핸들러
  const handleFormSubmit = editEntry ? handleUpdateEntry : handleAddEntry;

  // 날짜 포맷팅
  const formatDateDisplay = (dateStr: string) => {
    const [year, month, day] = dateStr.split('-');
    const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
    const weekday = ['일', '월', '화', '수', '목', '금', '토'][date.getDay()];
    return `${parseInt(month)}월 ${parseInt(day)}일 (${weekday})`;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <main className="min-h-screen pb-8">
      {/* 헤더 */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-gray-900">TIL Calendar</h1>
              <p className="text-sm text-gray-500">매일 배움 기록</p>
            </div>
            <a
              href="https://github.com/yonghwan1106/til-calendar"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-gray-600 transition-colors"
              aria-label="GitHub"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path
                  fillRule="evenodd"
                  d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                  clipRule="evenodd"
                />
              </svg>
            </a>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 pt-6">
        {/* 검색바 */}
        <div className="mb-6">
          <SearchBar onSearch={handleSearch} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 왼쪽: 캘린더 & 통계 */}
          <div className="lg:col-span-1 space-y-6">
            <Calendar
              entries={entries}
              selectedDate={selectedDate}
              onDateSelect={handleDateSelect}
            />
            <Stats entries={entries} />
          </div>

          {/* 오른쪽: TIL 입력 & 목록 */}
          <div className="lg:col-span-2 space-y-6">
            {/* TIL 입력 폼 */}
            {!isSearchMode && (
              <TilForm
                date={selectedDate}
                editEntry={editEntry}
                onSubmit={handleFormSubmit}
                onCancel={editEntry ? () => setEditEntry(null) : undefined}
              />
            )}

            {/* TIL 목록 */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                {isSearchMode ? (
                  <>
                    검색 결과
                    <span className="text-sm font-normal text-gray-500 ml-2">
                      {searchResults.length}개
                    </span>
                  </>
                ) : (
                  <>
                    {formatDateDisplay(selectedDate)}
                    <span className="text-sm font-normal text-gray-500 ml-2">
                      {selectedDateEntries.length}개의 기록
                    </span>
                  </>
                )}
              </h3>

              {/* 검색 결과 또는 선택된 날짜의 기록 */}
              <div className="space-y-3">
                {isSearchMode ? (
                  searchResults.length > 0 ? (
                    searchResults.map((entry) => (
                      <div key={entry.id} className="animate-fade-in">
                        <TilCard
                          entry={entry}
                          onEdit={setEditEntry}
                          onDelete={handleDeleteEntry}
                        />
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <svg
                        className="w-12 h-12 mx-auto mb-3 text-gray-300"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                        />
                      </svg>
                      <p>검색 결과가 없습니다.</p>
                    </div>
                  )
                ) : selectedDateEntries.length > 0 ? (
                  selectedDateEntries.map((entry) => (
                    <div key={entry.id} className="animate-fade-in">
                      <TilCard
                        entry={entry}
                        onEdit={setEditEntry}
                        onDelete={handleDeleteEntry}
                      />
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <svg
                      className="w-12 h-12 mx-auto mb-3 text-gray-300"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                      />
                    </svg>
                    <p>이 날의 기록이 없습니다.</p>
                    <p className="text-sm mt-1">오늘 배운 것을 기록해보세요!</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 푸터 */}
      <footer className="mt-12 text-center text-sm text-gray-400">
        <p>&quot;시간을 지배한 사나이&quot;에서 영감을 받은 프로젝트</p>
      </footer>
    </main>
  );
}
