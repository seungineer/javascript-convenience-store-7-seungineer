import { Console } from '@woowacourse/mission-utils';
import OutputView from './OutputView.js';
import Inventory from './Inventory.js';
import Promotion from './Promotion.js';
import fileReader from './utils/fileReader.cjs';
import InputView from './InputView.js';
import PurchaseManager from './PurchaseManager.js';

const { readProductsFile } = fileReader;

class App {
  async run() {
    const inventory = new Inventory();
    const parsedProducts = await readProductsFile('./public/products.md');
    inventory.initializeFromParsedData(parsedProducts);

    const promotion = new Promotion();
    await promotion.initialize();
    const purchaseManager = new PurchaseManager(inventory, promotion);

    inventory.setPromotionData(promotion);

    OutputView.printWelcomeMessage();
    inventory.displayProductList();

    const customerPicksItem = await InputView.readPurchaseInput();
    for (const [productName, quantity] of customerPicksItem) {
      await purchaseManager.processPurchase(productName, quantity);
    }
    const purchaseHistory = purchaseManager.getReceipt();
    const isMembershipDiscountApplied = await Console.readLineAsync('멤버십 할인을 받으시겠습니까? (Y/N)');
    OutputView.printReceipt(purchaseHistory, isMembershipDiscountApplied); // 최종 영수증 출력
  }
}

export default App;
