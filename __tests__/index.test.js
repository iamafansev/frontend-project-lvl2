import fs from 'fs';
import { resolve } from 'path';
import genDiff from '../src';

const resultNest = fs.readFileSync('./__fixtures__/result/diff', 'utf-8');
const resultPlain = fs.readFileSync('./__fixtures__/result/plainDiff', 'utf-8');
const resultJson = fs.readFileSync('./__fixtures__/result/jsonDiff.json', 'utf-8');

const beforeEmpty = './__fixtures__/beforeEmpty.json';
const afterEmpty = './__fixtures__/afterEmpty.json';

const beforeJson = './__fixtures__/before.json';
const afterJson = './__fixtures__/after.json';

const beforeYml = './__fixtures__/before.yml';
const afterYml = './__fixtures__/after.yml';

const beforeIni = './__fixtures__/before.ini';
const afterIni = './__fixtures__/after.ini';

const absolutePath1 = resolve(beforeJson);
const absolutePath2 = resolve(afterJson);

test('absolutePath', () => {
  expect(genDiff(absolutePath1, absolutePath2)).toEqual(resultNest);
});

test('compare empty files', () => {
  expect(genDiff(beforeEmpty, afterEmpty)).toEqual('{\n}');
});

describe('compar files', () => {
  test('JSON compare', () => {
    expect(genDiff(beforeJson, afterJson)).toEqual(resultNest);
  });

  test('YML compare', () => {
    expect(genDiff(beforeYml, afterYml)).toEqual(resultNest);
  });

  test('ini compare', () => {
    expect(genDiff(beforeIni, afterIni)).toEqual(resultNest);
  });
});

describe('compar files (plain output)', () => {
  test('JSON compare', () => {
    expect(genDiff(beforeJson, afterJson, 'plain')).toEqual(resultPlain);
  });

  test('YML compare', () => {
    expect(genDiff(beforeYml, afterYml, 'plain')).toEqual(resultPlain);
  });

  test('ini compare', () => {
    expect(genDiff(beforeIni, afterIni, 'plain')).toEqual(resultPlain);
  });
});

describe('compar files (json output)', () => {
  test('JSON compare', () => {
    expect(genDiff(beforeJson, afterJson, 'json')).toEqual(resultJson);
  });

  test('YML compare', () => {
    expect(genDiff(beforeYml, afterYml, 'json')).toEqual(resultJson);
  });
});
