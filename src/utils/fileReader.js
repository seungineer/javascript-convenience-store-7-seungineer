const fs = require('fs');
const { DateTimes } = require('@woowacourse/mission-utils');
const { default: ERRORMESSAGES } = require('../constants/ERRORMESSAGES');
const { default: SYSTEM } = require('../constants/SYSTEM');

function readMarkdownFile(filePath, errorMessage) {
  try {
    return fs.readFileSync(filePath, SYSTEM.ENCODING).trim();
  } catch (error) {
    throw new Error(errorMessage);
  }
}

function parseData(fileContent) {
  const dataRows = fileContent.split('\n');
  const contentWithoutHeader = dataRows.slice(1, dataRows.length);
  return contentWithoutHeader.map((row) => row.split(',').map((item) => item.trim()));
}

function readProductsFile(filePath) {
  return readMarkdownFile(filePath, ERRORMESSAGES.PRODUCTS_NOT_FOUND);
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

function readPromotionsFile(filePath) {
  const promotions = new Map();
  const fileContent = readMarkdownFile(filePath, ERRORMESSAGES.PROMOTIONS_MD_NOT_FOUND);
  const parsedData = parseData(fileContent);
  const today = getTodayDate();

  parsedData.forEach((data) => addPromotionIfValid(promotions, data, today));

  return promotions;
}

module.exports = { readProductsFile, parseData, readPromotionsFile };
