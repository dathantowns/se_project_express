function handleError(err, res) {
  const { statusCode = 500 } = err;
  const { message = "Internal server error" } = err;
  console.error(err.message);

  return res.status(statusCode).send({ message });
}

const notFound = 404;
const conflict = 409;
const badRequest = 400;
const unauthorized = 401;
const serverError = 500;
const forbidden = 403;

module.exports = {
  handleError,
  notFound,
  conflict,
  badRequest,
  unauthorized,
  serverError,
  forbidden,
};
