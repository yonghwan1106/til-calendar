# TIL Calendar - 매일 배움 기록 캘린더

> "시간을 지배한 사나이" (아놀드 베넷/정신세계사)에서 영감을 받은 프로젝트

매일 배운 것을 기록하고 시각화하는 캘린더 웹앱입니다.

## 라이브 데모

https://til-calendar.vercel.app/

## 주요 기능

### 캘린더 뷰
- 월별 캘린더 표시
- 기록이 있는 날짜에 dot indicator 표시
- 날짜 클릭으로 해당 날짜 기록 보기/편집

### TIL 기록
- 제목 (배운 것 한 줄 요약)
- 내용 (상세 설명, 선택사항)
- 카테고리 태그: 코딩, 인생, 언어, 독서, 취미, 업무, 기타
- 하루에 여러 개 기록 가능

### 통계 대시보드
- 연속 기록 일수 (streak)
- 이번 달 학습 기록 수
- 전체 기록 수
- 카테고리별 분포 차트

### 검색 & 필터
- 키워드 검색
- 카테고리별 필터링

## 기술 스택

- **Framework**: Next.js 16 (App Router)
- **Styling**: Tailwind CSS
- **Language**: TypeScript
- **Storage**: localStorage (브라우저 로컬 저장)
- **Font**: Pretendard
- **Deployment**: Vercel

## 데이터 저장 방식

이 앱은 **localStorage**를 사용하여 데이터를 저장합니다:

| 특징 | 설명 |
|------|------|
| 저장 위치 | 사용자의 브라우저 |
| 데이터 유지 | 같은 브라우저에서 접속 시 유지 |
| 데이터 삭제 | 브라우저 캐시/데이터 삭제 시 사라짐 |
| 동기화 | 다른 기기/브라우저 간 동기화 안됨 |

## 로컬 개발

```bash
# 의존성 설치
npm install

# 개발 서버 실행
npm run dev

# 빌드
npm run build
```

## 프로젝트 구조

```
til-calendar/
├── app/
│   ├── layout.tsx          # 루트 레이아웃
│   ├── page.tsx            # 메인 페이지
│   ├── globals.css         # 글로벌 스타일
│   └── components/
│       ├── Calendar.tsx    # 캘린더 컴포넌트
│       ├── TilForm.tsx     # TIL 입력 폼
│       ├── TilCard.tsx     # TIL 카드 표시
│       ├── Stats.tsx       # 통계 대시보드
│       └── SearchBar.tsx   # 검색 바
├── lib/
│   ├── storage.ts          # localStorage 유틸리티
│   ├── types.ts            # TypeScript 타입 정의
│   └── utils.ts            # 유틸리티 함수
```

## 스크린샷

![TIL Calendar Screenshot](https://til-calendar.vercel.app/og-image.png)

## 라이선스

MIT

---

🤖 Generated with [Claude Code](https://claude.ai/code)
