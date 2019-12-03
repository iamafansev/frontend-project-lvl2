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

const getChar = (status) => {
  let result;
  switch (status) {
    case 'key added':
      result = '+';
      break;
    case 'key removed':
      result = '-';
      break;
    default:
      result = ' ';
  }

  return result;
};

const renderDiff = (diff, spaceCount = 2) => {
  const result = diff.reduce((acc, element) => {
    const {
      name,
      value,
      status,
      children,
    } = element;

    const char = getChar(status);
    if (children.length !== 0) {
      return `${acc}\n${' '.repeat(spaceCount)}${char} ${name}: ${renderDiff(children, spaceCount + 4)}`;
    }

    if (value instanceof Object) {
      return `${acc}\n${' '.repeat(spaceCount)}${char} ${name}: ${stringify(value, spaceCount + 4)}`;
    }

    return `${acc}\n${' '.repeat(spaceCount)}${char} ${name}: ${value}`;
  }, '');

  return `{${result}\n${' '.repeat(spaceCount - 2)}}`;
};

export default renderDiff;
