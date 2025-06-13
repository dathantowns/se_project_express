class ServerError extends Error {
  constructor(message) {
    super(message);
    this.name = "ServerError";
    this.statusCode = 500;
  }
}

class ClientError extends Error {
  constructor(message) {
    super(message);
    this.name = "ClientError";
    this.statusCode = 400;
  }
}

class NotFoundError extends ClientError {
  constructor(message) {
    super(message);
    this.name = "NotFoundError";
    this.statusCode = 404;
  }
}

function handleError(err, res) {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Unknown error occurred";
  const name = err.name || "UnknownError";
  console.error(err.message);

  res.status(statusCode).send({ message });
}

module.exports = { ServerError, ClientError, NotFoundError, handleError };
