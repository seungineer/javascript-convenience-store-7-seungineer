export default class {
  calculateBaseTotal(cart) {
    return cart.reduce((acc, item) => {
      return acc + item.price * (item.normalQuantity + item.promotionQuantity);
    }, 0);
  }
}
