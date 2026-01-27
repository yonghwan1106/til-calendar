'use client';

import { useState } from 'react';
import { Category, CATEGORIES } from '@/lib/types';

interface SearchBarProps {
  onSearch: (filters: {
    keyword: string;
    category: string;
  }) => void;
}

export default function SearchBar({ onSearch }: SearchBarProps) {
  const [keyword, setKeyword] = useState('');
  const [category, setCategory] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);

  const handleSearch = () => {
    onSearch({ keyword, category });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleClear = () => {
    setKeyword('');
    setCategory('');
    onSearch({ keyword: '', category: '' });
  };

  const hasFilters = keyword || category;

  return (
    <div className="journal-card rounded-lg p-4">
      {/* 검색 입력 */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--ink-muted)]"
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
          <input
            type="text"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="기록 검색..."
            className="w-full pl-10 pr-4 py-2.5 journal-input rounded text-sm text-[var(--ink)]"
          />
        </div>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className={`p-2.5 border rounded transition-all ${
            isExpanded || category
              ? 'border-[var(--gold)] text-[var(--gold)] bg-[var(--gold)]/5'
              : 'border-[var(--border)] text-[var(--ink-muted)] hover:bg-[var(--parchment)] hover:border-[var(--border-dark)]'
          }`}
          aria-label="필터"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
            />
          </svg>
        </button>
        <button
          onClick={handleSearch}
          className="btn-primary px-5 py-2.5 rounded font-medium text-sm"
        >
          검색
        </button>
      </div>

      {/* 필터 확장 영역 */}
      {isExpanded && (
        <div className="mt-4 pt-4 border-t border-[var(--border)]">
          <label className="block text-xs uppercase tracking-wider font-medium text-[var(--ink-muted)] mb-3">
            분류 필터
          </label>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setCategory('')}
              className={`px-3 py-1.5 rounded text-xs font-medium transition-all ${
                !category
                  ? 'bg-[var(--ink)] text-[var(--cream)]'
                  : 'bg-[var(--parchment)] text-[var(--ink-muted)] hover:bg-[var(--cream-dark)] hover:text-[var(--ink-light)]'
              }`}
            >
              전체
            </button>
            {(Object.keys(CATEGORIES) as Category[]).map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`px-3 py-1.5 rounded text-xs font-medium transition-all ${
                  category === cat
                    ? `${CATEGORIES[cat].tagClass} ring-2 ring-[var(--ink)] ring-offset-1 ring-offset-[var(--card-bg)]`
                    : 'bg-[var(--parchment)] text-[var(--ink-muted)] hover:bg-[var(--cream-dark)] hover:text-[var(--ink-light)]'
                }`}
              >
                {CATEGORIES[cat].label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* 필터 초기화 버튼 */}
      {hasFilters && (
        <button
          onClick={handleClear}
          className="mt-3 text-xs text-[var(--ink-muted)] hover:text-[var(--burgundy)] flex items-center gap-1.5 transition-colors"
        >
          <svg
            className="w-3 h-3"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
          필터 초기화
        </button>
      )}
    </div>
  );
}
