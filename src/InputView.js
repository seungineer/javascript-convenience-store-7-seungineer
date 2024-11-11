import { Console } from '@woowacourse/mission-utils';

const InputView = {
  async readPurchaseInput() {
    const regex = /\[([가-힣]+)-(\d+)\]/g;
    const result = [];
    let match;

    const inputString = await Console.readLineAsync(
      '구매하실 상품명과 수량을 입력해 주세요. (예: [사이다-2],[감자칩-1])\n',
    );

    while ((match = regex.exec(inputString)) !== null) {
      const product = match[1];
      const quantity = parseInt(match[2], 10);
      result.push([product, quantity]);
    }
    return result;
  },
};

export default InputView;
