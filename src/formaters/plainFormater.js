const getCorrectValue = (value) => {
  const formedValue = typeof value === 'string' ? `'${value}'` : value;
  return value instanceof Object ? '[complex value]' : formedValue;
};

const actionsByType = {
  unchanged: (value) => `updated. From ${getCorrectValue(value.old)} to ${getCorrectValue(value.new)}`,
  changed: (value) => `updated. From ${getCorrectValue(value.old)} to ${getCorrectValue(value.new)}`,
  deleted: () => 'removed',
  added: (value) => `added with value: ${getCorrectValue(value)}`,
};

const processValue = (path, { type, value }) => (
  `Property ${path} was ${actionsByType[type](value)}`
);

const processChildren = (elements, root) => elements
  .filter(({ type }) => type !== 'unchanged')
  .reduce((acc, node) => {
    const path = `${root}.${node.key}`;
    return node.type === 'nested'
      ? [...acc, ...processChildren(node.children, path)]
      : [...acc, processValue(path, node)];
  }, []);

const renderDiff = (ast) => {
  const result = ast.reduce((acc, node) => {
    const path = node.key;
    return node.type === 'nested'
      ? [...acc, ...processChildren(node.children, path)]
      : [...acc, processValue(path, node)];
  }, []);

  return `${result.join('\n')}`;
};

export default renderDiff;
