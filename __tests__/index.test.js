import fs from 'fs';
import { resolve } from 'path';
import genDiff from '../src';

const result = fs.readFileSync('./__fixtures__/diff', 'utf-8');

const beforeEmpty = './__fixtures__/beforeEmpty.json';
const afterEmpty = './__fixtures__/afterEmpty.json';

const beforeJson = './__fixtures__/before.json';
const afterJson = './__fixtures__/after.json';

const beforeYml = './__fixtures__/before.yml';
const afterYml = './__fixtures__/after.yml';

// const beforeIni = './__fixtures__/before.ini';
// const afterIni = './__fixtures__/after.ini';

const absolutePath1 = resolve(beforeJson);
const absolutePath2 = resolve(afterJson);

test('absolutePath', () => {
  expect(genDiff(absolutePath1, absolutePath2)).toEqual(result);
});

test('compare empty files', () => {
  expect(genDiff(beforeEmpty, afterEmpty)).toEqual('{\n}');
});

describe('compar files', () => {
  test('JSON compare', () => {
    expect(genDiff(beforeJson, afterJson)).toEqual(result);
  });

  test('YML compare', () => {
    expect(genDiff(beforeYml, afterYml)).toEqual(result);
  });

  // test('ini compare', () => {
  //   expect(genDiff(flatIni1, flatIni2)).toEqual(result);
  // });
});
