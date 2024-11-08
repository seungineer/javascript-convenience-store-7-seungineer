const fs = require('fs');
const { readProductsFile } = require('../src/utils/fileReader');

const PRODUCTS_FILE =
  'name,price,quantity,promotion\n콜라,1000,10,탄산2+1,콜라,1000,10,null';
const FILE_PATH = 'public/products.md';

jest.mock('fs');

describe('fileReader 함수', () => {
  test('파일의 데이터를 문자열로 반환', () => {
    fs.readFileSync.mockReturnValue(PRODUCTS_FILE);

    const result = readProductsFile(FILE_PATH);
    expect(result).toBe(PRODUCTS_FILE);
  });

  test('파일이 존재하지 않을 때 [ERROR]로 시작하는 에러 발생', () => {
    fs.readFileSync.mockImplementation(() => {
      throw new Error();
    });
    expect(() => readProductsFile(FILE_PATH)).toThrow(
      '[ERROR] products.md 파일을 찾을 수 없습니다.]',
    );
  });
});
