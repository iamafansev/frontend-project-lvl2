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

const getDiff = (data1, data2) => {
  const keys = _.union(Object.keys(data1), Object.keys(data2));

  return keys.map((key) => {
    const value1 = data1[key];
    const value2 = data2[key];

    if (isChildren(value1) && isChildren(value2)) {
      return [key, getDiff(value1, value2)];
    }

    if (_.has(data1, key) && _.has(data2, key)) {
      return (value1 === value2) ? [key, { unchanged: value1 }]
        : [key, { removed: value1, added: value2 }];
    }

    return !_.has(data2, key)
      ? [key, { removed: value1 }]
      : [key, { added: value2 }];
  });
};

const genDiff = (pathToFile1, pathToFile2, format = 'nest') => {
  const diff = getDiff(getParseData(pathToFile1), getParseData(pathToFile2));
  return render(format, diff);
};

export default genDiff;

// const pathToFile1 = './__fixtures__/before.json';
// const pathToFile2 = './__fixtures__/after.json';

// console.log(genDiff(pathToFile1, pathToFile2, 'json'));
