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

const flatIni1 = './__fixtures__/beforeFlat.ini';
const flatIni2 = './__fixtures__/afterFlat.ini';

const absolutePath1 = resolve(flatJson1);
const absolutePath2 = resolve(flatJson2);

test('absolutePath', () => {
  expect(genDiff(absolutePath1, absolutePath2)).toEqual(result);
});

describe('flat file compar', () => {
  test('JSON compare', () => {
    expect(genDiff(flatJson1, flatJson2)).toEqual(result);
    expect(genDiff(flatJsonEmpty1, flatJsonEmpty2)).toEqual('{\n  \n}');
  });

  test('YML compare', () => {
    expect(genDiff(flatYml1, flatYml2)).toEqual(result);
  });

  test('ini compare', () => {
    expect(genDiff(flatIni1, flatIni2)).toEqual(result);
  });
});
