'use client';

import { useState, useEffect } from 'react';
import { TilEntry, CATEGORIES } from '@/lib/types';
import {
  formatDate,
  getDaysInMonth,
  getFirstDayOfMonth,
  getMonthName,
  getDayNames,
  isToday,
  groupEntriesByDate,
} from '@/lib/utils';

interface CalendarProps {
  entries: TilEntry[];
  selectedDate: string;
  onDateSelect: (date: string) => void;
  expanded?: boolean;
}

export default function Calendar({
  entries,
  selectedDate,
  onDateSelect,
  expanded = false,
}: CalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [entriesByDate, setEntriesByDate] = useState<Record<string, TilEntry[]>>({});

  useEffect(() => {
    setEntriesByDate(groupEntriesByDate(entries));
  }, [entries]);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const daysInMonth = getDaysInMonth(year, month);
  const firstDayOfMonth = getFirstDayOfMonth(year, month);
  const dayNames = getDayNames();

  const goToPrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const goToToday = () => {
    const today = new Date();
    setCurrentDate(today);
    onDateSelect(formatDate(today));
  };

  const calendarDays: (number | null)[] = [];

  for (let i = 0; i < firstDayOfMonth; i++) {
    calendarDays.push(null);
  }

  for (let day = 1; day <= daysInMonth; day++) {
    calendarDays.push(day);
  }

  const getEntriesForDay = (day: number): TilEntry[] => {
    const dateStr = formatDate(new Date(year, month, day));
    return entriesByDate[dateStr] || [];
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 md:p-6">
      {/* 헤더 */}
      <div className="flex items-center justify-between mb-4 md:mb-6">
        <h2 className="text-xl md:text-2xl font-bold text-gray-900">
          {year}년 {getMonthName(month)}
        </h2>
        <div className="flex items-center gap-2">
          <button
            onClick={goToToday}
            className="px-3 py-1.5 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
          >
            오늘
          </button>
          <button
            onClick={goToPrevMonth}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="이전 달"
          >
            <svg
              className="w-5 h-5 text-gray-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
          <button
            onClick={goToNextMonth}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="다음 달"
          >
            <svg
              className="w-5 h-5 text-gray-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* 요일 헤더 */}
      <div className="grid grid-cols-7 mb-2 border-b border-gray-100 pb-2">
        {dayNames.map((day, index) => (
          <div
            key={day}
            className={`text-center text-sm font-medium py-2 ${
              index === 0 ? 'text-red-500' : index === 6 ? 'text-blue-500' : 'text-gray-500'
            }`}
          >
            {day}
          </div>
        ))}
      </div>

      {/* 날짜 그리드 - 확장 모드 */}
      {expanded ? (
        <div className="grid grid-cols-7 gap-1">
          {calendarDays.map((day, index) => {
            if (day === null) {
              return <div key={`empty-${index}`} className="min-h-[100px] md:min-h-[120px]" />;
            }

            const dateStr = formatDate(new Date(year, month, day));
            const dayEntries = getEntriesForDay(day);
            const isTodayDate = isToday(dateStr);
            const isSelected = selectedDate === dateStr;
            const dayOfWeek = (firstDayOfMonth + day - 1) % 7;
            const isSunday = dayOfWeek === 0;
            const isSaturday = dayOfWeek === 6;

            return (
              <button
                key={day}
                onClick={() => onDateSelect(dateStr)}
                className={`
                  min-h-[100px] md:min-h-[120px] p-1.5 md:p-2 flex flex-col items-start rounded-lg
                  transition-all duration-200 border text-left
                  ${isSelected
                    ? 'bg-blue-50 border-blue-500 shadow-sm'
                    : 'border-gray-100 hover:bg-gray-50 hover:border-gray-200'}
                  ${isTodayDate ? 'ring-2 ring-blue-500 ring-inset' : ''}
                `}
              >
                <span
                  className={`
                    text-sm font-semibold mb-1
                    ${isSunday ? 'text-red-500' : isSaturday ? 'text-blue-500' : 'text-gray-700'}
                  `}
                >
                  {day}
                </span>
                {/* TIL 제목 목록 */}
                <div className="w-full space-y-0.5 overflow-hidden flex-1">
                  {dayEntries.slice(0, 3).map((entry) => (
                    <div
                      key={entry.id}
                      className={`
                        text-[10px] md:text-xs px-1.5 py-0.5 rounded truncate
                        ${CATEGORIES[entry.category].bgColor} ${CATEGORIES[entry.category].color}
                      `}
                      title={entry.title}
                    >
                      {entry.title}
                    </div>
                  ))}
                  {dayEntries.length > 3 && (
                    <div className="text-[10px] text-gray-400 px-1">
                      +{dayEntries.length - 3}개 더
                    </div>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      ) : (
        /* 컴팩트 모드 (기존) */
        <div className="grid grid-cols-7 gap-1">
          {calendarDays.map((day, index) => {
            if (day === null) {
              return <div key={`empty-${index}`} className="aspect-square" />;
            }

            const dateStr = formatDate(new Date(year, month, day));
            const dayEntries = getEntriesForDay(day);
            const entryCount = dayEntries.length;
            const isTodayDate = isToday(dateStr);
            const isSelected = selectedDate === dateStr;
            const dayOfWeek = (firstDayOfMonth + day - 1) % 7;
            const isSunday = dayOfWeek === 0;
            const isSaturday = dayOfWeek === 6;

            return (
              <button
                key={day}
                onClick={() => onDateSelect(dateStr)}
                className={`
                  aspect-square flex flex-col items-center justify-center rounded-lg
                  transition-all duration-200 relative
                  ${isSelected ? 'bg-blue-500 text-white shadow-md' : 'hover:bg-gray-100'}
                  ${isTodayDate && !isSelected ? 'ring-2 ring-blue-500 ring-inset' : ''}
                `}
              >
                <span
                  className={`
                    text-sm font-medium
                    ${isSelected ? 'text-white' : isSunday ? 'text-red-500' : isSaturday ? 'text-blue-500' : 'text-gray-700'}
                  `}
                >
                  {day}
                </span>
                {entryCount > 0 && (
                  <div className="flex gap-0.5 mt-0.5">
                    {Array.from({ length: Math.min(entryCount, 3) }).map((_, i) => (
                      <div
                        key={i}
                        className={`w-1.5 h-1.5 rounded-full ${
                          isSelected ? 'bg-white' : 'bg-blue-500'
                        }`}
                      />
                    ))}
                    {entryCount > 3 && (
                      <span
                        className={`text-[10px] ${
                          isSelected ? 'text-white' : 'text-blue-500'
                        }`}
                      >
                        +
                      </span>
                    )}
                  </div>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
