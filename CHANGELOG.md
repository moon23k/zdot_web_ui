# @ezpg/web-ui

## 0.6.0

### Minor Changes

- f6022cc: applyTemplate: 브랜드 design.shape 가 있으면 템플릿 모양 대신 고른 모서리 · 버튼을 쓴다. 사이트 간격(--ezd-section-gap · --ezd-gutter)은 design.density 비율(기준 섹션 64 · 칸 16)만큼 템플릿 값을 늘리고 줄인다.

## 0.5.0

### Minor Changes

- 9b886d1: 새 디자인 3벌: 오로라 글래스(d) · 나이트 글로우(e)를 종류 8개에, 오브젝트 스테이지(f)를 쇼핑몰에 추가. 나이트 테마 5종(dracula · tokyo · mocha · nord · rose)과 ThemeRoot 의 night 속성, 나이트 전용 거래 화면 색, 효과 유틸 fx-\*

## 0.4.0

### Minor Changes

- 030c45d: 손님 웹 디자인 고도화: 기준 규칙 9개를 공용 부품에 반영. 주 단추는 메인 컬러 단색 채움 + on-primary 글자(테두리 · 그림자 없음), 보조는 1px 외곽선, 비활성은 불투명 면. 글자 사다리 12 · 13 · 15 · 17 · 22 · 30 · 44 · 64, 글자 잉크를 키트 text 84% + surface 16% 로 낮추고 제목 · 이름 · 라벨 400(22px 이상 300), 500 은 단추 글자 · 선택 상태에만. 알약 모서리 제거(쇼핑몰 c 14px), 라벨 → 값 줄(infoRows), 이탤릭 숫자는 평점만(numeral). 상세 본문 2열(DetailSplit) · 왼쪽 시작선, 모바일 예약 하단 막대 + 시트(BookingFrame), 달력 예약 가능 표시, 주문서 "주문자와 같음"(AddressForm contact), 주문번호 복사(OrderNumber), 쇼핑몰 · 숙박 · 클래스 · 견적 a · b · c 홈의 사진 반복 제거 · 칸 수 규칙(product_grid count). 숙박 요금 내역: 견적 응답의 StayBreakdownOut 타입과 stayCharges(), CardTotal · OrderSummary 가 객실 요금 · 추가 인원 · 옵션 줄과 합계 아래 현장 결제 줄을 그림.

### Patch Changes

- 29ab3f6: 예약 상세 머리(BookingHead)의 정보 줄: 넓은 화면의 칸 수를 항목 수에 맞춤(1 ~ 4칸, 4개 이상은 지금처럼 4칸). 항목이 적을 때 오른쪽이 비던 것. 좁은 화면 2칸은 그대로.
- 88f2273: 수업 카드(ClassCard)에 `sample` 추가 — 예시 수업이면 상품 카드와 같은 자리 · 문구로 `예시` 표시(a · c 종류 줄, b 이름 옆, 기본 틀 첫 줄), `data-sample` 속성. 값이 없는 실제 수업의 모습은 그대로.
- 9df011b: 클래스 a · b · c 오시는 길: 숙박과 같은 지도 그림(SampleMap)을 지도 자리에 표시 — 주소가 있을 때만, 링크 이름에 출처 표기 포함
- 9cd070a: 상세 문서: 사진 위 · 글 아래 배치에서 사진 아래 글 묶음의 윗 여백을 32로(앱 편집기 · 승인 시안과 같은 간격)
- 3cc7e6b: 상세 문서 표: 이름 칸과 값 칸을 글자 밑선에 맞춤(작은 이름 글자가 값보다 위에 떠 보이던 것)
- fc7e64f: 상세 펼침 줄 마감: 후기 운영 기준(ReviewList)의 펼침 표시를 브라우저 기본 ▶ 대신 펼침 줄(Fold)과 같은 오른쪽 + 로. legacy.css 의 .ez-faq details · summary 규칙을 걷어내고(문의 질문은 Fold 로 그림) 문의 목록 뒤 단추에 간격(--ezd-gutter).
- c548143: 바닥글 사업자 정보 줄 · 예약 상자 줄 이름(CardRow, 글자에 `·` 가 들 때): 항목마다 한 덩어리로 줄을 바꾸고, 구분점은 항목 앞에 붙여 줄 머리에서 가림(줄 끝 · 줄 머리에 구분점이 남던 것, 주소가 중간에서 갈리던 것). 클래스 일정 줄: 일정(Session)에 `count`(회차 수)를 더해 여러 회차 수업은 "소요 한 회 길이 · 회차 N회"로 표시(소요 자리에 회차 수가 나오던 것). 기본 틀의 개강 표 기간 칸은 회차 수 그대로.

  사업자 정보 줄 마무리: 상호와 "대표 ○○"를 따로 나눔(첫 구분점만 넓던 것). 이름 · 값을 " · "로 이어 붙이던 바닥글(견적 a, 랜딩 기본, office a, portfolio · care · place c)도 같은 방식으로 그림.

- 258e3bf: 틀 마감 결함: 바닥글 사업자 정보의 번호(고객센터 · 사업자등록번호 · 통신판매업 신고)가 줄 사이에서 갈리지 않게(legalLine 이 ReactNode, footer props 의 legal 타입 ReactNode). 모바일 2열 격자의 외톨이 칸 — 더 보기가 있는 줄(쇼핑몰 a · c 상품 줄, 클래스 a · c 수업, 숙박 c 객실)은 홀수일 때 마지막 칸을 2열 구간에서 숨기고, 쇼핑몰 a 분류는 모바일에서 가로로 넘김. 쇼핑몰 a · 클래스 a 카드는 표시(품절 · 예시 · 종류)가 하나도 없는 줄이면 표시 줄 자리를 두지 않음. 숙박 a · b · c · 키트 표의 머리칸에 w-auto(프레임 공용 th 32% 규칙 차단), 숙박 a · b · 키트 표 칸 선 제거(마지막 행 아래 이중 선). 숙박 a 편의시설 목록 위 간격(m-0 이 mt 를 덮던 것). 추가 인원 요금은 이름과 금액을 붙여 씀. 인원 표기 '명'으로 통일. DetailLayout: null 로 넘긴 자리는 감싸는 칸도 그리지 않고, detail-node 안 .ez-section 의 첫 · 끝 여백을 0으로(배치 간격과 이중). 클래스 a 스튜디오 구획이 photo_band.body(스토어 소개)를 그리고, 없으면 빈 틀 막대.

  숙박 갤러리 모바일 외톨이 칸: a 는 3장일 때 첫 장을 모바일에서 2열 폭, b 는 장수별로 남는 칸을 좁은 화면에서 숨김(3장: 2열 구간 셋째, 4장: 3열 구간 넷째, 5장: 기존과 같음).

- 26b53f3: PhotoCollage 가 사진 수에 맞춰 칸 수를 정함(1 · 2 · 3 · 5칸) — 사진이 모자라면 빈 칸이 남던 수업 · 객실 상세. 사진이 없을 때의 틀(3 · 5칸)과 사진이 다 찬 모습은 그대로.
- 57be3ca: 가게 소개 b 모바일 넘침: 메뉴 구획(비율 고정 사진이 든 대표 메뉴 격자)이 홈 배치 격자의 열 폭을 화면보다 넓게 키워 히어로 · 소개 · 메뉴 · 찾아오는 길이 오른쪽으로 잘리던 것. 메뉴 구획에 min-w-0.
- 3087b2b: 별점(StarRow)의 소수 평점을 비율대로 칠함: 별 n 의 채움 = clamp(평점 − (n − 1), 0, 1), 흐린 별 위에 같은 색 별을 별 폭의 비율만큼 잘라 겹침(4.7 → 다섯째 별 70%). 정수 평점은 그대로. 달력(Calendar)의 날짜에 outside 를 넘길 수 있게(범위 밖 날과 같은 흐린 날짜, 취소선 없음), 선택 prop legend 로 달력 아래 범례 한 줄 — 달력에 실제로 있는 상태만(점이 찍히는 날이 있으면 "예약 가능", 취소선 날이 있으면 "마감"), 마감 견본은 날짜 글자 모양에 취소선 날의 날짜 숫자(두 자리 먼저), 둘 다 없으면 범례 없음. legend 를 주지 않은 달력은 그대로. 바닥글 사업자등록번호를 숫자 10자리면 3-2-5(000-00-00000)로 표기(legalLine · 견적 사업자 정보 줄, 10자리 숫자가 아니면 그대로).

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
