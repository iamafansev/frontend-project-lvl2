import fs from 'fs';
import { resolve } from 'path';
import genDiff from '../src';

let resultNest;
let resultPlain;
let resultJson;

const buildPath = (fileName, typePath = 'relative') => {
  const relativePath = `./__fixtures__/${fileName}`;

  return typePath === 'absolute' ? resolve(relativePath) : relativePath;
};

beforeAll(() => {
  resultNest = fs.readFileSync('./__fixtures__/result/diff', 'utf-8');
  resultPlain = fs.readFileSync('./__fixtures__/result/plainDiff', 'utf-8');
  resultJson = fs.readFileSync('./__fixtures__/result/jsonDiff.json', 'utf-8');
});

const prefixesAndFilePaths = ['json', 'yml', 'ini'].map((prefix) => (
  [prefix, buildPath(`before.${prefix}`), buildPath(`after.${prefix}`)]
));

const filePathEmptyFile1 = buildPath('beforeEmpty.json');
const filePathEmptyFile2 = buildPath('afterEmpty.json');

test('compare empty files', () => {
  expect(genDiff(filePathEmptyFile1, filePathEmptyFile2)).toEqual('{\n\n}');
});

const absolutePath1 = buildPath('before.json', 'absolute');
const absolutePath2 = buildPath('after.json', 'absolute');

test('absolutePath', () => {
  expect(genDiff(absolutePath1, absolutePath2)).toEqual(resultNest);
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
