export default class {
  #products;

  constructor() {
    this.#products = new Map();
  }

  initializeFromParsedData(parsedProducts) {
    parsedProducts.forEach(([name, price, quantity, promotion]) => {
      const product = {
        price: parseInt(price, 10),
        normalQuantity: promotion === 'null' ? parseInt(quantity, 10) : 0,
        promotionQuantity: promotion !== 'null' ? parseInt(quantity, 10) : 0,
        promotion: promotion === 'null' ? null : promotion,
      };

      if (this.#products.has(name)) {
        // promotion 상태가 다른 name인 상품이 이미 재고에 존재하는 경우
        const existingProduct = this.#products.get(name);
        existingProduct.normalQuantity += product.normalQuantity;
        existingProduct.promotionQuantity += product.promotionQuantity;
      } else {
        this.#products.set(name, product);
      }
    });
  }

  hasProduct(name) {
    if (this.#products.has(name)) return true;
    return false;
  }

  getProduct(name) {
    const product = this.#products.get(name);
    return product;
  }
}
