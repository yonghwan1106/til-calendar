'use client';

import { TilEntry } from '@/lib/types';
import {
  calculateStreak,
  getThisMonthCount,
} from '@/lib/utils';

interface StatsProps {
  entries: TilEntry[];
}

export default function Stats({ entries }: StatsProps) {
  const streak = calculateStreak(entries);
  const thisMonthCount = getThisMonthCount(entries);
  const totalCount = entries.length;

  return (
    <div className="flex items-center gap-2 text-sm">
      <div className="flex items-center gap-1 px-2 py-1 bg-blue-50 rounded-lg">
        <span className="text-blue-600 font-bold">{streak}</span>
        <span className="text-blue-500 text-xs hidden sm:inline">연속</span>
        <span className="text-blue-400">🔥</span>
      </div>
      <div className="flex items-center gap-1 px-2 py-1 bg-green-50 rounded-lg">
        <span className="text-green-600 font-bold">{thisMonthCount}</span>
        <span className="text-green-500 text-xs hidden sm:inline">이번달</span>
      </div>
      <div className="flex items-center gap-1 px-2 py-1 bg-purple-50 rounded-lg">
        <span className="text-purple-600 font-bold">{totalCount}</span>
        <span className="text-purple-500 text-xs hidden sm:inline">전체</span>
      </div>
    </div>
  );
}
