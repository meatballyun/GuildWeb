import { ValidateObj } from '../interface';

export const required: ValidateObj = ({ fieldName, value }) => {
  if (!value) throw Error(`${fieldName} is required`);
};

export const maxLimit =
  (count: number, type: 'string' | 'number' = 'string'): ValidateObj =>
  ({ fieldName, value }) => {
    if (type === 'string' && typeof value === 'string' && value.length > count)
      throw Error(`${fieldName} cannot over ${count} characters`);
    if (type !== 'number') return;
    const number = Number(value);
    if (!isNaN(number) && number > count)
      throw Error(`${fieldName} cannot over ${count}`);
  };

export const minLimit =
  (count: number, type: 'string' | 'number' = 'string'): ValidateObj =>
  ({ fieldName, value }) => {
    if (typeof value === 'string' && value.length < count)
      throw Error(`${fieldName} cannot be less than ${count} characters`);
    if (type !== 'number') return;
    const number = Number(value);
    if (!isNaN(number) && number < count)
      throw Error(`${fieldName} cannot be less than ${count}`);
  };

export const isInt: ValidateObj = ({ fieldName, value }) => {
  const number = Number(value);
  if (typeof value !== 'number' || isNaN(number) || value % 1 !== 0)
    throw Error(`${fieldName} should int`);
};

export const isEmail: ValidateObj = ({ fieldName, value }) => {
  const valid =
    typeof value === 'string' &&
    /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value);

  if (!valid) throw Error(`${fieldName} is not email format`);
};

export const isEqual =
  (compareName: string, enableEmpty = true): ValidateObj =>
  ({ fieldName, value }, formData) => {
    if (enableEmpty && !formData?.[compareName]) return;
    if (value !== formData[compareName])
      throw Error(`${fieldName} does not match ${compareName}`);
  };
