import { TilEntry } from './types';

// UUID 생성
export function generateId(): string {
  return crypto.randomUUID();
}

// 날짜 포맷팅 (YYYY-MM-DD)
export function formatDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// 날짜 문자열을 Date 객체로 변환
export function parseDate(dateStr: string): Date {
  const [year, month, day] = dateStr.split('-').map(Number);
  return new Date(year, month - 1, day);
}

// 해당 월의 일수 반환
export function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
}

// 해당 월의 첫째 날 요일 반환 (0: 일요일)
export function getFirstDayOfMonth(year: number, month: number): number {
  return new Date(year, month, 1).getDay();
}

// 월 이름 반환 (한국어)
export function getMonthName(month: number): string {
  const months = [
    '1월', '2월', '3월', '4월', '5월', '6월',
    '7월', '8월', '9월', '10월', '11월', '12월'
  ];
  return months[month];
}

// 요일 이름 반환 (한국어, 짧은 형태)
export function getDayNames(): string[] {
  return ['일', '월', '화', '수', '목', '금', '토'];
}

// 오늘 날짜인지 확인
export function isToday(dateStr: string): boolean {
  return dateStr === formatDate(new Date());
}

// 연속 기록 일수 계산
export function calculateStreak(entries: TilEntry[]): number {
  if (entries.length === 0) return 0;

  // 날짜별로 그룹화
  const dateSet = new Set(entries.map(e => e.date));

  // 오늘부터 역순으로 연속 일수 계산
  const today = new Date();
  let streak = 0;
  let currentDate = new Date(today);

  while (true) {
    const dateStr = formatDate(currentDate);
    if (dateSet.has(dateStr)) {
      streak++;
      currentDate.setDate(currentDate.getDate() - 1);
    } else {
      // 오늘 기록이 없어도 어제까지 연속이면 유지
      if (streak === 0) {
        currentDate.setDate(currentDate.getDate() - 1);
        const yesterdayStr = formatDate(currentDate);
        if (dateSet.has(yesterdayStr)) {
          continue;
        }
      }
      break;
    }
  }

  return streak;
}

// 이번 달 기록 수 계산
export function getThisMonthCount(entries: TilEntry[]): number {
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();

  return entries.filter(entry => {
    const entryDate = parseDate(entry.date);
    return entryDate.getFullYear() === year && entryDate.getMonth() === month;
  }).length;
}

// 카테고리별 분포 계산
export function getCategoryDistribution(entries: TilEntry[]): Record<string, number> {
  const distribution: Record<string, number> = {};

  entries.forEach(entry => {
    distribution[entry.category] = (distribution[entry.category] || 0) + 1;
  });

  return distribution;
}

// 검색 필터링
export function filterEntries(
  entries: TilEntry[],
  options: {
    keyword?: string;
    category?: string;
    startDate?: string;
    endDate?: string;
  }
): TilEntry[] {
  return entries.filter(entry => {
    // 키워드 검색
    if (options.keyword) {
      const keyword = options.keyword.toLowerCase();
      const matchTitle = entry.title.toLowerCase().includes(keyword);
      const matchContent = entry.content?.toLowerCase().includes(keyword);
      if (!matchTitle && !matchContent) return false;
    }

    // 카테고리 필터
    if (options.category && entry.category !== options.category) {
      return false;
    }

    // 날짜 범위 필터
    if (options.startDate && entry.date < options.startDate) {
      return false;
    }
    if (options.endDate && entry.date > options.endDate) {
      return false;
    }

    return true;
  });
}

// 날짜별로 엔트리 그룹화
export function groupEntriesByDate(entries: TilEntry[]): Record<string, TilEntry[]> {
  const grouped: Record<string, TilEntry[]> = {};

  entries.forEach(entry => {
    if (!grouped[entry.date]) {
      grouped[entry.date] = [];
    }
    grouped[entry.date].push(entry);
  });

  return grouped;
}
