export const required = ({ fieldName, value }) => {
  if (!value) throw Error(`${fieldName} is required`);
};

export const maxLimit =
  (count) =>
  ({ fieldName, value }) => {
    if (typeof value === 'string' && value.length > count)
      throw Error(`${fieldName} cannot over ${count} characters`);
  };

export const minLimit =
  (count) =>
  ({ fieldName, value }) => {
    if (typeof value === 'string' && value.length < count)
      throw Error(`${fieldName} cannot be less than ${count} characters`);
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
