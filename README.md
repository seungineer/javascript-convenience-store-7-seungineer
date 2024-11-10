# javascript-convenience-store-precourse

## 스스로 정한 규칙
- [ ] 프로모션 기간이 아닌 경우
  - [ ] 프로모션 상품 정보를 출력하지 않는다.
  - [ ] 일반 재고가 아닌 프로모션 재고를 구매할 수 없다.
  - [x] 기존 `promotion.md` 파일 내'반짝할인'의 종료 날짜를 앞당겨 프로모션이 적용되지 않도록 한다.

## 구현 기능 목록
### 사용자 입력
- [ ] 사용자는 구매할 상품명과 수량을 `[사이다-2],[감자칩-1]` 형태로 입력한다.
- [ ] `(Y/N)`으로 끝나는 질문에는 `Y` 또는 `N`으로만 입력 가능하다.

### 결제 금액 계산
- [ ] 사용자가 입력한 상품의 가격과 수량을 기반으로 최종 결제 금액을 계산한다.
  - [x] 총 구매액은 상품별 가격과 수량을 곱하여 계산한다.
  - [ ] 프로모션 및 멤버십 할인 정책을 반영하여 최종 결제 금액을 산출한다.

### 재고 로드
- [x] `production.md`파일의 데이터를 활용 가능하도록 후처리 한다.

### 재고 관리
- [x] 각 상품의 재고 수량을 고려하여 결제 가능 여부를 확인한다.
- [x] 매 결제 마다 결제된 수량만큼 해당 상품의 재고에서 차감한다.
- [ ] 다음 고객이 구매할 때 차감된 재고가 반영된 목록을 출력한다.

### 프로모션 관리
- [ ] 오늘 날짜가 프로모션 기간 내에 포함된 경우에만 할인을 적용한다.
- [ ] 프로모션은 N개 구매 시 1개 무료 증정(Buy N Get 1 Free)의 형태로 진행된다.
- [ ] 동일 상품에 여러 프로모션이 적용되지 않는다.
- [ ] 프로모션 혜택은 프로모션 재고 내에서만 적용할 수 있다.
  - [ ] 프로모션 재고가 부족하여 일부 수량을 프로모션 혜택 없이 결제해야 하는 경우, 일부 수량에 대해 정가로 결제하게 됨을 안내한다.
  - [ ] 프로모션 적용이 가능한 상품에 대해 고객이 해당 수량보다 적게 가져온 경우, 필요한 수량을 추가로 가져오면 혜택을 받을 수 있음을 안내한다.
- [ ] 프로모션 기간 중이라면 프로모션 재고를 우선적으로 차감하며, 프로모션 재고가 부족할 경우에는 일반 재고를 사용한다.

### 멤버십 할인
- [ ] 프로모션 적용 후 남은 금액에 대해 30% 멤버십 할인을 적용한다.
  - [ ] 멤버십 할인의 최대 한도는 8,000원이다.

### 영수증 출력
- [ ] 영수증은 고객의 구매 내역과 할인을 요약하여 출력한다.
- [ ] 영수증 항목은 아래와 같다.
  - [ ] 구매 상품 내역: 구매한 상품명, 수량, 가격
  - [ ] 증정 상품 내역: 프로모션에 따라 무료로 제공된 증정 상품의 목록
- [ ] 영수증 출력 후 추가 구매를 진행할지 또는 종료할지를 선택할 수 있다.

## 예외 처리 항목

### 입력
- [ ] 입력 형식이 올바르지 않은 경우 예외 처리한다.
- [ ] `Y` 또는 `N`으로 입력해야 하는 질문에 다른 형태로 입력하는 경우 예외 처리한다.

### 재고관리
- [ ] 존재하지 않는 품목을 입력한 경우 예외 처리한다.
- [ ] 구매 가능하지 않은 수량을 입력한 경우 예외 처리한다.

### MD 파일 입출력
- [x] `public/products.md` 파일이 존재하지 않는 경우 예외 처리한다.
- [ ] `public/promotions.md` 파일이 존재하지 않는 경우 예외 처리한다.