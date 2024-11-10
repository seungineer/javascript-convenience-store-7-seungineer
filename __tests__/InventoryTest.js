import Inventory from '../src/Inventory';

const PARSED_PRODUCTS = [
  ['콜라', '1000', '10', '탄산2+1'],
  ['콜라', '1000', '5', 'null'],
  ['사이다', '1500', '4', 'MD추천상품'],
  ['사이다', '1500', '1', 'null'],
  ['에너지바', '2000', '5', '반짝할인'],
  ['에너지바', '2000', '5', 'null'],
];

describe('Inventory 클래스 - initializeFromParsedData', () => {
  test('parsing된 데이터를 이용해 재고 객체 생성', () => {
    const inventory = new Inventory();
    inventory.initializeFromParsedData(PARSED_PRODUCTS);

    expect(inventory.hasProduct('콜라')).toBe(true);

    const product = inventory.getProduct('콜라');
    expect(product).toEqual({
      price: 1000,
      normalQuantity: 5,
      promotionQuantity: 10,
      promotion: '탄산2+1',
      isPromotionApplied: true,
    });
  });
});

describe('Inventory 클래스 - deductStock', () => {
  let inventory;

  beforeEach(() => {
    inventory = new Inventory();
    inventory.initializeFromParsedData(PARSED_PRODUCTS);
  });

  test('isPromotionApplied가 true인 경우, 프로모션 재고가 감소', () => {
    const product = inventory.getProduct('사이다');
    expect(product.isPromotionApplied).toBe(true);

    inventory.deductStock('사이다', 3);
    const updatedProduct = inventory.getProduct('사이다');
    expect(updatedProduct.promotionQuantity).toBe(1);
    expect(updatedProduct.normalQuantity).toBe(1);
  });

  test('isPromotionApplied가 false인 경우, 일반 재고가 감소', () => {
    const product = inventory.getProduct('에너지바');
    expect(product.isPromotionApplied).toBe(false);

    inventory.deductStock('에너지바', 4);
    const updatedProduct = inventory.getProduct('에너지바');
    expect(updatedProduct.normalQuantity).toBe(1);
    expect(updatedProduct.promotionQuantity).toBe(5);
  });

  test('isPromotionApplied가 true인 경우, 프로모션 재고가 먼저 감소된 후 부족하면 일반 재고가 감소', () => {
    inventory.deductStock('사이다', 5);
    const updatedProduct = inventory.getProduct('사이다');
    expect(updatedProduct.promotionQuantity).toBe(0);
    expect(updatedProduct.normalQuantity).toBe(0);
  });

  test('isPromotionApplied가 false인 경우, 프로모션 재고는 있으나 일반 재고가 부족하면 에러 발생', () => {
    expect(() => {
      inventory.deductStock('에너지바', 6);
    }).toThrow("[ERROR] '에너지바'의 재고가 부족합니다.");
  });
});
