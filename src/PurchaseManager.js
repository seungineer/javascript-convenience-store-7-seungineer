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
    this.validateProduct(product, name, requestedQuantity);

    let promotionAppliedQuantity = 0;
    let normalPurchaseQuantity = requestedQuantity;

    if (this.shouldApplyPromotion(product)) {
      ({ promotionAppliedQuantity, normalPurchaseQuantity } = await this.applyPromotionLogic(
        product,
        requestedQuantity,
      ));
    }
    if (promotionAppliedQuantity === undefined) promotionAppliedQuantity = 0;
    if (normalPurchaseQuantity === undefined) normalPurchaseQuantity = 0;

    this.inventory.deductStock(name, promotionAppliedQuantity, normalPurchaseQuantity);
    this.addPurchaseHistory(name, product.price, promotionAppliedQuantity, normalPurchaseQuantity, product.promotion);
  }

  validateProduct(product, name, requestedQuantity) {
    validateProductExistence(product, name);
    validateSufficientStock(product, requestedQuantity);
  }

  shouldApplyPromotion(product) {
    return product.isPromotionApplied && this.promotion.getPromotionInfo(product.promotion);
  }

  async applyPromotionLogic(product, requestedQuantity) {
    const promotionInfo = this.promotion.getPromotionInfo(product.promotion);
    const { buy, get } = promotionInfo;

    if (requestedQuantity <= product.promotionQuantity) {
      return this.calculatePromotableQuantity(product, requestedQuantity, buy, get);
    }
    return this.applyRemainingAsNormalPurchase(product, requestedQuantity, buy, get);
  }

  async calculatePromotableQuantity(product, requestedQuantity, buy, get) {
    const requiredQuantity = buy + get;
    let promotionAppliedQuantity = 0;
    let normalPurchaseQuantity = requestedQuantity;

    if (requestedQuantity % requiredQuantity === 0) {
      promotionAppliedQuantity = requestedQuantity;
      normalPurchaseQuantity = 0;
    } else if (requiredQuantity * (Math.floor(requestedQuantity / requiredQuantity) + 1) - 1 === requestedQuantity) {
      return await this.applyAdditionalPromotion(product, requestedQuantity, requiredQuantity);
    }

    return { promotionAppliedQuantity, normalPurchaseQuantity };
  }

  async applyAdditionalPromotion(product, requestedQuantity, requiredQuantity) {
    const isUserGetOneFree = await Console.readLineAsync(
      `현재 ${product.name}은(는) 1개를 무료로 더 받을 수 있습니다. 추가하시겠습니까? (Y/N)`,
    );

    if (isUserGetOneFree === 'Y') {
      return {
        promotionAppliedQuantity: requestedQuantity + 1,
        normalPurchaseQuantity: 0,
      };
    }

    return {
      promotionAppliedQuantity: requestedQuantity,
      normalPurchaseQuantity: 0,
    };
  }

  async applyRemainingAsNormalPurchase(product, requestedQuantity, buy, get) {
    const bundleCount = Math.floor(product.promotionQuantity / (buy + get));
    const promotionAppliedQuantity = (buy + get) * bundleCount;
    let normalPurchaseQuantity = requestedQuantity - promotionAppliedQuantity;

    const isUserGetRestNormalPrice = await Console.readLineAsync(
      `현재 ${product.name} ${normalPurchaseQuantity}개는 프로모션 할인이 적용되지 않습니다. 그래도 구매하시겠습니까? (Y/N)`,
    );

    if (isUserGetRestNormalPrice === 'N') {
      normalPurchaseQuantity = 0;
    }

    return { promotionAppliedQuantity, normalPurchaseQuantity };
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
