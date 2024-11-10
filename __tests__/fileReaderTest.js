const fs = require('fs');
const { DateTimes } = require('@woowacourse/mission-utils');
const { readProductsFile, parseData, loadPromotions } = require('../src/utils/fileReader');
const { default: ERRORMESSAGES } = require('../src/constants/ERRORMESSAGES');

const PRODUCTS_FILE_CONTENT = 'name,price,quantity,promotion\n콜라,1000,10,탄산2+1\n콜라,1000,5,null';
const FILE_PATH = 'public/products.md';
const PARSED_PRODUCTS = [
  ['콜라', '1000', '10', '탄산2+1'],
  ['콜라', '1000', '5', 'null'],
];

jest.mock('fs');

describe('fileReader 함수', () => {
  test('파일의 데이터를 문자열로 반환', () => {
    fs.readFileSync.mockReturnValue(PRODUCTS_FILE_CONTENT);

    const result = readProductsFile(FILE_PATH);
    expect(result).toBe(PRODUCTS_FILE_CONTENT);
  });

  test('파일이 존재하지 않을 때 [ERROR]로 시작하는 에러 발생', () => {
    fs.readFileSync.mockImplementation(() => {
      throw new Error();
    });
    expect(() => readProductsFile(FILE_PATH)).toThrow('[ERROR] products.md 파일을 찾을 수 없습니다.');
  });
});

describe('parseData 함수', () => {
  test('데이터를 배열로 parsing', () => {
    const fileContent = PRODUCTS_FILE_CONTENT;

    const result = parseData(fileContent);
    expect(result).toEqual(PARSED_PRODUCTS);
  });
});

jest.mock('fs');
jest.spyOn(DateTimes, 'now');

describe('loadPromotions 함수', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('현재 날짜에서 유효한 프로모션만 로드', () => {
    DateTimes.now.mockReturnValue(new Date('2024-11-15T00:00:00Z'));

    fs.readFileSync.mockReturnValue(
      'name,buy,get,start_date,end_date\n탄산2+1,2,1,2024-01-01,2024-12-31\nMD추천상품,1,1,2024-01-01,2024-12-31\n반짝할인,1,1,2024-11-01,2024-10-30',
    );

    const promotions = loadPromotions('mockPath/promotions.md');

    expect(promotions.size).toBe(2);
    expect(promotions.get('탄산2+1')).toEqual({ buy: 2, get: 1 });
    expect(promotions.get('MD추천상품')).toEqual({ buy: 1, get: 1 });
  });

  test('현재 날짜가 프로모션 기간에 포함되지 않은 경우 로드하지 않음', () => {
    DateTimes.now.mockReturnValue(new Date('2025-01-01T00:00:00Z'));

    fs.readFileSync.mockReturnValue(
      'name,buy,get,start_date,end_date\n탄산2+1,2,1,2024-01-01,2024-12-31\nMD추천상품,1,1,2024-01-01,2024-12-31\n반짝할인,1,1,2024-11-01,2024-11-30',
    );

    const promotions = loadPromotions('mockPath/promotions.md');

    expect(promotions.size).toBe(0);
  });

  test('파일이 존재하지 않을 때 에러 발생', () => {
    fs.readFileSync.mockImplementation(() => {
      throw new Error('File not found');
    });

    expect(() => loadPromotions('invalidPath/promotions.md')).toThrow(ERRORMESSAGES.PROMOTIONS_NOT_FOUND);
  });
});
