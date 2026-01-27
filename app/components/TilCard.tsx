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
    <div className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          {/* 카테고리 태그 */}
          <span
            className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${categoryInfo.bgColor} ${categoryInfo.color} mb-2`}
          >
            {categoryInfo.label}
          </span>

          {/* 제목 */}
          <h4 className="text-base font-semibold text-gray-900 mb-1">
            {entry.title}
          </h4>

          {/* 내용 */}
          {entry.content && (
            <p className="text-sm text-gray-600 whitespace-pre-wrap mb-2">
              {entry.content}
            </p>
          )}

          {/* 시간 */}
          <p className="text-xs text-gray-400">
            {formatTime(entry.createdAt)}
            {entry.updatedAt !== entry.createdAt && ' (수정됨)'}
          </p>
        </div>

        {/* 액션 버튼 */}
        <div className="flex gap-1">
          <button
            onClick={() => onEdit(entry)}
            className="p-1.5 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded transition-colors"
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
                strokeWidth={2}
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
              />
            </svg>
          </button>
          <button
            onClick={handleDelete}
            className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded transition-colors"
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
                strokeWidth={2}
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
