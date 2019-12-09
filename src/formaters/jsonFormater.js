import _ from 'lodash';

const getValues = (values) => {
  const keys = Object.keys(values);
  const beforeValue = Object.values(values)[0];
  const afterValue = Object.values(values)[1];
  if (keys.length === 2) {
    return {
      beforeValue,
      afterValue,
    };
  }

  return { value: beforeValue };
};

const getStatus = (values) => {
  const keys = Object.keys(values);
  if (keys.length === 2) {
    return 'change';
  }

  return keys[0];
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
