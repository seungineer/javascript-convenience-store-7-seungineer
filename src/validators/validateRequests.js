export function validateAffordToBuy(product, name, quantity) {
  if (product === undefined) {
    throw new Error('[ERROR] 존재하지 않는 상품입니다. 다시 입력해 주세요.');
  }

  if (product.normalQuantity + product.promotionQuantity < quantity) {
    throw new Error('[ERROR] 재고 수량을 초과하여 구매할 수 없습니다. 다시 입력해 주세요.');
  }
}

export default { validateAffordToBuy };
