const getValues = (values) => {
  const keys = Object.keys(values);
  const [key1, key2] = keys;
  const beforeValue = values[key1];
  const afterValue = values[key2];
  if (key1 === 'removed' && key2 === 'added') {
    return `"beforeValue":${JSON.stringify(beforeValue)},"afterValue":${JSON.stringify(afterValue)}`;
  }

  return `"value":${JSON.stringify(beforeValue)}`;
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
  return [`{"name":"${key}","status":"${status}",${values}}`];
};

const processChildren = (name, values) => {
  const processedChildren = values.reduce((acc, { key, value, children }) => (
    children
      ? [...acc, processChildren(key, children)]
      : [...acc, processValue(key, value)]
  ), []);
  return [`{"name":"${name}","status":"change","children":[${processedChildren}]}`];
};

export default (ast) => {
  const result = ast.reduce((acc, { key, value, children }) => (
    children
      ? [...acc, ...processChildren(key, children)]
      : [...acc, ...processValue(key, value)]
  ), []);

  return `[${result.join(',')}]`;
};
