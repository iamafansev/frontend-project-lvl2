import yaml from 'js-yaml';

const mapping = {
  yml: yaml.safeLoad,
  json: JSON.parse,
};

export default (type, data) => mapping[type](data);
