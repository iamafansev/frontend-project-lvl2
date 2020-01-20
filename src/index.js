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

const keyTypes = [
  {
    type: 'nested',
    check: (first, second, key) => (
      (first[key] instanceof Object && second[key] instanceof Object)
      && !(first[key] instanceof Array && second[key] instanceof Array)
    ),
    process: (first, second, fn) => fn(first, second),
  },
  {
    type: 'unchanged',
    check: (first, second, key) => (
      _.has(first, key) && _.has(second, key) && (first[key] === second[key])
    ),
    process: (first) => _.identity(first),
  },
  {
    type: 'changed',
    check: (first, second, key) => (
      _.has(first, key) && _.has(second, key) && (first[key] !== second[key])
    ),
    process: (first, second) => ({ old: first, new: second }),
  },
  {
    type: 'deleted',
    check: (first, second, key) => (_.has(first, key) && !_.has(second, key)),
    process: (first) => _.identity(first),
  },
  {
    type: 'added',
    check: (first, second, key) => (!_.has(first, key) && _.has(second, key)),
    process: (first, second) => _.identity(second),
  },
];

const getAst = (data1, data2) => {
  const keys = _.union(Object.keys(data1), Object.keys(data2));

  return keys.map((key) => {
    const { type, process } = _.find(keyTypes, ({ check }) => check(data1, data2, key));
    const result = process(data1[key], data2[key], getAst);
    const valueOrChildren = type === 'nested' ? 'children' : 'value';
    return { name: key, type, [valueOrChildren]: result };
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
