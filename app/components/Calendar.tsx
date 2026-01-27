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
    <div className="journal-card rounded-none md:rounded-lg p-4 md:p-8 paper-texture">
      {/* 헤더 - Elegant Style */}
      <div className="flex items-center justify-between mb-6 md:mb-8">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-[var(--ink-muted)] mb-1">
            {year}
          </p>
          <h2 className="font-display text-2xl md:text-3xl text-[var(--ink)]">
            {getMonthName(month)}
          </h2>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={goToToday}
            className="px-4 py-2 text-sm font-medium text-[var(--burgundy)] hover:bg-[var(--parchment)] rounded transition-colors ink-underline"
          >
            오늘
          </button>
          <div className="w-px h-6 bg-[var(--border)] mx-2" />
          <button
            onClick={goToPrevMonth}
            className="p-2 hover:bg-[var(--parchment)] rounded transition-colors group"
            aria-label="이전 달"
          >
            <svg
              className="w-5 h-5 text-[var(--ink-muted)] group-hover:text-[var(--ink)] transition-colors"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
          <button
            onClick={goToNextMonth}
            className="p-2 hover:bg-[var(--parchment)] rounded transition-colors group"
            aria-label="다음 달"
          >
            <svg
              className="w-5 h-5 text-[var(--ink-muted)] group-hover:text-[var(--ink)] transition-colors"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* 요일 헤더 */}
      <div className="grid grid-cols-7 mb-3">
        {dayNames.map((day, index) => (
          <div
            key={day}
            className={`text-center text-xs uppercase tracking-wider py-3 font-medium ${
              index === 0 ? 'text-[var(--burgundy)]' : index === 6 ? 'text-[var(--navy)]' : 'text-[var(--ink-muted)]'
            }`}
          >
            {day}
          </div>
        ))}
      </div>

      {/* Decorative Divider */}
      <div className="h-px bg-gradient-to-r from-transparent via-[var(--border-dark)] to-transparent mb-3" />

      {/* 날짜 그리드 - 확장 모드 */}
      {expanded ? (
        <div className="grid grid-cols-7 gap-px bg-[var(--border)]">
          {calendarDays.map((day, index) => {
            if (day === null) {
              return <div key={`empty-${index}`} className="min-h-[110px] md:min-h-[130px] bg-[var(--cream)]" />;
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
                  min-h-[110px] md:min-h-[130px] p-2 md:p-3 flex flex-col items-start
                  transition-all duration-300 text-left group
                  ${isSelected
                    ? 'bg-[var(--ink)] text-[var(--cream)]'
                    : 'bg-[var(--card-bg)] hover:bg-[var(--cream-dark)]'}
                  ${isTodayDate && !isSelected ? 'ring-2 ring-inset ring-[var(--burgundy)]' : ''}
                `}
              >
                <span
                  className={`
                    text-sm font-display mb-2
                    ${isSelected
                      ? 'text-[var(--cream)]'
                      : isSunday
                        ? 'text-[var(--burgundy)]'
                        : isSaturday
                          ? 'text-[var(--navy)]'
                          : 'text-[var(--ink)]'}
                  `}
                >
                  {day}
                </span>
                {/* TIL 제목 목록 */}
                <div className="w-full space-y-1 overflow-hidden flex-1">
                  {dayEntries.slice(0, 3).map((entry, idx) => (
                    <div
                      key={entry.id}
                      className={`
                        text-[10px] md:text-xs px-2 py-1 rounded truncate
                        transition-all duration-200
                        ${isSelected
                          ? 'bg-white/20 text-[var(--cream)]'
                          : `${CATEGORIES[entry.category].tagClass}`}
                      `}
                      style={{ animationDelay: `${idx * 50}ms` }}
                      title={entry.title}
                    >
                      {entry.title}
                    </div>
                  ))}
                  {dayEntries.length > 3 && (
                    <div className={`text-[10px] px-2 ${isSelected ? 'text-white/60' : 'text-[var(--ink-muted)]'}`}>
                      +{dayEntries.length - 3}개 더
                    </div>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      ) : (
        /* 컴팩트 모드 */
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
                  aspect-square flex flex-col items-center justify-center rounded
                  calendar-day relative
                  ${isSelected ? 'selected' : ''}
                  ${isTodayDate && !isSelected ? 'today' : ''}
                `}
              >
                <span
                  className={`
                    text-sm font-medium
                    ${isSelected
                      ? 'text-[var(--cream)]'
                      : isSunday
                        ? 'text-[var(--burgundy)]'
                        : isSaturday
                          ? 'text-[var(--navy)]'
                          : 'text-[var(--ink)]'}
                  `}
                >
                  {day}
                </span>
                {entryCount > 0 && (
                  <div className="flex gap-0.5 mt-1">
                    {dayEntries.slice(0, 3).map((entry, i) => (
                      <div
                        key={i}
                        className={`w-1.5 h-1.5 rounded-full ${
                          isSelected ? 'bg-[var(--cream)]' : CATEGORIES[entry.category].dotColor
                        }`}
                      />
                    ))}
                    {entryCount > 3 && (
                      <span
                        className={`text-[10px] leading-none ${
                          isSelected ? 'text-[var(--cream)]' : 'text-[var(--ink-muted)]'
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

      {/* Footer Ornament */}
      <div className="mt-6 flex items-center justify-center gap-3 text-[var(--ink-muted)]">
        <span className="ornament">❧</span>
        <span className="text-xs tracking-widest uppercase">Scholar&apos;s Journal</span>
        <span className="ornament">❧</span>
      </div>
    </div>
  );
}
