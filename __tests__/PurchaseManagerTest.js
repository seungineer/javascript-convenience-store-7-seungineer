import { Console, DateTimes } from '@woowacourse/mission-utils';
import PurchaseManager from '../src/PurchaseManager';

const PARSED_PRODUCTS = [
  ['콜라', '1000', '10', '탄산2+1'],
  ['콜라', '1000', '5', 'null'],
  ['사이다', '1500', '4', 'MD추천상품'],
  ['사이다', '1500', '1', 'null'],
  ['에너지바', '2000', '5', '반짝할인'],
  ['에너지바', '2000', '5', 'null'],
];

jest.mock('@woowacourse/mission-utils', () => ({
  Console: {
    readLineAsync: jest.fn(),
  },
  DateTimes: {
    now: jest.fn(() => new Date('2024-11-10T00:00:00.000Z')),
  },
}));

describe('PurchaseManager 클래스 - processPurchase', () => {
  let purchaseManager;

  beforeEach(() => {
    purchaseManager = new PurchaseManager();
    purchaseManager.inventory.initializeFromParsedData(PARSED_PRODUCTS);

    DateTimes.now.mockReturnValue(new Date('2024-11-10T00:00:00.000Z'));
  });

  test('isPromotionApplied가 true, 증정품을 더 받는 경우, 프로모션 재고 감소', async () => {
    const product = purchaseManager.inventory.getProduct('사이다');
    expect(product.isPromotionApplied).toBe(true);

    Console.readLineAsync.mockImplementationOnce(() => Promise.resolve('Y'));

    await purchaseManager.processPurchase('사이다', 3);
    const updatedProduct = purchaseManager.inventory.getProduct('사이다');
    expect(updatedProduct.promotionQuantity).toBe(0);
    expect(updatedProduct.normalQuantity).toBe(1);
  });

  test('isPromotionApplied가 true, 증정품을 더 받지 않는 경우, 프로모션 재고 감소', async () => {
    const product = purchaseManager.inventory.getProduct('사이다');
    expect(product.isPromotionApplied).toBe(true);

    Console.readLineAsync.mockImplementationOnce(() => Promise.resolve('N'));

    await purchaseManager.processPurchase('사이다', 3);
    const updatedProduct = purchaseManager.inventory.getProduct('사이다');
    expect(updatedProduct.promotionQuantity).toBe(1);
    expect(updatedProduct.normalQuantity).toBe(1);
  });

  test('isPromotionApplied가 false인 경우, 일반 재고가 감소', async () => {
    const product = purchaseManager.inventory.getProduct('에너지바');
    expect(product.isPromotionApplied).toBe(false);

    await purchaseManager.processPurchase('에너지바', 4);
    const updatedProduct = purchaseManager.inventory.getProduct('에너지바');
    expect(updatedProduct.normalQuantity).toBe(1);
    expect(updatedProduct.promotionQuantity).toBe(5);
  });

  test('isPromotionApplied가 true, 일반 상품으로 전환하지 않는 경우, 프로모션 재고가 먼저 감소된 후 일반 재고가 감소', async () => {
    Console.readLineAsync.mockImplementationOnce(() => Promise.resolve('N'));

    await purchaseManager.processPurchase('사이다', 5);
    const updatedProduct = purchaseManager.inventory.getProduct('사이다');
    expect(updatedProduct.promotionQuantity).toBe(0);
    expect(updatedProduct.normalQuantity).toBe(1);
  });

  test('isPromotionApplied가 true, 일반 상품으로 전환하는 경우, 프로모션 재고가 먼저 감소된 후 일반 재고가 감소', async () => {
    Console.readLineAsync.mockImplementationOnce(() => Promise.resolve('Y'));

    await purchaseManager.processPurchase('사이다', 5);
    const updatedProduct = purchaseManager.inventory.getProduct('사이다');
    expect(updatedProduct.promotionQuantity).toBe(0);
    expect(updatedProduct.normalQuantity).toBe(0);
  });

  test('isPromotionApplied가 false인 경우, 프로모션 재고는 있으나 일반 재고가 부족하면 에러 발생', async () => {
    await expect(purchaseManager.processPurchase('에너지바', 6)).rejects.toThrow(
      '[ERROR] 재고 수량을 초과하여 구매할 수 없습니다. 다시 입력해 주세요.',
    );
  });
});
