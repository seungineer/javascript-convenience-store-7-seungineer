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

    inventory.setPromotionData(promotion);

    OutputView.printWelcomeMessage();
    inventory.displayProductList();

    const customerPicksItem = await InputView.readPurchaseInput();
    for (const [productName, quantity] of customerPicksItem) {
      await purchaseManager.processPurchase(productName, quantity);
    }
    const purchaseHistory = purchaseManager.getReceipt();
  }
}

export default App;
