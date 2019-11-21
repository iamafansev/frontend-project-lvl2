import genDiff from '../src';

const filePath1 = '/Users/mac/Desktop/before.json';
const filePath2 = '/Users/mac/Desktop/after.json';

const result = `{
    host: hexlet.io
  + timeout: 20
  - timeout: 50
  - proxy: 123.234.53.22
  - follow: false
  + verbose: true
}`;

test('JSON flat compare', () => {
  expect(genDiff(filePath1, filePath2)).toEqual(result);
});
