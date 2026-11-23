# @ezpg/web-ui

## 0.3.0

### Minor Changes

- 0fa4304: 브랜드 키트를 사이트에 반영: 팔레트가 있으면 바닥글 바탕은 강조 색 · 글자는 강조 색 위 글자색, 예시 꼬리표는 메인 컬러 연한 바탕, 사진 없는 칸 다섯 색은 키트에서 계산(designVars, 팔레트 없으면 지금과 같음). 미리보기 안쪽 ThemeRoot 가 전체 폭 띠를 자르지 않음. 파트너 배너 제목 아래 보조 줄(hero.sub)
- 113aa4e: 쇼핑몰 분류 칸: Category.cover_url 이 있으면 분류 대표 사진(Pic), 없으면 지금 빈 사진 칸
- 33a48ed: 생성 문구 없는 사이트 틀: 히어로는 파트너 배너 제목이 있을 때만 제목 · 버튼, 없으면 사진 중심(상품 칩 · 고정 링크 · 정보 줄 유지), story 구획 · intro 기본 · statement 변형 · before_after 구획 · hero frame 변형 · 쇼핑몰 d · 견적 d 템플릿 삭제, 구획 제목은 고정 이름만, SiteContext.storeName 으로 제목 없는 홈에 숨은 h1
- 776b36d: 견적 템플릿 · 상세페이지 문서.

  - 견적 템플릿을 신뢰 랜딩 문법으로 다시 만듦(a · b · c), 패키지 표에 포함 항목(includes) 표시.
  - 상세페이지 문서 블록 배치 2종: 표(table — 글 레이어를 [항목, 값] 짝으로) · 순서(steps — 번호 원 + 이름). 빈 줄 · 빈 단계 · 숨긴 칸은 그리지 않음. 기존 배치 7종의 렌더는 그대로.

- 776b36d: 템플릿 · 설정 반영 묶음. 삭제된 export 없음, 값이 없을 때의 기본 렌더는 이전과 같음.

  - 클래스 템플릿 새 디자인 a 에디토리얼 · b 카탈로그 · c, 일정 날짜 중복 표시 수정.
  - 거래 없는 랜딩 템플릿 4종: place(가게 소개 a 브랜드형 · b 방문 안내형 · c 이야기형) · care(예약형 매장 a 클리닉 · b 살롱 · c 스튜디오) · portfolio(작업 소개 a 격자 · b 목록 · c 프로필) · office(사무소 a 사례 · b 선언). 새 구획 menu · intro · store_info, 공용 랜딩 부품 sections/landing.
  - 상품 진열 설정: 쇼핑몰 상품 격자 · 카드가 shelf(한 줄 개수 웹/모바일 · 사진 비율 · 할인율/정가/품절 표시 · 기본 정렬)를 받음 — shelfOf · SHELF_DEFAULTS, CatalogView 의 shelf prop, SiteContext.shelf.
  - 팝업 모양: StorePopup 이 위치(center · bottom · bar) · 크기 · 덮개 · 오늘 하루 열지 않기 숨김을 받음. 덮개를 끄면 비모달.
  - 주문서 구성: CheckoutLayout 의 쿠폰 구획 접기 · RequestNote(배송 요청 사항 고르기 + 직접 입력).
  - 결제 화면: PayWidget 의 buttonAmount prop, payOf.

## 0.2.0

### Minor Changes

- 873e4ae: Select: 네이티브 select를 감싼 선택 상자 추가
- 1b2854d: 기본 색·반경·글꼴·움직임과 고정 상태색(border · danger · success · warning · info, 각 on-·tint)을 EZPG 공통 토큰 원본에서 생성한 theme/system.ts · styles/system.css로 읽음. danger `#dc2626`, 기본 반경 6 · 8 · 12.
- 9a2f0ce: `@ezpg/web-ui/core` 진입점(기본 부품 · cn · won · kstDate · designVars)과 소비 앱 Tailwind용 `@ezpg/web-ui/tokens.css`(고정 상태색 + 의미 이름 연결) 추가.
- 5e0475c: 부품 규칙 통일: Dialog · Sheet `onClose` → `onOpenChange`, Badge tone `warn` → `danger`, Button `loading`, EmptyState 선택 prop `action`, Button · Badge 이름을 공통 규칙(theme/contract.ts, design/contract.json 생성)으로 검사. 빈 부품 파일 7개 삭제, Storybook(부품 12개 스토리)과 스토리 렌더 · 접근성 테스트 추가.

### Patch Changes

- baa1a2f: danger #b91c1c(연한 빨강 바탕 위 대비 4.5:1 이상), Storybook 상점 테마 3종 전환, build가 dist를 임시 폴더에 만든 뒤 한 번에 바꿈.
- 5f081b5: G5 블록 23종 · 사이트 · 카테고리 메뉴 · 입금 안내 스토리, 장바구니 줄 사진 없을 때 링크 이름 접근성 수정
- 48fb3ba: tokens.css에 운영 글자 단계 8개(text-display · title-1 · title-2 · body · body-strong · label · caption · mono), --font-sans · --font-mono, text-disabled 추가. SYSTEM_FONT 맨 앞 Pretendard Variable.

## 0.1.0

### Minor Changes

- 8bf8bb6: 첫 공개 배포.
