import fs from 'fs';
import { resolve } from 'path';
import genDiff from '../src';

let resultNest;
let resultPlain;
let resultJson;

beforeAll(() => {
  resultNest = fs.readFileSync('./__fixtures__/result/diff', 'utf-8');
  resultPlain = fs.readFileSync('./__fixtures__/result/plainDiff', 'utf-8');
  resultJson = fs.readFileSync('./__fixtures__/result/jsonDiff.json', 'utf-8');
});

const prefixesAndFilePaths = [
  ['json', './__fixtures__/before.json', './__fixtures__/after.json'],
  ['yml', './__fixtures__/before.yml', './__fixtures__/after.yml'],
  ['ini', './__fixtures__/before.ini', './__fixtures__/after.ini'],
];

const absolutePath1 = resolve('./__fixtures__/before.json');
const absolutePath2 = resolve('./__fixtures__/after.json');

test('compare empty files', () => {
  expect(genDiff('./__fixtures__/beforeEmpty.json', './__fixtures__/afterEmpty.json')).toEqual('{\n\n}');
});

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
    expect(genDiff('./__fixtures__/before.json', './__fixtures__/after.json', 'json')).toEqual(resultJson);
  });
  test('yml compare', () => {
    expect(genDiff('./__fixtures__/before.yml', './__fixtures__/after.yml', 'json')).toEqual(resultJson);
  });
});
