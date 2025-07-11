const mongoose = require("mongoose");
const User = require("../models/users");
const { handleError, conflict } = require("../utils/handleError");
const ClientError = require("../utils/errors/ClientError");
const NotFoundError = require("../utils/errors/NotFoundError");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../utils/config");

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((user) => res.send({ data: user }))
    .catch((err) => handleError(err, res));
};

module.exports.getCurrentUser = (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.user._id)) {
    const err = new ClientError("Invalid userId");
    return handleError(err, res);
  }

  return User.findById(req.user._id)
    .orFail(() => {
      const err = new NotFoundError("User not found");
      throw err;
    })
    .then((user) => res.send({ data: user }))
    .catch((err) => handleError(err, res));
};

module.exports.createUser = (req, res) => {
  const { name, avatar, email, password } = req.body;
  bcrypt
    .hash(password, 10)
    .then((hash) => {
      User.create({ name, avatar, email, password: hash })
        .then((user) => {
          const newUser = user.toObject({
            transform: function (doc, ret) {
              delete ret.password;
              return ret;
            },
          });
          res.send({ data: newUser });
        })
        .catch((err) => {
          console.log(err);
          if (err.code == 11000) {
            const message = "User already exists. Please sign in.";
            return res.status(conflict).send({ message });
          }
          handleError(err, res);
        });
    })
    .catch((err) => handleError(err, res));
};

module.exports.login = (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res
      .status(400)
      .send({ message: "Email and password are required." });
  }
  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
        expiresIn: "7d",
      });
      res.send({ data: token });
    })
    .catch((err) => {
      res.status(401).send({ message: err.message });
    });
};

module.exports.updateProfile = (req, res) => {
  const { name, avatar } = req.body;
  if (!mongoose.Types.ObjectId.isValid(req.user._id)) {
    const err = new ClientError("Invalid userId");
    return handleError(err, res);
  }

  return User.findByIdAndUpdate(
    req.user._id,
    { name, avatar },
    { new: true, runValidators: true }
  )
    .orFail(() => {
      const err = new NotFoundError("User not found");
      throw err;
    })
    .then((user) => res.send({ data: user }))
    .catch((err) => handleError(err, res));
};
