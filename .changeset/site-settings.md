---
"@ezpg/web-ui": minor
---

템플릿 · 설정 반영 묶음. 삭제된 export 없음, 값이 없을 때의 기본 렌더는 이전과 같음.

- 클래스 템플릿 새 디자인 a 에디토리얼 · b 카탈로그 · c, 일정 날짜 중복 표시 수정.
- 거래 없는 랜딩 템플릿 4종: place(가게 소개 a 브랜드형 · b 방문 안내형 · c 이야기형) · care(예약형 매장 a 클리닉 · b 살롱 · c 스튜디오) · portfolio(작업 소개 a 격자 · b 목록 · c 프로필) · office(사무소 a 사례 · b 선언). 새 구획 menu · intro · store_info, 공용 랜딩 부품 sections/landing.
- 상품 진열 설정: 쇼핑몰 상품 격자 · 카드가 shelf(한 줄 개수 웹/모바일 · 사진 비율 · 할인율/정가/품절 표시 · 기본 정렬)를 받음 — shelfOf · SHELF_DEFAULTS, CatalogView 의 shelf prop, SiteContext.shelf.
- 팝업 모양: StorePopup 이 위치(center · bottom · bar) · 크기 · 덮개 · 오늘 하루 열지 않기 숨김을 받음. 덮개를 끄면 비모달.
- 주문서 구성: CheckoutLayout 의 쿠폰 구획 접기 · RequestNote(배송 요청 사항 고르기 + 직접 입력).
- 결제 화면: PayWidget 의 buttonAmount prop, payOf.
