const getCorrectValue = (value) => {
  const formedValue = typeof value === 'string' ? `'${value}'` : value;
  return value instanceof Object ? '[complex value]' : formedValue;
};

const processValue = (node, path) => {
  const beginningLine = `Property ${path} was`;

  if (node.type === 'changed') {
    return `${beginningLine} updated. From ${getCorrectValue(node.oldValue)} to ${getCorrectValue(node.newValue)}`;
  }

  if (node.type === 'added') {
    return `${beginningLine} added with value: ${getCorrectValue(node.value)}`;
  }

  return `${beginningLine} removed`;
};

const actionsByType = {
  nested: ({ children }, path, fn) => fn(children, path),
  changed: (node, path) => processValue(node, path),
  deleted: (node, path) => processValue(node, path),
  added: (node, path) => processValue(node, path),
};

const renderDiff = (ast, root = '') => {
  const result = ast
    .filter(({ type }) => type !== 'unchanged')
    .reduce((acc, node) => {
      const path = (root === '') ? node.key : `${root}.${node.key}`;
      return [...acc, actionsByType[node.type](node, path, renderDiff)];
    }, []);

  return `${result.join('\n')}`;
};

export default renderDiff;
