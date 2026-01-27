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
  const [showDetailPanel, setShowDetailPanel] = useState(false);

  useEffect(() => {
    const loadedEntries = getAllEntries();
    setEntries(loadedEntries);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (!isSearchMode) {
      setSelectedDateEntries(getEntriesByDate(selectedDate));
    }
  }, [selectedDate, entries, isSearchMode]);

  const handleAddEntry = useCallback((data: { title: string; content?: string; category: Category }) => {
    const newEntry = addEntry({
      ...data,
      date: selectedDate,
    });
    setEntries(prev => [newEntry, ...prev]);
    setEditEntry(null);
  }, [selectedDate]);

  const handleUpdateEntry = useCallback((data: { title: string; content?: string; category: Category }) => {
    if (!editEntry) return;

    const updated = updateEntry(editEntry.id, data);
    if (updated) {
      setEntries(prev => prev.map(e => (e.id === updated.id ? updated : e)));
    }
    setEditEntry(null);
  }, [editEntry]);

  const handleDeleteEntry = useCallback((id: string) => {
    const success = deleteEntry(id);
    if (success) {
      setEntries(prev => prev.filter(e => e.id !== id));
    }
  }, []);

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

  const handleDateSelect = useCallback((date: string) => {
    setSelectedDate(date);
    setIsSearchMode(false);
    setSearchFilters({ keyword: '', category: '' });
    setShowDetailPanel(true);
  }, []);

  const handleFormSubmit = editEntry ? handleUpdateEntry : handleAddEntry;

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
      <header className="bg-white border-b border-gray-200 sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div>
                <h1 className="text-xl font-bold text-gray-900">TIL Calendar</h1>
                <p className="text-sm text-gray-500">매일 배움 기록</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Stats entries={entries} />
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
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 pt-4">
        {/* 검색바 */}
        <div className="mb-4">
          <SearchBar onSearch={handleSearch} />
        </div>

        {/* 검색 모드 */}
        {isSearchMode ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">
              검색 결과
              <span className="text-sm font-normal text-gray-500 ml-2">
                {searchResults.length}개
              </span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {searchResults.length > 0 ? (
                searchResults.map((entry) => (
                  <div key={entry.id} className="animate-fade-in">
                    <TilCard
                      entry={entry}
                      onEdit={(e) => {
                        setEditEntry(e);
                        setSelectedDate(e.date);
                        setIsSearchMode(false);
                        setShowDetailPanel(true);
                      }}
                      onDelete={handleDeleteEntry}
                    />
                  </div>
                ))
              ) : (
                <div className="col-span-full text-center py-8 text-gray-500">
                  <p>검색 결과가 없습니다.</p>
                </div>
              )}
            </div>
          </div>
        ) : (
          /* 메인 레이아웃: 캘린더 + 상세 패널 */
          <div className="flex gap-4">
            {/* 캘린더 (확장 모드) */}
            <div className={`${showDetailPanel ? 'flex-1' : 'w-full'} transition-all duration-300`}>
              <Calendar
                entries={entries}
                selectedDate={selectedDate}
                onDateSelect={handleDateSelect}
                expanded={true}
              />
            </div>

            {/* 상세 패널 (사이드) */}
            {showDetailPanel && (
              <div className="w-full md:w-96 flex-shrink-0 space-y-4 animate-fade-in">
                {/* 닫기 버튼 */}
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-bold text-gray-900">
                    {formatDateDisplay(selectedDate)}
                  </h3>
                  <button
                    onClick={() => setShowDetailPanel(false)}
                    className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
                    aria-label="패널 닫기"
                  >
                    <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                {/* TIL 입력 폼 */}
                <TilForm
                  date={selectedDate}
                  editEntry={editEntry}
                  onSubmit={handleFormSubmit}
                  onCancel={editEntry ? () => setEditEntry(null) : undefined}
                />

                {/* 해당 날짜 기록 목록 */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-3">
                    {selectedDateEntries.length}개의 기록
                  </h4>
                  <div className="space-y-3 max-h-[400px] overflow-y-auto">
                    {selectedDateEntries.length > 0 ? (
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
                      <div className="text-center py-6 text-gray-500">
                        <svg
                          className="w-10 h-10 mx-auto mb-2 text-gray-300"
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
                        <p className="text-sm">기록이 없습니다</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* 푸터 */}
      <footer className="mt-8 text-center text-sm text-gray-400">
        <p>&quot;시간을 지배한 사나이&quot;에서 영감을 받은 프로젝트</p>
      </footer>
    </main>
  );
}
