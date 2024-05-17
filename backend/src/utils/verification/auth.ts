// @ts-nocheck
import { ApplicationError } from '../error/applicationError';

const authenticated = (req, res, next) => {
  if (req.isAuthenticated()) return next();
  return next(new ApplicationError(401));
};

export default authenticated;
