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
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
      {/* 검색 입력 */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <input
            type="text"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="TIL 검색..."
            className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-sm"
          />
        </div>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className={`p-2 border rounded-lg transition-colors ${
            isExpanded || category
              ? 'border-blue-500 text-blue-500 bg-blue-50'
              : 'border-gray-300 text-gray-600 hover:bg-gray-50'
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
              strokeWidth={2}
              d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
            />
          </svg>
        </button>
        <button
          onClick={handleSearch}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition-colors text-sm"
        >
          검색
        </button>
      </div>

      {/* 필터 확장 영역 */}
      {isExpanded && (
        <div className="mt-3 pt-3 border-t border-gray-100">
          <label className="block text-xs font-medium text-gray-600 mb-2">
            카테고리 필터
          </label>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setCategory('')}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                !category
                  ? 'bg-gray-800 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              전체
            </button>
            {(Object.keys(CATEGORIES) as Category[]).map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                  category === cat
                    ? `${CATEGORIES[cat].bgColor} ${CATEGORIES[cat].color} ring-2 ring-offset-1 ring-current`
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
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
          className="mt-2 text-xs text-gray-500 hover:text-gray-700 flex items-center gap-1"
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
