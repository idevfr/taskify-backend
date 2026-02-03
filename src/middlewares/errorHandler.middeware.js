export const erroHandler = async function (err, req, res, next) {
  const statusCode = err.statusCode || 500;
  const message = err.message || "something went wrong";
  const errors = err.errors || [];
  const stack = err.stack;
  const data = err.data || {};
  const success = err.success || false;
  res.status(statusCode).json({
    statusCode,
    message,
    errors,
    stack,
    data,
    success,
  });
};
