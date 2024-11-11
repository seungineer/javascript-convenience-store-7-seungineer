import { Console } from '@woowacourse/mission-utils';
import Inventory from './Inventory.js';
import Promotion from './Promotion.js';
import { validateProductExistence, validateSufficientStock } from './validators/validateInventory.js';

export default class PurchaseManager {
  constructor() {
    this.inventory = new Inventory();
    this.promotion = new Promotion();
    this.purchaseHistory = [];
  }

  async processPurchase(name, requestedQuantity) {
    const product = this.inventory.getProduct(name);
    const promotionInfo = this.promotion.getPromotionInfo(product.promotion);

    validateProductExistence(product, name);
    validateSufficientStock(product, requestedQuantity);

    let promotionAppliedQuantity = 0;
    let normalPurchaseQuantity = requestedQuantity;

    if (product.isPromotionApplied && promotionInfo) {
      const { buy, get } = promotionInfo;
      if (requestedQuantity <= product.promotionQuantity) {
        if (requestedQuantity % (buy + get) === 0) {
          promotionAppliedQuantity += requestedQuantity;
          normalPurchaseQuantity -= requestedQuantity;
        } else {
          const bundleCount = Math.floor(requestedQuantity / (buy + get));
          if ((buy + get) * (bundleCount + 1) - 1 === requestedQuantity) {
            const isUserGetOneFree = await Console.readLineAsync(
              `현재 ${product.name}은(는) 1개를 무료로 더 받을 수 있습니다. 추가하시겠습니까? (Y/N)`,
            );
            if (isUserGetOneFree === 'Y') {
              requestedQuantity += 1;
              promotionAppliedQuantity += requestedQuantity;
              normalPurchaseQuantity -= promotionAppliedQuantity - 1;
            } else {
              promotionAppliedQuantity += requestedQuantity;
              normalPurchaseQuantity -= promotionAppliedQuantity;
            }
          }
        }
      } else if (requestedQuantity <= product.promotionQuantity + product.normalQuantity) {
        const bundleCount = Math.floor(product.promotionQuantity / (buy + get));
        promotionAppliedQuantity = (buy + get) * bundleCount;
        normalPurchaseQuantity = requestedQuantity - promotionAppliedQuantity;
        const isUserGetRestNormalPrice = await Console.readLineAsync(
          `현재 ${product.name} ${normalPurchaseQuantity}개는 프로모션 할인이 적용되지 않습니다. 그래도 구매하시겠습니까? (Y/N)`,
        );
        if (isUserGetRestNormalPrice === 'N') {
          normalPurchaseQuantity = 0;
        }
      } else {
        validateSufficientStock(product, requestedQuantity);
      }
    }

    this.inventory.deductStock(name, promotionAppliedQuantity, normalPurchaseQuantity);
    this.addPurchaseHistory(name, product.price, promotionAppliedQuantity, normalPurchaseQuantity, product.promotion);
  }

  addPurchaseHistory(name, price, promotionQuantity, normalQuantity, promotionName) {
    this.purchaseHistory.push({
      name,
      price,
      promotionQuantity,
      normalQuantity,
      promotionName,
    });
  }

  getReceipt() {
    return this.purchaseHistory;
  }
}
