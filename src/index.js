import fs from 'fs';
import path from 'path';
import _ from 'lodash';
import parse from './parsers';
import render from './formaters';

const getData = (pathToFile) => fs.readFileSync(pathToFile, 'utf-8');
const getTypeFile = (pathToFile) => path.extname(pathToFile).slice(1);
const isChildren = (value) => value instanceof Object;

const getParseData = (pathToFile) => {
  const absolutePath = path.resolve(pathToFile);
  const data = parse(getTypeFile(absolutePath), getData(absolutePath));
  return data;
};

const buildNode = (name, value = '', status = '', root = [], ...children) => (
  {
    name,
    value,
    status,
    root,
    children,
  }
);

const getDiff = (data1, data2) => {
  const keys = [...new Set(
    [...Object.keys(data1), ...Object.keys(data2)],
  )];

  return keys.reduce((acc, key) => {
    const value1 = data1[key];
    const value2 = data2[key];

    if (isChildren(value1) && isChildren(value2)) {
      return [...acc, buildNode(key, '', '', [], ...getDiff(value1, value2))];
    }
    if (_.has(data1, key) && _.has(data2, key)) {
      if (value1 === value2) {
        return [...acc, buildNode(key, value1, '')];
      }
      return [...acc, buildNode(key, value2, 'key added'), buildNode(key, value1, 'key removed')];
    }

    return !_.has(data2, key)
      ? [...acc, buildNode(key, value1, 'key removed')]
      : [...acc, buildNode(key, value2, 'key added')];
  }, []);
};

const genDiff = (pathToFile1, pathToFile2, format = 'nest') => {
  const diff = getDiff(getParseData(pathToFile1), getParseData(pathToFile2));
  return render(format, diff);
};

export default genDiff;

const pathToFile1 = './__fixtures__/before.json';
const pathToFile2 = './__fixtures__/after.json';

const result = getDiff(getParseData(pathToFile1), getParseData(pathToFile2));
// const result = genDiff(pathToFile1, pathToFile2);
console.log(result);
