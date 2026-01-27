// TIL 카테고리 타입
export type Category =
  | 'coding'    // 코딩
  | 'life'      // 인생
  | 'language'  // 언어
  | 'reading'   // 독서
  | 'hobby'     // 취미
  | 'work'      // 업무
  | 'finance'   // 재테크
  | 'other';    // 기타

// TIL 기록 항목
export interface TilEntry {
  id: string;
  date: string;           // YYYY-MM-DD
  title: string;          // 배운 것 한 줄
  content?: string;       // 상세 내용 (선택)
  category: Category;     // 카테고리
  createdAt: string;      // ISO timestamp
  updatedAt: string;      // ISO timestamp
}

// localStorage 저장 구조
export interface TilStorage {
  entries: TilEntry[];
  lastUpdated: string;
}

// 카테고리 정보 (라벨, 색상)
export interface CategoryInfo {
  label: string;
  color: string;
  bgColor: string;
}

// 카테고리 매핑
export const CATEGORIES: Record<Category, CategoryInfo> = {
  coding: {
    label: '코딩',
    color: 'text-blue-600',
    bgColor: 'bg-blue-100',
  },
  life: {
    label: '인생',
    color: 'text-purple-600',
    bgColor: 'bg-purple-100',
  },
  language: {
    label: '언어',
    color: 'text-green-600',
    bgColor: 'bg-green-100',
  },
  reading: {
    label: '독서',
    color: 'text-amber-600',
    bgColor: 'bg-amber-100',
  },
  hobby: {
    label: '취미',
    color: 'text-pink-600',
    bgColor: 'bg-pink-100',
  },
  work: {
    label: '업무',
    color: 'text-slate-600',
    bgColor: 'bg-slate-100',
  },
  finance: {
    label: '재테크',
    color: 'text-emerald-600',
    bgColor: 'bg-emerald-100',
  },
  other: {
    label: '기타',
    color: 'text-gray-600',
    bgColor: 'bg-gray-100',
  },
};
