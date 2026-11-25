---
"@ezpg/web-ui": minor
---

손님 웹 디자인 고도화: 기준 규칙 9개를 공용 부품에 반영. 주 단추는 메인 컬러 단색 채움 + on-primary 글자(테두리 · 그림자 없음), 보조는 1px 외곽선, 비활성은 불투명 면. 글자 사다리 12 · 13 · 15 · 17 · 22 · 30 · 44 · 64, 글자 잉크를 키트 text 84% + surface 16% 로 낮추고 제목 · 이름 · 라벨 400(22px 이상 300), 500 은 단추 글자 · 선택 상태에만. 알약 모서리 제거(쇼핑몰 c 14px), 라벨 → 값 줄(infoRows), 이탤릭 숫자는 평점만(numeral). 상세 본문 2열(DetailSplit) · 왼쪽 시작선, 모바일 예약 하단 막대 + 시트(BookingFrame), 달력 예약 가능 표시, 주문서 "주문자와 같음"(AddressForm contact), 주문번호 복사(OrderNumber), 쇼핑몰 · 숙박 · 클래스 · 견적 a · b · c 홈의 사진 반복 제거 · 칸 수 규칙(product_grid count). 숙박 요금 내역: 견적 응답의 StayBreakdownOut 타입과 stayCharges(), CardTotal · OrderSummary 가 객실 요금 · 추가 인원 · 옵션 줄과 합계 아래 현장 결제 줄을 그림.
