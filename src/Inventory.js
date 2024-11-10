import { validateAffordToBuy } from './validators/validateRequests.js';

export default class {
  #products;

  constructor() {
    this.#products = new Map();
  }

  initializeFromParsedData(parsedProducts) {
    parsedProducts.forEach((originalProductData) => {
      const product = this.createProduct(originalProductData);
      const productName = originalProductData[0];
      this.addOrUpdateProduct(productName, product);
    });
  }

  deductStock(name, quantity) {
    const product = this.#products.get(name);
    validateAffordToBuy(product, name, quantity);

    product.normalQuantity -= quantity;
    this.#products.set(name, product);
  }

  createProduct([name, price, quantity, promotionName]) {
    const baseProduct = {
      price: parseInt(price, 10),
      normalQuantity: 0,
      promotionQuantity: 0,
      promotion: null,
      isPromotionApplied: false,
    };
    return this.applyQuantitiesAndFlag(baseProduct, quantity, promotionName);
  }

  applyQuantitiesAndFlag(baseProduct, quantity, promotionName) {
    const productWithQuantities = this.setQuantities(baseProduct, quantity, promotionName);
    return this.setPromotionFlag(productWithQuantities, promotionName);
  }

  setQuantities(baseProduct, quantity, promotionName) {
    if (promotionName === 'null') {
      return this.setNormalQuantity(baseProduct, quantity);
    }
    return this.setPromotionQuantity(baseProduct, quantity, promotionName);
  }

  setPromotionFlag(product, promotionName) {
    if (this.#promotions.has(promotionName)) {
      return { ...product, isPromotionApplied: true };
    }
    return product;
  }

  setNormalQuantity(baseProduct, quantity) {
    return { ...baseProduct, normalQuantity: parseInt(quantity, 10) };
  }

  setPromotionQuantity(baseProduct, quantity, promotion) {
    return { ...baseProduct, promotionQuantity: parseInt(quantity, 10), promotion };
  }

  addOrUpdateProduct(name, product) {
    if (this.#products.has(name)) {
      const updatedProduct = this.mergeProductQuantities(this.#products.get(name), product);
      this.#products.set(name, updatedProduct);
      return;
    }
    // #products에 name인 제품이 존재하지 않는 경우
    this.#products.set(name, product);
  }

  mergeProductQuantities(existingProduct, newProduct) {
    return {
      ...existingProduct,
      normalQuantity: existingProduct.normalQuantity + newProduct.normalQuantity,
      promotionQuantity: existingProduct.promotionQuantity + newProduct.promotionQuantity,
    };
  }

  hasProduct(name) {
    return this.#products.has(name);
  }

  getProduct(name) {
    return this.#products.get(name);
  }
}
