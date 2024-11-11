import fileReader from './utils/fileReader.cjs';

const { readPromotionsFile } = fileReader;

export default class Promotion {
  constructor() {
    this.promotions = null;
    this.initializePromise = this.initialize();
  }

  async initialize() {
    this.promotions = await readPromotionsFile('public/promotions.md');
  }

  async getPromotion(promotionName) {
    await this.initializePromise;
    return this.promotions.get(promotionName);
  }

  async isPromotionApplicable(promotionName) {
    await this.initializePromise;
    return this.promotions.has(promotionName);
  }

  calculatePromotableQuantity(requestedQuantity, buy, get) {
    const requiredQuantityForPromotion = buy + get;
    const promotableSets = Math.floor(requestedQuantity / requiredQuantityForPromotion);
    return promotableSets * buy;
  }
}
