const tab = '  ';

const stringify = (ast, tabCount) => {
  const keys = Object.keys(ast);

  const result = keys.reduce((acc, key) => {
    const value = ast[key];

    if (value instanceof Object) {
      return `${acc}\n${tab.repeat(tabCount + 1)}${key}: ${stringify(value, tabCount + 2)}`;
    }

    return `${acc}\n${tab.repeat(tabCount + 1)}${key}: ${value}`;
  }, '');

  return `{${result}\n${tab.repeat(tabCount - 1)}}`;
};

const buildValueString = (name, values, tabCount) => {
  const keys = Object.keys(values);

  return keys.map((key) => {
    if (key === 'unchanged') {
      if (values[key] instanceof Object) {
        return `\n${tab.repeat(tabCount)}  ${name}: ${stringify(values[key], tabCount + 2)}`;
      }
      return `\n${tab.repeat(tabCount)}  ${name}: ${values[key]}`;
    }

    if (key === 'added') {
      if (values[key] instanceof Object) {
        return `\n${tab.repeat(tabCount)}+ ${name}: ${stringify(values[key], tabCount + 2)}`;
      }
      return `\n${tab.repeat(tabCount)}+ ${name}: ${values[key]}`;
    }

    if (values[key] instanceof Object) {
      return `\n${tab.repeat(tabCount)}- ${name}: ${stringify(values[key], tabCount + 2)}`;
    }
    return `\n${tab.repeat(tabCount)}- ${name}: ${values[key]}`;
  }).join('');
};

const renderDiff = (ast, tabCount = 1) => {
  const result = ast.reduce((acc, [key, value]) => {
    if (value instanceof Array) {
      return `${acc}\n${tab.repeat(tabCount)}  ${key}: ${renderDiff(value, tabCount + 2)}`;
    }

    return `${acc}${buildValueString(key, value, tabCount)}`;
  }, '');

  return `{${result}\n${tab.repeat(tabCount - 1)}}`;
};

export default renderDiff;
