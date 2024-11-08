export default class {
  constructor(products) {
    this.products = products;
  }

  findProduct(name) {
    return this.products.find((products) => products.name === name);
  }

  checkQuantity(product, requestedQuantity) {
    return (
      requestedQuantity <= product.normalQuantity + product.promotionQuantity
    );
  }

  checkStock(name, requestedQuantity) {
    const product = this.findProduct(name);
    if (product !== undefined) {
      const hasStock = this.checkQuantity(product, requestedQuantity);
      return hasStock;
    }
    return false;
  }
}
