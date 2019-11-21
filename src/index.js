import fs from 'fs';
import { resolve } from 'path';
import _ from 'lodash';

const genDiff = (pathToFile1, pathToFile2) => {
  const absolutePath1 = resolve(pathToFile1);
  const absolutePath2 = resolve(pathToFile2);
  const data1 = JSON.parse(fs.readFileSync(absolutePath1, 'utf-8'));
  const data2 = JSON.parse(fs.readFileSync(absolutePath2, 'utf-8'));
  const keys = _.uniq([...Object.keys(data1), ...Object.keys(data2)]);

  const result = keys.reduce((acc, key) => {
    const value1 = data1[key];
    const value2 = data2[key];
    if (_.has(data1, key) && _.has(data2, key)) {
      return (value1 === value2) ? [...acc, `  ${key}: ${value1}`]
        : [...acc, `+ ${key}: ${value2}`, `- ${key}: ${value1}`];
    }

    return !_.has(data2, key) ? [...acc, `- ${key}: ${value1}`] : [...acc, `+ ${key}: ${value2}`];
  }, []);

  return `{\n  ${result.join('\n  ')}\n}`;
};

export default genDiff;
