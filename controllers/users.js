const {
  ClientError,
  NotFoundError,
  handleError,
} = require("../utils/errors.js");
const User = require("../models/users");
const mongoose = require("mongoose");
const validator = require("validator");

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
  if (!name || !avatar) {
    const err = new ClientError("Name and Avatar required");
    return handleError(err, res);
  } else if (name.length < 2 || name.length > 30) {
    const err = new ClientError("Name must be 2-30 letters");
    return handleError(err, res);
  } else if (!validator.isURL(avatar)) {
    const err = new ClientError("invalid URL");
    return handleError(err, res);
  } else {
    User.create({ name, avatar })
      .then((user) => res.send({ data: user }))
      .catch((err) => handleError(err, res));
  }
};
