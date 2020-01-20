import fs from 'fs';
import path from 'path';
import genDiff from '../src';

let resultNest;
let resultPlain;
let resultJson;

const buildPath = (fileName) => path.join(__dirname, '..', '__fixtures__', fileName);

beforeAll(() => {
  resultNest = fs.readFileSync(buildPath('result/diff'), 'utf-8');
  resultPlain = fs.readFileSync(buildPath('result/plainDiff'), 'utf-8');
  resultJson = fs.readFileSync(buildPath('result/jsonDiff.json'), 'utf-8');
});

const prefixesAndFilePaths = ['json', 'yml', 'ini'].map((prefix) => (
  [prefix, buildPath(`before.${prefix}`), buildPath(`after.${prefix}`)]
));

const filePathEmptyFile1 = buildPath('beforeEmpty.json');
const filePathEmptyFile2 = buildPath('afterEmpty.json');

test('compare empty files', () => {
  expect(genDiff(filePathEmptyFile1, filePathEmptyFile2)).toEqual('{\n\n}');
});

describe('compar files (nest output)', () => {
  test.each(prefixesAndFilePaths)('%s compare', (prefix, filePathBefore, filePathAfter) => {
    expect(genDiff(filePathBefore, filePathAfter, 'nest')).toEqual(resultNest);
  });
});

describe('compar files (plain output)', () => {
  test.each(prefixesAndFilePaths)('%s compare', (prefix, filePathBefore, filePathAfter) => {
    expect(genDiff(filePathBefore, filePathAfter, 'plain')).toEqual(resultPlain);
  });
});

// done without using test.each, because there is a bug with ini format.
describe('compar files (json output)', () => {
  test('json compare', () => {
    expect(genDiff(buildPath('before.json'), buildPath('after.json'), 'json')).toEqual(resultJson);
  });
  test('yml compare', () => {
    expect(genDiff(buildPath('before.yml'), buildPath('after.yml'), 'json')).toEqual(resultJson);
  });
});
