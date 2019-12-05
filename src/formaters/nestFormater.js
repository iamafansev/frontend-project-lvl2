const stringify = (ast, spaceCount, separator = '\n') => {
  const keys = Object.keys(ast);

  const result = keys.reduce((acc, key) => {
    const value = ast[key];

    if (value instanceof Object) {
      return `${acc}${separator}${' '.repeat(spaceCount + 2)}${key}: ${stringify(value, spaceCount + 4)}`;
    }

    return `${acc}${separator}${' '.repeat(spaceCount + 2)}${key}: ${value}`;
  }, '');

  return `{${result}${separator}${' '.repeat(spaceCount - 2)}}`;
};

const buildValueString = (name, values, spaceCount) => {
  const keys = Object.keys(values);

  return keys.map((key) => {
    if (key === 'unchanged') {
      if (values[key] instanceof Object) {
        return `\n${' '.repeat(spaceCount)}  ${name}: ${stringify(values[key], spaceCount + 4)}`;
      }
      return `\n${' '.repeat(spaceCount)}  ${name}: ${values[key]}`;
    }

    if (key === 'added') {
      if (values[key] instanceof Object) {
        return `\n${' '.repeat(spaceCount)}+ ${name}: ${stringify(values[key], spaceCount + 4)}`;
      }
      return `\n${' '.repeat(spaceCount)}+ ${name}: ${values[key]}`;
    }

    if (values[key] instanceof Object) {
      return `\n${' '.repeat(spaceCount)}- ${name}: ${stringify(values[key], spaceCount + 4)}`;
    }
    return `\n${' '.repeat(spaceCount)}- ${name}: ${values[key]}`;
  }).join('');
};

const renderDiff = (ast, spaceCount = 2) => {
  const result = ast.reduce((acc, [key, value]) => {
    if (value instanceof Array) {
      return `${acc}\n${' '.repeat(spaceCount)}  ${key}: ${renderDiff(value, spaceCount + 4)}`;
    }

    return `${acc}${buildValueString(key, value, spaceCount)}`;
  }, '');

  return `{${result}\n${' '.repeat(spaceCount - 2)}}`;
};

export default renderDiff;
