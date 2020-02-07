const tab = '  ';

const processValue = (value, tabCount) => (value instanceof Object
  ? stringify(value, tabCount + 2) // eslint-disable-line no-use-before-define
  : value);

const buildString = ({ key, value }, tabCount, statusChar = '') => {
  const processedValue = processValue(value, tabCount);
  return `${tab.repeat(tabCount)}${statusChar} ${key}: ${processedValue}`;
};

const buildStringChangedNode = ({ key, oldValue, newValue }, tabCount) => {
  const processedOldValue = processValue(oldValue, tabCount);
  const processedNewValue = processValue(newValue, tabCount);
  const deletedKey = `${tab.repeat(tabCount)}- ${key}: ${processedOldValue}`;
  const addedKey = `${tab.repeat(tabCount)}+ ${key}: ${processedNewValue}`;

  return `${deletedKey}\n${addedKey}`;
};

const stringify = (ast, tabCount) => {
  const keys = Object.keys(ast);

  const result = keys.map((key) => {
    const value = ast[key];

    return `\n${buildString({ key, value }, tabCount, ' ')}`;
  });

  return `{${result.join('')}\n${tab.repeat(tabCount - 1)}}`;
};

const actionsByType = {
  nested: ({ key, children }, tabCount, fn) => (
    `${tab.repeat(tabCount)}  ${key}: ${fn(children, tabCount + 2)}`
  ),
  unchanged: (node, tabCount) => buildString(node, tabCount, ' '),
  changed: (node, tabCount) => buildStringChangedNode(node, tabCount),
  deleted: (node, tabCount) => buildString(node, tabCount, '-'),
  added: (node, tabCount) => buildString(node, tabCount, '+'),
};

const renderDiff = (ast, tabCount = 1) => {
  const result = ast.map((node) => (
    actionsByType[node.type](node, tabCount, renderDiff)
  ));

  return `{\n${result.join('\n')}\n${tab.repeat(tabCount - 1)}}`;
};

export default renderDiff;
