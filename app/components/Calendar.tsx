'use client';

import { useState, useEffect } from 'react';
import { TilEntry } from '@/lib/types';
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
}

export default function Calendar({
  entries,
  selectedDate,
  onDateSelect,
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

  // 이전 달로 이동
  const goToPrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  // 다음 달로 이동
  const goToNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  // 오늘로 이동
  const goToToday = () => {
    const today = new Date();
    setCurrentDate(today);
    onDateSelect(formatDate(today));
  };

  // 캘린더 그리드 생성
  const calendarDays: (number | null)[] = [];

  // 첫 주의 빈 칸 채우기
  for (let i = 0; i < firstDayOfMonth; i++) {
    calendarDays.push(null);
  }

  // 날짜 채우기
  for (let day = 1; day <= daysInMonth; day++) {
    calendarDays.push(day);
  }

  // 해당 날짜의 기록 개수 가져오기
  const getEntryCount = (day: number): number => {
    const dateStr = formatDate(new Date(year, month, day));
    return entriesByDate[dateStr]?.length || 0;
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      {/* 헤더 */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900">
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
      <div className="grid grid-cols-7 mb-2">
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

      {/* 날짜 그리드 */}
      <div className="grid grid-cols-7 gap-1">
        {calendarDays.map((day, index) => {
          if (day === null) {
            return <div key={`empty-${index}`} className="aspect-square" />;
          }

          const dateStr = formatDate(new Date(year, month, day));
          const entryCount = getEntryCount(day);
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
              {/* 기록 인디케이터 */}
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
    </div>
  );
}
