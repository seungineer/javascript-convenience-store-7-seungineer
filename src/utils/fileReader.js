const fs = require('fs');
const { default: ERRORMESSAGES } = require('../constants/ERRORMESSAGES');

function readProductsFile(filePath) {
  try {
    const ProductsListString = fs.readFileSync(filePath, 'utf-8');
    return ProductsListString.trim();
  } catch (error) {
    throw new Error(ERRORMESSAGES.PRODUCTS_NOT_FOUND);
  }
}

module.exports = { readProductsFile };
