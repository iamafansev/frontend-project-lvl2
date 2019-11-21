import fs from 'fs';
import { resolve } from 'path';
import genDiff from '../src';

const result = fs.readFileSync('./__fixtures__/diffFlatJson', 'utf-8');

const filePath1 = './__fixtures__/before.json';
const filePath2 = './__fixtures__/after.json';

const absolutePath1 = resolve(filePath1);
const absolutePath2 = resolve(filePath2);

test('absolutePath', () => {
  expect(genDiff(absolutePath1, absolutePath2)).toEqual(result);
});

test('JSON flat compare', () => {
  expect(genDiff(filePath1, filePath2)).toEqual(result);
});
