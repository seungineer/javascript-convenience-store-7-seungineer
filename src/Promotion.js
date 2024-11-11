import { readPromotionsFile } from './utils/fileReader';

export default class Promotion {
  constructor() {
    this.promotions = readPromotionsFile('public/promotions.md');
  }

  getPromotionInfo(promotionName) {
    return this.promotions.get(promotionName);
  }

  isPromotionApplicable(promotionName) {
    return this.promotions.has(promotionName);
  }

  calculatePromotableQuantity(requestedQuantity, buy, get) {
    const requiredQuantityForPromotion = buy + get;
    const promotableSets = Math.floor(requestedQuantity / requiredQuantityForPromotion);
    return promotableSets * buy;
  }
}
