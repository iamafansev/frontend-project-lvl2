import yaml from 'js-yaml';
import ini from 'ini';

const mapping = {
  yml: yaml.safeLoad,
  ini: ini.parse,
  json: JSON.parse,
};

export default (type, data) => mapping[type](data);
