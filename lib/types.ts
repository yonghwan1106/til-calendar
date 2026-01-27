// TIL 카테고리 타입
export type Category =
  | 'ai'        // AI/인공지능
  | 'life'      // 인생
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
  tagClass: string;
  dotColor: string;
}

// 카테고리 매핑 - Journal Style
export const CATEGORIES: Record<Category, CategoryInfo> = {
  ai: {
    label: 'AI',
    tagClass: 'tag-ai',
    dotColor: 'bg-[#1E3A5F]',
  },
  life: {
    label: '인생',
    tagClass: 'tag-life',
    dotColor: 'bg-[#5D3A6B]',
  },
  reading: {
    label: '독서',
    tagClass: 'tag-reading',
    dotColor: 'bg-[#8B6914]',
  },
  hobby: {
    label: '취미',
    tagClass: 'tag-hobby',
    dotColor: 'bg-[#8B3A5D]',
  },
  work: {
    label: '업무',
    tagClass: 'tag-work',
    dotColor: 'bg-[#44403C]',
  },
  finance: {
    label: '재테크',
    tagClass: 'tag-finance',
    dotColor: 'bg-[#2D5A3D]',
  },
  other: {
    label: '기타',
    tagClass: 'tag-other',
    dotColor: 'bg-[#78716C]',
  },
};
