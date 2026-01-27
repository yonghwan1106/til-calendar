'use client';

import { TilEntry, Category, CATEGORIES } from '@/lib/types';
import {
  calculateStreak,
  getThisMonthCount,
  getCategoryDistribution,
} from '@/lib/utils';

interface StatsProps {
  entries: TilEntry[];
}

export default function Stats({ entries }: StatsProps) {
  const streak = calculateStreak(entries);
  const thisMonthCount = getThisMonthCount(entries);
  const totalCount = entries.length;
  const distribution = getCategoryDistribution(entries);

  // 카테고리 분포를 정렬 (많은 순)
  const sortedDistribution = Object.entries(distribution)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5);

  const maxCount = Math.max(...Object.values(distribution), 1);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-bold text-gray-900 mb-4">학습 통계</h3>

      {/* 주요 통계 */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="text-center p-3 bg-blue-50 rounded-lg">
          <p className="text-2xl font-bold text-blue-600">{streak}</p>
          <p className="text-xs text-gray-600 mt-1">연속 기록</p>
        </div>
        <div className="text-center p-3 bg-green-50 rounded-lg">
          <p className="text-2xl font-bold text-green-600">{thisMonthCount}</p>
          <p className="text-xs text-gray-600 mt-1">이번 달</p>
        </div>
        <div className="text-center p-3 bg-purple-50 rounded-lg">
          <p className="text-2xl font-bold text-purple-600">{totalCount}</p>
          <p className="text-xs text-gray-600 mt-1">전체 기록</p>
        </div>
      </div>

      {/* 카테고리 분포 */}
      {sortedDistribution.length > 0 && (
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-3">
            카테고리 분포
          </h4>
          <div className="space-y-2">
            {sortedDistribution.map(([cat, count]) => {
              const categoryInfo = CATEGORIES[cat as Category];
              const percentage = (count / maxCount) * 100;

              return (
                <div key={cat} className="flex items-center gap-2">
                  <span
                    className={`text-xs font-medium w-12 ${categoryInfo.color}`}
                  >
                    {categoryInfo.label}
                  </span>
                  <div className="flex-1 h-4 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${categoryInfo.bgColor} transition-all duration-500`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <span className="text-xs text-gray-500 w-8 text-right">
                    {count}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 빈 상태 */}
      {entries.length === 0 && (
        <div className="text-center py-4 text-gray-500">
          <p className="text-sm">아직 기록이 없습니다.</p>
          <p className="text-xs mt-1">오늘 배운 것을 기록해보세요!</p>
        </div>
      )}
    </div>
  );
}
