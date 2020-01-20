const tab = '  ';

const processValue = (value, tabCount) => (value instanceof Object
  ? stringify(value, tabCount + 2) // eslint-disable-line no-use-before-define
  : value);

const buildString = ({ name, value, type }, tabCount, statusChar = '') => {
  if (type === 'changed') {
    const processedOldValue = processValue(value.old, tabCount);
    const processedNewValue = processValue(value.new, tabCount);
    const deletedKey = `${tab.repeat(tabCount)}- ${name}: ${processedOldValue}`;
    const addedKey = `${tab.repeat(tabCount)}+ ${name}: ${processedNewValue}`;

    return `${deletedKey}\n${addedKey}`;
  }

  const processedValue = processValue(value, tabCount);
  return `${tab.repeat(tabCount)}${statusChar} ${name}: ${processedValue}`;
};

const stringify = (ast, tabCount) => {
  const keys = Object.keys(ast);

  const result = keys.reduce((acc, key) => {
    const value = ast[key];

    return [...acc, `\n${buildString({ name: key, value }, tabCount, ' ')}`];
  }, []);

  return `{${result.join('')}\n${tab.repeat(tabCount - 1)}}`;
};

const actionsByType = {
  nested: ({ name, children }, tabCount, fn) => (
    `${tab.repeat(tabCount)}  ${name}: ${fn(children, tabCount + 2)}`
  ),
  unchanged: (node, tabCount) => buildString(node, tabCount, ' '),
  changed: (node, tabCount) => buildString(node, tabCount, ' '),
  deleted: (node, tabCount) => buildString(node, tabCount, '-'),
  added: (node, tabCount) => buildString(node, tabCount, '+'),
};

const renderDiff = (ast, tabCount = 1) => {
  const result = ast.reduce((acc, node) => (
    [...acc, actionsByType[node.type](node, tabCount, renderDiff)]
  ), []);

  return `{\n${result.join('\n')}\n${tab.repeat(tabCount - 1)}}`;
};

export default renderDiff;
