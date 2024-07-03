import { ValidateObj } from '../interface';

export const validateFlow =
  (...validateFunc: ValidateObj[]) =>
  (...value: Parameters<ValidateObj>) => {
    try {
      validateFunc.map((func) => func(...value));
      return false;
    } catch (error) {
      if (error instanceof Error) return error.message;
      return error;
    }
  };
