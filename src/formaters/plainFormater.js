const getCorrectValue = (value) => {
  const formedValue = typeof value === 'string' ? `'${value}'` : value;
  return value instanceof Object ? '[complex value]' : formedValue;
};

const buildBeginningLine = (path) => `Property ${path} was`;

const processChangedNode = (node, path) => {
  const endOfLine = `${getCorrectValue(node.oldValue)} to ${getCorrectValue(node.newValue)}`;
  return `${buildBeginningLine(path)} updated. From ${endOfLine}`;
};

const processAddedNode = (node, path) => {
  const endOfLine = getCorrectValue(node.value);
  return `${buildBeginningLine(path)} added with value: ${endOfLine}`;
};

const processDeletedNode = (node, path) => `${buildBeginningLine(path)} removed`;

const actionsByType = {
  nested: ({ children }, path, fn) => fn(children, path),
  changed: (node, path) => processChangedNode(node, path),
  deleted: (node, path) => processDeletedNode(node, path),
  added: (node, path) => processAddedNode(node, path),
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
