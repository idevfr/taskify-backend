export const asyncHandler = function (handlerFn) {
  return async function (req, res, next) {
    try {
      return await handlerFn(req, res, next);
    } catch (error) {
      return next(error);
    }
  };
};
