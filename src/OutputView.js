import { Console } from '@woowacourse/mission-utils';

export default {
  printWelcomeMessage() {
    Console.print('안녕하세요. W편의점입니다.');
    Console.print('현재 보유하고 있는 상품입니다.\n');
  },

  printProductList(productList) {
    productList.forEach((product) => {
      const { name, price, promotionQuantity, normalQuantity, promotion, isPromotionApplied } = product;
      const promotionText = this.getPromotionText(promotion);
      this.printNormalAndPromotionProduct(
        name,
        price,
        promotionQuantity,
        normalQuantity,
        promotionText,
        promotion,
        isPromotionApplied,
      );
    });
    Console.print('');
  },

  printNormalAndPromotionProduct(
    name,
    price,
    promotionQuantity,
    normalQuantity,
    promotionText,
    promotion,
    isPromotionApplied,
  ) {
    if (this.hasPromotion(promotion) && isPromotionApplied) {
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

    Console.print(`- ${name} ${price.toLocaleString()}원 ${promotionQuantityText}${promotionText}`);
    Console.print(`- ${name} ${price.toLocaleString()}원 ${normalQuantityText}`);
  },

  printNormalProduct(name, price, normalQuantity) {
    const normalQuantityText = this.getQuantityText(normalQuantity);
    Console.print(`- ${name} ${price.toLocaleString()}원 ${normalQuantityText}`);
  },

  getQuantityText(quantity) {
    if (quantity > 0) {
      return `${quantity}개`;
    }
    return '재고 없음';
  },
  printReceipt(purchaseHistory, isMembershipDiscountApplied) {
    Console.print('\n==============W 편의점================');
    Console.print('상품명\t\t수량\t금액');

    let totalQuantity = 0;
    let totalAmount = 0;
    let promotionDiscount = 0;

    purchaseHistory.forEach(({ name, price, promotionQuantity, normalQuantity, promotionName }) => {
      const quantity = promotionQuantity + normalQuantity;
      const itemTotalPrice = price * quantity;
      totalQuantity += quantity;
      totalAmount += itemTotalPrice;

      Console.print(`${name}\t\t${quantity}\t${itemTotalPrice.toLocaleString()}원`);

      if (promotionQuantity > 0 && promotionName !== 'null') {
        const discountAmount = price * (promotionQuantity - normalQuantity);
        promotionDiscount += discountAmount;
      }
    });

    Console.print('=============증\t정==============');
    purchaseHistory.forEach(({ name, promotionQuantity, promotionName }) => {
      if (promotionQuantity > 0 && promotionName !== 'null') {
        Console.print(`${name}\t\t${promotionQuantity}`);
      }
    });

    const membershipDiscount = isMembershipDiscountApplied ? Math.floor(totalAmount * 0.3) : 0;
    const finalAmount = totalAmount - promotionDiscount - membershipDiscount;

    Console.print('====================================');
    Console.print(`총구매액\t\t${totalQuantity}\t${totalAmount.toLocaleString()}원`);
    Console.print(`행사할인\t\t\t-${promotionDiscount.toLocaleString()}원`);
    Console.print(`멤버십할인\t\t\t-${membershipDiscount.toLocaleString()}원`);
    Console.print(`내실돈\t\t\t${finalAmount.toLocaleString()}원`);
    Console.print('====================================\n');
  },
};
