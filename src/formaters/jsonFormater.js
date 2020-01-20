const processValue = ({ name, type, value }) => (
  { name, type, value }
);

const processChildren = (name, children) => {
  const processedChildren = children.reduce((acc, node) => (
    node.type === 'nested'
      ? [...acc, processChildren(node.name, node.children)]
      : [...acc, processValue(node)]
  ), []);
  return { name, type: 'changed', children: processedChildren };
};

export default (ast) => {
  const result = ast.reduce((acc, node) => (
    node.type === 'nested'
      ? [...acc, JSON.stringify(processChildren(node.name, node.children))]
      : [...acc, JSON.stringify(processValue(node))]
  ), []);

  return `[${result.join(',')}]`;
};
