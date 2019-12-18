import _ from 'lodash';

const getCorrectValue = (value) => (
  value instanceof Object ? '[complex value]' : value
);

const buildValuesString = (values) => {
  const [key1, key2] = Object.keys(values);

  if (key1 === 'removed' && key2 === 'added') {
    return `updated. from ${getCorrectValue(values[key1])} to '${getCorrectValue(values[key2])}'`;
  }

  if (key1 === 'added') {
    return `added with value: ${getCorrectValue(values[key1])}`;
  }

  return 'removed';
};

const processChildren = (elements, root) => elements
  .filter(({ value }) => !_.has(value, 'unchanged'))
  .reduce((acc, { key, value, children }) => {
    const path = `${root}.${key}`;
    return children
      ? [...acc, ...processChildren(children, path)]
      : [...acc, `Property ${path} was ${buildValuesString(value)}`];
  }, []);

const processValue = (value, root) => (
  _.has(value, 'unchanged') ? false : [`Property ${root} was ${buildValuesString(value)}`]
);

export default (ast) => {
  const result = ast.reduce((acc, { key, value, children }) => {
    if (children) {
      return [...acc, ...processChildren(children, key)];
    }

    return [...acc, ...processValue(value, key)];
  }, []);

  return `${result.join('\n')}`;
};
