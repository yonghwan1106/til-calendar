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
import { hasLocalStorageData, migrateToSupabase, clearLocalStorage, getLocalStorageData } from '@/lib/migration';

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
  const [showMigrationBanner, setShowMigrationBanner] = useState(false);
  const [isMigrating, setIsMigrating] = useState(false);
  const [localDataCount, setLocalDataCount] = useState(0);

  // 모든 엔트리 로드 + localStorage 데이터 확인
  useEffect(() => {
    const loadEntries = async () => {
      const loadedEntries = await getAllEntries();
      setEntries(loadedEntries);
      setIsLoading(false);

      // localStorage에 데이터가 있는지 확인
      if (hasLocalStorageData()) {
        const localData = getLocalStorageData();
        setLocalDataCount(localData.length);
        setShowMigrationBanner(true);
      }
    };
    loadEntries();
  }, []);

  // 마이그레이션 핸들러
  const handleMigration = async () => {
    setIsMigrating(true);
    const result = await migrateToSupabase();

    if (result.success > 0) {
      // 마이그레이션 성공 시 데이터 새로고침
      const loadedEntries = await getAllEntries();
      setEntries(loadedEntries);
      clearLocalStorage();
      alert(`${result.success}개의 기록을 성공적으로 마이그레이션했습니다!`);
    }

    if (result.failed > 0) {
      alert(`${result.failed}개의 기록 마이그레이션에 실패했습니다.`);
    }

    setShowMigrationBanner(false);
    setIsMigrating(false);
  };

  // 선택된 날짜의 엔트리 로드
  useEffect(() => {
    const loadDateEntries = async () => {
      if (!isSearchMode) {
        const dateEntries = await getEntriesByDate(selectedDate);
        setSelectedDateEntries(dateEntries);
      }
    };
    loadDateEntries();
  }, [selectedDate, entries, isSearchMode]);

  const handleAddEntry = useCallback(async (data: { title: string; content?: string; category: Category }) => {
    const newEntry = await addEntry({
      ...data,
      date: selectedDate,
    });
    if (newEntry) {
      setEntries(prev => [newEntry, ...prev]);
    }
    setEditEntry(null);
  }, [selectedDate]);

  const handleUpdateEntry = useCallback(async (data: { title: string; content?: string; category: Category }) => {
    if (!editEntry) return;

    const updated = await updateEntry(editEntry.id, data);
    if (updated) {
      setEntries(prev => prev.map(e => (e.id === updated.id ? updated : e)));
    }
    setEditEntry(null);
  }, [editEntry]);

  const handleDeleteEntry = useCallback(async (id: string) => {
    const success = await deleteEntry(id);
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
      <div className="min-h-screen flex items-center justify-center bg-[var(--cream)]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-2 border-[var(--ink-muted)] border-t-[var(--burgundy)] rounded-full animate-spin"></div>
          <p className="text-sm text-[var(--ink-muted)] font-display tracking-wider">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen pb-8 bg-[var(--cream)]">
      {/* 헤더 */}
      <header className="bg-[var(--card-bg)] border-b border-[var(--border)] sticky top-0 z-20 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[var(--gold)] text-lg">&#9830;</span>
                  <h1 className="font-display text-xl text-[var(--ink)]">Scholar&apos;s Journal</h1>
                </div>
                <p className="text-xs uppercase tracking-[0.15em] text-[var(--ink-muted)] mt-0.5">Daily Learning Record</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Stats entries={entries} />
              <div className="w-px h-8 bg-[var(--border)]" />
              <a
                href="https://github.com/yonghwan1106/til-calendar"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[var(--ink-muted)] hover:text-[var(--ink)] transition-colors"
                aria-label="GitHub"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
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

      {/* 마이그레이션 배너 */}
      {showMigrationBanner && (
        <div className="bg-gradient-to-r from-[var(--gold)]/10 via-[var(--gold)]/5 to-[var(--gold)]/10 border-b border-[var(--gold)]/30">
          <div className="max-w-7xl mx-auto px-4 py-3">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <span className="text-[var(--gold)]">&#9670;</span>
                <p className="text-sm text-[var(--ink)]">
                  브라우저에 저장된 <strong className="text-[var(--burgundy)]">{localDataCount}개</strong>의 기존 기록이 있습니다. 클라우드로 마이그레이션하시겠습니까?
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleMigration}
                  disabled={isMigrating}
                  className="px-4 py-1.5 bg-[var(--gold)] text-white text-sm font-medium rounded hover:bg-[var(--gold-dark)] disabled:opacity-50 transition-colors"
                >
                  {isMigrating ? '마이그레이션 중...' : '마이그레이션'}
                </button>
                <button
                  onClick={() => setShowMigrationBanner(false)}
                  className="p-1.5 text-[var(--ink-muted)] hover:text-[var(--ink)] hover:bg-[var(--parchment)] rounded transition-colors"
                  aria-label="닫기"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 pt-4">
        {/* 검색바 */}
        <div className="mb-4">
          <SearchBar onSearch={handleSearch} />
        </div>

        {/* 검색 모드 */}
        {isSearchMode ? (
          <div className="journal-card rounded-lg p-6 paper-texture">
            <div className="flex items-center gap-3 mb-6">
              <span className="text-[var(--gold)]">&#9830;</span>
              <h3 className="font-display text-xl text-[var(--ink)]">
                검색 결과
              </h3>
              <span className="text-sm text-[var(--ink-muted)] font-display-light">
                {searchResults.length}개의 기록
              </span>
            </div>
            <div className="h-px bg-gradient-to-r from-[var(--border-dark)] via-[var(--border)] to-transparent mb-6" />
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
                <div className="col-span-full text-center py-12">
                  <span className="text-4xl text-[var(--ink-muted)] opacity-30">&#9998;</span>
                  <p className="text-[var(--ink-muted)] mt-3 font-display-light">검색 결과가 없습니다.</p>
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
                {/* 헤더 */}
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-xs uppercase tracking-[0.15em] text-[var(--ink-muted)] mb-0.5">Selected Date</p>
                    <h3 className="font-display text-lg text-[var(--ink)]">
                      {formatDateDisplay(selectedDate)}
                    </h3>
                  </div>
                  <button
                    onClick={() => setShowDetailPanel(false)}
                    className="p-2 text-[var(--ink-muted)] hover:text-[var(--ink)] hover:bg-[var(--parchment)] rounded transition-colors"
                    aria-label="패널 닫기"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
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
                <div className="journal-card rounded-lg p-5">
                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-[var(--gold)] text-sm">&#9998;</span>
                    <h4 className="text-sm font-medium text-[var(--ink-light)]">
                      {selectedDateEntries.length}개의 기록
                    </h4>
                  </div>
                  <div className="space-y-3 max-h-[400px] overflow-y-auto custom-scrollbar pr-1">
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
                      <div className="text-center py-8">
                        <span className="text-5xl text-[var(--ink-muted)] opacity-20">&#128214;</span>
                        <p className="text-sm text-[var(--ink-muted)] mt-3 font-display-light italic">
                          아직 기록이 없습니다
                        </p>
                        <p className="text-xs text-[var(--ink-muted)] mt-1 opacity-60">
                          오늘 배운 것을 기록해보세요
                        </p>
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
      <footer className="mt-12 pb-4">
        <div className="max-w-7xl mx-auto px-4">
          <div className="h-px bg-gradient-to-r from-transparent via-[var(--border)] to-transparent mb-6" />
          <div className="text-center">
            <p className="text-xs text-[var(--ink-muted)] tracking-wider">
              <span className="italic">&quot;시간을 지배한 사나이&quot;</span>에서 영감을 받은 프로젝트
            </p>
            <div className="flex items-center justify-center gap-2 mt-3 text-[var(--ink-muted)] opacity-50">
              <span className="ornament text-sm">&#10087;</span>
              <span className="text-[10px] uppercase tracking-[0.2em]">Est. 2026</span>
              <span className="ornament text-sm">&#10087;</span>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
