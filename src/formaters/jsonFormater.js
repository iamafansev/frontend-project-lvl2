const processValue = ({ key, type, value }) => (
  { key, type, value }
);

const processChildren = (key, children) => {
  const processedChildren = children.reduce((acc, node) => (
    node.type === 'nested'
      ? [...acc, processChildren(node.key, node.children)]
      : [...acc, processValue(node)]
  ), []);
  return { key, type: 'changed', children: processedChildren };
};

export default (ast) => {
  const result = ast.reduce((acc, node) => (
    node.type === 'nested'
      ? [...acc, JSON.stringify(processChildren(node.key, node.children))]
      : [...acc, JSON.stringify(processValue(node))]
  ), []);

  return `[${result.join(',')}]`;
};
