function handleError(err, res) {
  if (err.name === "ValidationError") {
    const statusCode = 400;
    const message = "Invalid request";
    return res.status(statusCode).send({ message });
  }
  const { statusCode } = err;
  const { message } = err;
  console.error(err.message);

  return res.status(statusCode).send({ message });
}

const notFound = 404;

module.exports = { handleError, notFound };
