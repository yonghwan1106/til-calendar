'use client';

import { useState, useEffect } from 'react';
import { Category, CATEGORIES, TilEntry } from '@/lib/types';

interface TilFormProps {
  date: string;
  editEntry?: TilEntry | null;
  onSubmit: (data: { title: string; content?: string; category: Category }) => void;
  onCancel?: () => void;
}

export default function TilForm({ date, editEntry, onSubmit, onCancel }: TilFormProps) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState<Category>('ai');

  useEffect(() => {
    if (editEntry) {
      setTitle(editEntry.title);
      setContent(editEntry.content || '');
      setCategory(editEntry.category);
    } else {
      setTitle('');
      setContent('');
      setCategory('ai');
    }
  }, [editEntry]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    onSubmit({
      title: title.trim(),
      content: content.trim() || undefined,
      category,
    });

    // 폼 초기화
    setTitle('');
    setContent('');
    setCategory('ai');
  };

  const formatDateDisplay = (dateStr: string) => {
    const [year, month, day] = dateStr.split('-');
    return `${year}년 ${parseInt(month)}월 ${parseInt(day)}일`;
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-bold text-gray-900 mb-1">
        {editEntry ? 'TIL 수정' : '새 TIL 기록'}
      </h3>
      <p className="text-sm text-gray-500 mb-4">{formatDateDisplay(date)}</p>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* 제목 */}
        <div>
          <label
            htmlFor="title"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            오늘 배운 것 <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="한 줄로 요약해주세요"
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
            required
          />
        </div>

        {/* 카테고리 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            카테고리
          </label>
          <div className="flex flex-wrap gap-2">
            {(Object.keys(CATEGORIES) as Category[]).map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setCategory(cat)}
                className={`
                  px-3 py-1.5 rounded-full text-sm font-medium transition-all
                  ${
                    category === cat
                      ? `${CATEGORIES[cat].bgColor} ${CATEGORIES[cat].color} ring-2 ring-offset-1 ring-current`
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }
                `}
              >
                {CATEGORIES[cat].label}
              </button>
            ))}
          </div>
        </div>

        {/* 상세 내용 */}
        <div>
          <label
            htmlFor="content"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            상세 내용 <span className="text-gray-400">(선택)</span>
          </label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="더 자세한 내용을 기록해보세요"
            rows={4}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all resize-none"
          />
        </div>

        {/* 버튼 */}
        <div className="flex gap-2 pt-2">
          <button
            type="submit"
            className="flex-1 bg-blue-500 text-white py-2.5 px-4 rounded-lg font-medium hover:bg-blue-600 transition-colors"
          >
            {editEntry ? '수정하기' : '기록하기'}
          </button>
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2.5 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              취소
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
