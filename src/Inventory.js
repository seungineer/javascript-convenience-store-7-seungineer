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

  createProduct([name, price, quantity, promotion]) {
    const baseProduct = {
      price: parseInt(price, 10),
      normalQuantity: 0,
      promotionQuantity: 0,
      promotion: null,
    };

    return this.setQuantities(baseProduct, quantity, promotion);
  }

  setQuantities(baseProduct, quantity, promotion) {
    if (promotion === 'null') {
      return this.setNormalQuantity(baseProduct, quantity);
    }
    return this.setPromotionQuantity(baseProduct, quantity, promotion);
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
