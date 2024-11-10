const fs = require('fs');
const { DateTimes } = require('@woowacourse/mission-utils');
const { default: ERRORMESSAGES } = require('../constants/ERRORMESSAGES');
const { default: SYSTEM } = require('../constants/SYSTEM');

function parseData(fileContent) {
  const dataRows = fileContent.split('\n');
  const contentWithoutHeader = dataRows.slice(1, dataRows.length);
  return contentWithoutHeader.map((row) => row.split(',').map((item) => item.trim()));
}

function readProductsFile(filePath) {
  try {
    const ProductsListString = fs.readFileSync(filePath, 'utf-8');
    return ProductsListString.trim();
  } catch (error) {
    throw new Error(ERRORMESSAGES.PRODUCTS_NOT_FOUND);
  }
}

function readFileContent(filePath) {
  return fs.readFileSync(filePath, SYSTEM.ENCODING).trim();
}

function getTodayDate() {
  return DateTimes.now().toISOString().split(SYSTEM.DATE_DELIMITER)[0];
}

function addPromotionIfValid(promotions, data, today) {
  const [name, buy, get, startDate, endDate] = data;
  if (today >= startDate && today <= endDate) {
    promotions.set(name, { buy: parseInt(buy, 10), get: parseInt(get, 10) });
  }
}

function loadPromotions(filePath) {
  try {
    const promotions = new Map();
    const parsedData = parseData(readFileContent(filePath));
    const today = getTodayDate();

    parsedData.forEach((data) => addPromotionIfValid(promotions, data, today));

    return promotions;
  } catch (error) {
    throw new Error(ERRORMESSAGES.PROMOTIONS_NOT_FOUND);
  }
}

module.exports = { readProductsFile, parseData, loadPromotions };
