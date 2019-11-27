import fs from 'fs';
import { resolve } from 'path';
import genDiff from '../src';

const result = fs.readFileSync('./__fixtures__/diffFlatJson', 'utf-8');

const flatJsonEmpty1 = './__fixtures__/beforeEmpty.json';
const flatJsonEmpty2 = './__fixtures__/afterEmpty.json';

const flatJson1 = './__fixtures__/before.json';
const flatJson2 = './__fixtures__/after.json';

const flatYml1 = './__fixtures__/beforeFlat.yml';
const flatYml2 = './__fixtures__/afterFlat.yml';

const absolutePath1 = resolve(flatJson1);
const absolutePath2 = resolve(flatJson2);
console.log();
test('absolutePath', () => {
  expect(genDiff(absolutePath1, absolutePath2)).toEqual(result);
});

test('JSON flat compare', () => {
  expect(genDiff(flatJson1, flatJson2)).toEqual(result);
  expect(genDiff(flatJsonEmpty1, flatJsonEmpty2)).toEqual('{\n  \n}');
});

test('YML flat compare', () => {
  expect(genDiff(flatYml1, flatYml2)).toEqual(result);
});
