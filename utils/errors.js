export const ApiError = (msg, statusCode) => {
  const err = new Error(msg);
  err.statusCode = statusCode;
  return err;
}