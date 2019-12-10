import _ from 'lodash';

const getValues = (values) => {
  const keys = Object.keys(values);
  const [key1, key2] = keys;
  const beforeValue = values[key1];
  const afterValue = values[key2];
  if (key1 === 'removed' && key2 === 'added') {
    return {
      beforeValue,
      afterValue,
    };
  }

  return { value: beforeValue };
};

const getStatus = (values) => {
  const keys = Object.keys(values);
  const [key1, key2] = keys;
  if (key1 === 'removed' && key2 === 'added') {
    return 'change';
  }

  return key1;
};

const processValue = (key, value) => {
  const status = getStatus(value);
  const values = getValues(value);

  return {
    name: key,
    status,
    ...values,
  };
};

const processChildren = (name, values) => {
  const children = values.reduce((acc, [key, value]) => (
    value instanceof Array
      ? [...acc, processChildren(key, value)]
      : [...acc, processValue(key, value)]
  ), []);

  return {
    name,
    status: 'change',
    children,
  };
};

const propertyActions = [
  {
    check: (arg) => arg instanceof Array,
    process: (key, value) => processChildren(key, value),
  },
  {
    check: (arg) => arg instanceof Object,
    process: (key, value) => processValue(key, value),
  },
];

const getProcessAction = (arg) => _.find(propertyActions, (({ check }) => check(arg)));

export default (ast) => {
  const result = ast.reduce((acc, [key, value]) => {
    const { process } = getProcessAction(value);
    return [...acc, process(key, value)];
  }, []);

  return `${JSON.stringify(result)}`;
};
