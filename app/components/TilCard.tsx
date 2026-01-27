'use client';

import { TilEntry, CATEGORIES } from '@/lib/types';

interface TilCardProps {
  entry: TilEntry;
  onEdit: (entry: TilEntry) => void;
  onDelete: (id: string) => void;
}

export default function TilCard({ entry, onEdit, onDelete }: TilCardProps) {
  const categoryInfo = CATEGORIES[entry.category];

  const formatTime = (isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleTimeString('ko-KR', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleDelete = () => {
    if (confirm('이 기록을 삭제하시겠습니까?')) {
      onDelete(entry.id);
    }
  };

  return (
    <div className="group bg-[var(--card-bg)] border border-[var(--border)] p-4 transition-all duration-300 hover:border-[var(--border-dark)] hover:shadow-md relative overflow-hidden">
      {/* Left accent bar */}
      <div className={`absolute left-0 top-0 bottom-0 w-1 ${categoryInfo.dotColor} opacity-60 group-hover:opacity-100 transition-opacity`} />

      <div className="flex items-start justify-between gap-3 pl-3">
        <div className="flex-1 min-w-0">
          {/* 카테고리 태그 */}
          <span
            className={`inline-block px-2.5 py-1 rounded text-xs font-medium ${categoryInfo.tagClass} mb-3`}
          >
            {categoryInfo.label}
          </span>

          {/* 제목 */}
          <h4 className="font-display text-base text-[var(--ink)] mb-2 leading-relaxed">
            {entry.title}
          </h4>

          {/* 내용 */}
          {entry.content && (
            <p className="text-sm text-[var(--ink-light)] whitespace-pre-wrap mb-3 leading-relaxed">
              {entry.content}
            </p>
          )}

          {/* 시간 */}
          <p className="text-xs text-[var(--ink-muted)] font-display-light">
            {formatTime(entry.createdAt)}
            {entry.updatedAt !== entry.createdAt && (
              <span className="ml-2 italic">(수정됨)</span>
            )}
          </p>
        </div>

        {/* 액션 버튼 */}
        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => onEdit(entry)}
            className="p-2 text-[var(--ink-muted)] hover:text-[var(--navy)] hover:bg-[var(--parchment)] rounded transition-all"
            aria-label="수정"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
              />
            </svg>
          </button>
          <button
            onClick={handleDelete}
            className="p-2 text-[var(--ink-muted)] hover:text-[var(--burgundy)] hover:bg-[var(--parchment)] rounded transition-all"
            aria-label="삭제"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
