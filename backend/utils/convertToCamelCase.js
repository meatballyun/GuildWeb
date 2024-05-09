const _ = require('lodash');

const convertKeysToCamelCase = (obj) => {
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }
  return _.mapKeys(obj, (value, key) => _.camelCase(key));
};

const recursiveConvertKeysToCamelCase = (obj) => {
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }
  Object.entries(obj).forEach(([key, value]) => {
    if (typeof value === 'object') obj[key] = recursiveConvertKeysToCamelCase(value);
  });
  return _.mapKeys(obj, (value, key) => _.camelCase(key));
};

module.exports = { convertKeysToCamelCase, recursiveConvertKeysToCamelCase };
