import TotalBaseAmountCalculator from '../src/TotalBaseAmountCalculator';

describe('TotalBaseAmountCalculator 클래스', () => {
  test('단일 상품의 총 base 결제 금액 계산', () => {
    const calculator = new TotalBaseAmountCalculator();
    const cart = [
      { name: '콜라', price: 1000, normalQuantity: 2, promotionQuantity: 1 },
    ];
    expect(calculator.calculateBaseTotal(cart)).toBe(3000);
  });

  test('여러 상품의 총 base 결제 금액 계산', () => {
    const calculator = new TotalBaseAmountCalculator();
    const cart = [
      { name: '콜라', price: 1000, normalQuantity: 2, promotionQuantity: 1 },
      { name: '사이다', price: 1000, normalQuantity: 4, promotionQuantity: 2 },
    ];
    expect(calculator.calculateBaseTotal(cart)).toBe(9000);
  });
});
