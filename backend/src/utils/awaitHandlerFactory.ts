const awaitHandlerFactory = (func:any) => {
  return async (req:any, res:any, next:any) => {
    try {
      await func(req, res, next);
    } catch (err) {
      next(err);
    }
  };
};

export default awaitHandlerFactory;
