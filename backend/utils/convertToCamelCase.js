const convertToCamelCase = (obj) => {
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }
  let newObj = {};
  for (const [key, value] of Object.entries(obj)) {
    const camelCaseKey = key
      .toLowerCase()
      .replace(/_([\w])/, (match, letter) => letter.toUpperCase());
    newObj[camelCaseKey] = value;
  }
  return newObj;
};

module.exports = convertToCamelCase;
