import fs from 'fs';
import path from 'path';
import _ from 'lodash';
import parse from './parsers';

const getData = (pathToFile) => fs.readFileSync(pathToFile, 'utf-8');
const getTypeFile = (pathToFile) => path.extname(pathToFile).slice(1);
const isChildren = (value) => value instanceof Object;

const getParseData = (pathToFile) => {
  const absolutePath = path.resolve(pathToFile);
  const data = parse(getTypeFile(absolutePath), getData(absolutePath));
  return data;
};

const genDiff = (data1, data2) => {
  const keys = _.uniq([...Object.keys(data1), ...Object.keys(data2)]);

  const result = keys.reduce((acc, key) => {
    const value1 = data1[key];
    const value2 = data2[key];

    if (isChildren(value1) && isChildren(value2)) {
      return [...acc, [`  ${key}`, genDiff(value1, value2)]];
    }

    if (_.has(data1, key) && _.has(data2, key)) {
      return (value1 === value2) ? [...acc, [`  ${key}`, value1]]
        : [...acc, [`+ ${key}`, value2], [`- ${key}`, value1]];
    }

    return !_.has(data2, key) ? [...acc, [`- ${key}`, value1]] : [...acc, [`+ ${key}`, value2]];
  }, []);

  return result;
};

const stringify = (ast, spaceCount, separator = '\n') => {
  const keys = Object.keys(ast);

  const result = keys.reduce((acc, key) => {
    const value = ast[key];

    if (value instanceof Object) {
      return `${acc}${separator}${' '.repeat(spaceCount + 2)}${key}: ${stringify(value, spaceCount + 4)}`;
    }

    return `${acc}${separator}${' '.repeat(spaceCount + 2)}${key}: ${value}`;
  }, '');

  return `{${result}${separator}${' '.repeat(spaceCount - 2)}}`;
};

const renderDiff = (diff, spaceCount = 2) => {
  const result = diff.reduce((acc, [key, value]) => {
    if (Array.isArray(value)) {
      return `${acc}\n${' '.repeat(spaceCount)}${key}: ${renderDiff(value, spaceCount + 4)}`;
    }

    if (value instanceof Object) {
      return `${acc}\n${' '.repeat(spaceCount)}${key}: ${stringify(value, spaceCount + 4)}`;
    }

    return `${acc}\n${' '.repeat(spaceCount)}${key}: ${value}`;
  }, '');

  return `{${result}\n${' '.repeat(spaceCount - 2)}}`;
};

export default (pathToFile1, pathToFile2) => (
  renderDiff(genDiff(getParseData(pathToFile1), getParseData(pathToFile2))));

// const pathToFile1 = './__fixtures__/before.json';
// const pathToFile2 = './__fixtures__/after.json';

// const parseData1 = getParseData(pathToFile1);
// const parseData2 = getParseData(pathToFile2);


// const result = renderDiff(genDiff(parseData1, parseData2));
// console.log(result);
