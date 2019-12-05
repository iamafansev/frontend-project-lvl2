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
  .filter(([, value]) => !_.has(value, 'unchanged'))
  .reduce((acc, [key, value]) => {
    const path = `${root}.${key}`;
    return value instanceof Array
      ? [...acc, ...processChildren(value, path)]
      : [...acc, `Property ${path} was ${buildValuesString(value)}`];
  }, []);

const processValue = (value, root) => (
  _.has(value, 'unchanged') ? false : [`Property ${root} was ${buildValuesString(value)}`]
);

const propertyActions = [
  {
    check: (arg) => arg instanceof Array,
    process: (value, key) => processChildren(value, key),
  },
  {
    check: (arg) => arg instanceof Object,
    process: (value, key) => processValue(value, key),
  },
];

const getProcessAction = (arg) => _.find(propertyActions, (({ check }) => check(arg)));

export default (ast) => {
  const result = ast.reduce((acc, [key, value]) => {
    const { process } = getProcessAction(value);
    return [...acc, ...process(value, key)];
  }, []);

  return `${result.join('\n')}`;
};
