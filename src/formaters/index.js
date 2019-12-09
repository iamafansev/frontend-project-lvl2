import renderNestFormat from './nestFormater';
import renderPlainFormat from './plainFormater';
import renderJsonFormat from './jsonFormater';

const mapping = {
  plain: renderPlainFormat,
  nest: renderNestFormat,
  json: renderJsonFormat,
};

export default (format, diff) => mapping[format](diff);
