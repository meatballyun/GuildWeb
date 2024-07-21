import _ from 'lodash';

export const convertKeysToCamelCase = (obj: Record<string, any>) => {
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }
  return _.mapKeys(obj, (value, key) => _.camelCase(key));
};

export const recursiveConvertKeysToCamelCase = (obj: Record<string, any>) => {
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }
  Object.entries(obj).forEach(([key, value]) => {
    if (typeof value === 'object') obj[key] = recursiveConvertKeysToCamelCase(value);
  });
  return _.mapKeys(obj, (value, key) => _.camelCase(key));
};
