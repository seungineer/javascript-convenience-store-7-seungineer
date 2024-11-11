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
