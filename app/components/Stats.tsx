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
    <div className="flex items-center gap-3 text-sm">
      <div className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-[var(--burgundy)]/10 to-[var(--burgundy)]/5 border border-[var(--burgundy)]/20 rounded">
        <span className="font-display text-[var(--burgundy)]">{streak}</span>
        <span className="text-[var(--burgundy)]/70 text-xs hidden sm:inline">연속</span>
        <span className="text-[var(--gold)]">◆</span>
      </div>
      <div className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-[var(--sage)]/10 to-[var(--sage)]/5 border border-[var(--sage)]/20 rounded">
        <span className="font-display text-[var(--sage)]">{thisMonthCount}</span>
        <span className="text-[var(--sage)]/70 text-xs hidden sm:inline">이번달</span>
      </div>
      <div className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-[var(--navy)]/10 to-[var(--navy)]/5 border border-[var(--navy)]/20 rounded">
        <span className="font-display text-[var(--navy)]">{totalCount}</span>
        <span className="text-[var(--navy)]/70 text-xs hidden sm:inline">전체</span>
      </div>
    </div>
  );
}
