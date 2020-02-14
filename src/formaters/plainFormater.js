const getCorrectValue = (value) => {
  const formedValue = typeof value === 'string' ? `'${value}'` : value;
  return value instanceof Object ? '[complex value]' : formedValue;
};

const buildStringChangedNode = (node, path) => (
  `Property ${path} was updated. From ${getCorrectValue(node.oldValue)} to ${getCorrectValue(node.newValue)}`
);

const buildStringAddedNode = (node, path) => (
  `Property ${path} was added with value: ${getCorrectValue(node.value)}`
);

const buildStringDeletedNode = (node, path) => `Property ${path} was removed`;

const actionsByType = {
  nested: ({ children }, path, fn) => fn(children, path),
  changed: (node, path) => buildStringChangedNode(node, path),
  deleted: (node, path) => buildStringDeletedNode(node, path),
  added: (node, path) => buildStringAddedNode(node, path),
};

const renderDiff = (ast, root = '') => {
  const result = ast
    .filter(({ type }) => type !== 'unchanged')
    .map((node) => {
      const path = (root === '') ? node.key : `${root}.${node.key}`;
      return actionsByType[node.type](node, path, renderDiff);
    });

  return `${result.join('\n')}`;
};

export default renderDiff;
