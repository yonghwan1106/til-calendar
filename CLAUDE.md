# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # 개발 서버 실행 (http://localhost:3000)
npm run build    # 프로덕션 빌드
npm run lint     # ESLint 실행
npm run start    # 프로덕션 서버 실행
```

## Architecture

**TIL Calendar**는 "시간을 지배한 사나이"에서 영감을 받은 매일 배움 기록 앱입니다.

### Tech Stack
- Next.js 16 (App Router) + React 19 + TypeScript
- Tailwind CSS 4
- Supabase (PostgreSQL)
- Vercel 배포

### Data Flow

```
[app/page.tsx] ← 메인 상태 관리
      ↓
[lib/storage.ts] ← async CRUD 함수 (Supabase API 호출)
      ↓
[lib/supabase.ts] ← Supabase 클라이언트
      ↓
[Supabase DB: til_entries 테이블]
```

### Key Files

- `lib/types.ts` - Category 타입, TilEntry 인터페이스, CATEGORIES 매핑 (색상/라벨)
- `lib/storage.ts` - getAllEntries, addEntry, updateEntry, deleteEntry (모두 async)
- `lib/migration.ts` - localStorage → Supabase 마이그레이션 유틸리티
- `app/page.tsx` - 전체 앱 상태 관리 (entries, selectedDate, searchFilters 등)

### Database Schema

```sql
til_entries (
  id UUID PRIMARY KEY,
  date DATE NOT NULL,
  title TEXT NOT NULL,
  content TEXT,
  category TEXT CHECK (category IN ('ai', 'life', 'reading', 'hobby', 'work', 'finance', 'other')),
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ
)
```

### Environment Variables

```
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
```

## Korean Language

- UI 텍스트와 코드 주석은 한국어로 작성
- 카테고리: AI, 인생, 독서, 취미, 업무, 재테크, 기타
