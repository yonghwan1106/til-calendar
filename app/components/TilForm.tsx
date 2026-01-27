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
    const dateObj = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
    const weekday = ['일', '월', '화', '수', '목', '금', '토'][dateObj.getDay()];
    return `${parseInt(month)}월 ${parseInt(day)}일 ${weekday}요일`;
  };

  return (
    <div className="journal-card rounded-lg p-6 paper-texture">
      {/* Header */}
      <div className="mb-6">
        <p className="text-xs uppercase tracking-[0.15em] text-[var(--ink-muted)] mb-1">
          {editEntry ? '기록 수정' : '새 기록'}
        </p>
        <h3 className="font-display text-xl text-[var(--ink)]">
          {formatDateDisplay(date)}
        </h3>
      </div>

      <div className="h-px bg-gradient-to-r from-[var(--border-dark)] via-[var(--border)] to-transparent mb-6" />

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* 제목 */}
        <div>
          <label
            htmlFor="title"
            className="block text-sm font-medium text-[var(--ink-light)] mb-2"
          >
            오늘 배운 것 <span className="text-[var(--burgundy)]">*</span>
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="한 줄로 요약해주세요..."
            className="w-full px-4 py-3 journal-input rounded text-[var(--ink)] placeholder:text-[var(--ink-muted)] placeholder:italic"
            required
          />
        </div>

        {/* 카테고리 */}
        <div>
          <label className="block text-sm font-medium text-[var(--ink-light)] mb-3">
            분류
          </label>
          <div className="flex flex-wrap gap-2">
            {(Object.keys(CATEGORIES) as Category[]).map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setCategory(cat)}
                className={`
                  px-3 py-1.5 rounded text-sm font-medium transition-all duration-200
                  ${
                    category === cat
                      ? `${CATEGORIES[cat].tagClass} ring-2 ring-[var(--ink)] ring-offset-2 ring-offset-[var(--card-bg)]`
                      : 'bg-[var(--parchment)] text-[var(--ink-muted)] hover:bg-[var(--cream-dark)] hover:text-[var(--ink-light)]'
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
            className="block text-sm font-medium text-[var(--ink-light)] mb-2"
          >
            상세 내용 <span className="text-[var(--ink-muted)] font-normal">(선택)</span>
          </label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="더 자세한 내용을 기록해보세요..."
            rows={4}
            className="w-full px-4 py-3 journal-input rounded text-[var(--ink)] placeholder:text-[var(--ink-muted)] placeholder:italic resize-none"
          />
        </div>

        {/* 버튼 */}
        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            className="flex-1 btn-primary py-3 px-6 rounded font-medium"
          >
            {editEntry ? '수정하기' : '기록하기'}
          </button>
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="btn-secondary py-3 px-6 rounded font-medium"
            >
              취소
            </button>
          )}
        </div>
      </form>

      {/* Decorative corner */}
      <div className="absolute top-0 right-0 w-12 h-12 overflow-hidden pointer-events-none opacity-20">
        <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-[var(--gold)] to-transparent transform rotate-45 translate-x-8 -translate-y-8" />
      </div>
    </div>
  );
}
