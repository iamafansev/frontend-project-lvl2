import _ from 'lodash';

const tab = '  ';

const buildString = (key, value, tabCount, statusChar = '') => {
  if (value instanceof Object) {
    return `${tab.repeat(tabCount)}${statusChar} ${key}: ${stringify(value, tabCount + 2)}`; // eslint-disable-line no-use-before-define
  }

  return `${tab.repeat(tabCount)}${statusChar} ${key}: ${value}`;
};

const stringify = (ast, tabCount) => {
  const keys = Object.keys(ast);

  const result = keys.reduce((acc, key) => {
    const value = ast[key];

    return [...acc, `\n${buildString(key, value, tabCount, ' ')}`];
  }, []);

  return `{${result.join('')}\n${tab.repeat(tabCount - 1)}}`;
};

const typeActions = [
  {
    check: (arg) => arg === 'unchanged',
    processBuildString: (key, value, tabCount) => buildString(key, value, tabCount, ' '),
  },
  {
    check: (arg) => arg === 'added',
    processBuildString: (key, value, tabCount) => buildString(key, value, tabCount, '+'),
  },
  {
    check: (arg) => arg === 'removed',
    processBuildString: (key, value, tabCount) => buildString(key, value, tabCount, '-'),
  },
];

const getProcessType = (arg) => _.find(typeActions, (({ check }) => check(arg)));

const processValue = (name, values, tabCount) => {
  const keys = Object.keys(values);

  const result = keys.map((key) => {
    const value = values[key];
    const { processBuildString } = getProcessType(key);

    return processBuildString(name, value, tabCount);
  });

  return result.join('\n');
};

const renderDiff = (ast, tabCount = 1) => {
  const result = ast.reduce((acc, { key, value, children }) => {
    if (children) {
      return [...acc, `${tab.repeat(tabCount)}  ${key}: ${renderDiff(children, tabCount + 2)}`];
    }

    return [...acc, `${processValue(key, value, tabCount)}`];
  }, []);

  return `{\n${result.join('\n')}\n${tab.repeat(tabCount - 1)}}`;
};

export default renderDiff;
