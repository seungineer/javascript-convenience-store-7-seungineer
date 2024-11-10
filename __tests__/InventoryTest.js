import Inventory from '../src/Inventory';

const PARSED_PRODUCTS = [
  ['콜라', '1000', '10', '탄산2+1'],
  ['콜라', '1000', '5', 'null'],
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
    });
  });
});

describe('Inventory 클래스 - deductStock', () => {
  let inventory;

  beforeEach(() => {
    inventory = new Inventory();
    inventory.initializeFromParsedData(PARSED_PRODUCTS);
  });

  test('정상적인 재고 차감', () => {
    inventory.deductStock('콜라', 3);
    const product = inventory.getProduct('콜라');
    expect(product.normalQuantity + product.promotionQuantity).toBe(12);
  });

  test('상품이 존재하지 않을 경우 에러 발생', () => {
    expect(() => {
      inventory.deductStock('사이다', 1);
    }).toThrow('[ERROR] 존재하지 않는 상품입니다. 다시 입력해 주세요.');
  });

  test('재고 부족 시 에러 발생', () => {
    expect(() => {
      inventory.deductStock('콜라', 16);
    }).toThrow('[ERROR] 재고 수량을 초과하여 구매할 수 없습니다. 다시 입력해 주세요.');
  });
});
