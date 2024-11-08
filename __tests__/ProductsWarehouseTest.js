import ProductsWarehouse from '../src/ProductsWarehouse.js';

describe('ProductWarehouse - checkStock', () => {
  let productsWarehouse;

  beforeEach(() => {
    const mockProducts = [
      {
        name: '콜라',
        price: 1000,
        normalQuantity: 10,
        promotionQuantity: 5,
        promotion: '탄산2+1',
      },
      {
        name: '사이다',
        price: 1000,
        normalQuantity: 3,
        promotionQuantity: 1,
        promotion: null,
      },
    ];
    productsWarehouse = new ProductsWarehouse(mockProducts);
  });

  test.each([
    ['콜라', 5, true, '재고가 충분할 경우 결제 가능'],
    ['사이다', 10, false, '재고가 부족할 경우 결제 불가'],
    ['환타', 1, false, '상품이 존재하지 않을 경우 결제 불가'],
  ])(
    '%s 상품 - %s개 요청 시 %s 반환 (%s)',
    (name, quantity, expected, description) => {
      const result = productsWarehouse.checkStock(name, quantity);
      expect(result).toBe(expected);
    },
  );
});
