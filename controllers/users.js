const {
  ClientError,
  NotFoundError,
  handleError,
} = require("../utils/errors.js");
const User = require("../models/users");
const mongoose = require("mongoose");

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((user) => res.send({ data: user }))
    .catch((err) => handleError(err, res));
};

module.exports.getUser = (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    const err = new ClientError("Invalid userId");
    return handleError(err, res);
  } else {
    User.findById(req.params.id)
      .orFail(() => {
        const err = new NotFoundError("User not found");
        throw err;
      })
      .then((user) => res.send({ data: user }))
      .catch((err) => handleError(err, res));
  }
};

module.exports.createUser = (req, res) => {
  const { name, avatar } = req.body;
  User.create({ name, avatar })
    .then((user) => res.send({ data: user }))
    .catch((err) => handleError(err, res));
};
