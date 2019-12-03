import renderNestFormat from './nestFormater';
import renderPlainFormat from './plainFormater';

const mapping = {
  plain: renderPlainFormat,
  nest: renderNestFormat,
};

export default (format, diff) => mapping[format](diff);
