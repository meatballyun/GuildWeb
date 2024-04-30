export const validateFlow =
  (...validateFunc) =>
  (...value) => {
    try {
      validateFunc.map((func) => func(...value));
      return false;
    } catch (error) {
      if (error instanceof Error) {
        return error.message;
      }
      return error;
    }
  };
