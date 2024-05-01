export const required = ({ fieldName, value }) => {
  if (!value) throw Error(`${fieldName} is required`);
};

/**
 * @param {number} count
 * @param {'string'|'number'} type
 * @returns
 */
export const maxLimit =
  (count, type = 'string') =>
  ({ fieldName, value }) => {
    if (type === 'string' && typeof value === 'string' && value.length > count)
      throw Error(`${fieldName} cannot over ${count} characters`);
    if (type !== 'number') return;
    const number = Number(value);
    if (!isNaN(number) && number > count)
      throw Error(`${fieldName} cannot over ${count}`);
  };

/**
 * @param {number} count
 * @param {'string'|'number'} type
 * @returns
 */
export const minLimit =
  (count, type = 'string') =>
  ({ fieldName, value }) => {
    if (typeof value === 'string' && value.length < count)
      throw Error(`${fieldName} cannot be less than ${count} characters`);
    if (type !== 'number') return;
    const number = Number(value);
    if (!isNaN(number) && number < count)
      throw Error(`${fieldName} cannot be less than ${count}`);
  };

export const isInt = ({ fieldName, value }) => {
  const number = Number(value);
  if (isNaN(number) || value % 1 !== 0) throw Error(`${fieldName} should int`);
};

export const isEmail = ({ fieldName, value }) => {
  const valid =
    typeof value === 'string' &&
    /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value);

  if (!valid) throw Error(`${fieldName} is not email format`);
};

export const isEqual =
  (compareName, enableEmpty = true) =>
  ({ fieldName, value }, formData) => {
    if (enableEmpty && !formData?.[compareName]) return;
    if (value !== formData.password)
      throw Error(`${fieldName} does not match ${compareName}`);
  };
