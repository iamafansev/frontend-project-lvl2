import fs from 'fs';
import path from 'path';
import _ from 'lodash';
import parse from './parsers';
import render from './formaters';

const getData = (pathToFile) => fs.readFileSync(pathToFile, 'utf-8');
const getTypeFile = (pathToFile) => path.extname(pathToFile).slice(1);

const getParsedData = (pathToFile) => {
  const absolutePath = path.resolve(pathToFile);
  const data = parse(getTypeFile(absolutePath), getData(absolutePath));
  return data;
};

const getAst = (data1, data2) => {
  const keys = _.union(Object.keys(data1), Object.keys(data2));

  return keys.map((key) => {
    if (data1[key] instanceof Object && data2[key] instanceof Object) {
      return { key, type: 'nested', children: getAst(data1[key], data2[key]) };
    }

    if (_.has(data1, key) && _.has(data2, key) && (data1[key] === data2[key])) {
      return { key, type: 'unchanged', value: data1[key] };
    }

    if (_.has(data1, key) && _.has(data2, key) && (data1[key] !== data2[key])) {
      return {
        key, type: 'changed', oldValue: data1[key], newValue: data2[key],
      };
    }

    if (_.has(data1, key) && !_.has(data2, key)) {
      return { key, type: 'deleted', value: data1[key] };
    }

    return { key, type: 'added', value: data2[key] };
  });
};

const genDiff = (pathToFile1, pathToFile2, format = 'nest') => {
  const diff = getAst(getParsedData(pathToFile1), getParsedData(pathToFile2));
  return render(format, diff);
};

export default genDiff;

// const pathToFile1 = './__fixtures__/before.json';
// const pathToFile2 = './__fixtures__/after.json';

// console.log(getAst(getParsedData(pathToFile1), getParsedData(pathToFile2))[0].children);
// console.log(genDiff(pathToFile1, pathToFile2, 'json'));
