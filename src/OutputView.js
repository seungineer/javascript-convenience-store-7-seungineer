import { Console } from '@woowacourse/mission-utils';

export default {
  printWelcomeMessage() {
    Console.print('안녕하세요. W편의점입니다.');
    Console.print('현재 보유하고 있는 상품입니다.\n');
  },

  printProductList(productList) {
    productList.forEach((product) => {
      const { name, price, promotionQuantity, normalQuantity, promotion } = product;
      const promotionText = this.getPromotionText(promotion);
      this.printNormalAndPromotionProduct(name, price, promotionQuantity, normalQuantity, promotionText, promotion);
    });
    Console.print('');
  },

  printNormalAndPromotionProduct(name, price, promotionQuantity, normalQuantity, promotionText, promotion) {
    if (this.hasPromotion(promotion)) {
      this.printPromotionProduct(name, price, promotionQuantity, normalQuantity, promotionText);
    } else {
      this.printNormalProduct(name, price, normalQuantity);
    }
  },

  getPromotionText(promotion) {
    if (promotion && promotion !== 'null') {
      return ` ${promotion}`;
    }
    return '';
  },

  hasPromotion(promotion) {
    return promotion !== 'null';
  },

  printPromotionProduct(name, price, promotionQuantity, normalQuantity, promotionText) {
    const promotionQuantityText = this.getQuantityText(promotionQuantity);
    const normalQuantityText = this.getQuantityText(normalQuantity);

    Console.print(`- ${name} ${price}원 ${promotionQuantityText}${promotionText}`);
    Console.print(`- ${name} ${price}원 ${normalQuantityText}`);
  },

  printNormalProduct(name, price, normalQuantity) {
    const normalQuantityText = this.getQuantityText(normalQuantity);
    Console.print(`- ${name} ${price}원 ${normalQuantityText}`);
  },

  getQuantityText(quantity) {
    if (quantity > 0) {
      return `${quantity}개`;
    }
    return '재고 없음';
  },

  async readPurchaseInput() {
    const inputString = await Console.readLineAsync(
      '구매하실 상품명과 수량을 입력해 주세요. (예: [사이다-2],[감자칩-1])\n',
    );
    return inputString;
  },
};
