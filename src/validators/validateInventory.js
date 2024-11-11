export function validateProductExistence(product, name) {
  if (!product) {
    throw new Error(`[ERROR] 상품 '${name}'을 찾을 수 없습니다.`);
  }
}

export function validateSufficientStock(product, quantity) {
  let maxQuantity;
  if (product.isPromotionApplied) {
    maxQuantity = product.normalQuantity + product.promotionQuantity;
  } else {
    maxQuantity = product.normalQuantity;
  }
  if (quantity > maxQuantity) throw new Error('[ERROR] 재고 수량을 초과하여 구매할 수 없습니다. 다시 입력해 주세요.');
}
