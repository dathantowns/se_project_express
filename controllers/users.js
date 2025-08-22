const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/users");
const {
  handleError,
  conflict,
  badRequest,
  unauthorized,
  serverError,
} = require("../utils/handleError");
const ClientError = require("../utils/errors/ClientError");
const NotFoundError = require("../utils/errors/NotFoundError");
const { JWT_SECRET } = require("../utils/config");

module.exports.getCurrentUser = (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.user._id)) {
    const err = new ClientError("Invalid userId");
    err.statusCode = badRequest;
    return handleError(err, res);
  }

  return User.findById(req.user._id)
    .orFail(() => {
      const err = new NotFoundError("User not found");
      throw err;
    })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === "CastError") {
        return res.status(badRequest).send({ message: "Invalid user ID" });
      }
      return handleError(err, res);
    });
};

module.exports.createUser = (req, res) => {
  const { name, avatar, email, password } = req.body;
  bcrypt
    .hash(password, 10)
    .then((hash) => {
      User.create({ name, avatar, email, password: hash })
        .then((user) => {
          const newUser = user.toObject({
            transform(doc, ret) {
              const transformedRet = { ...ret };
              delete transformedRet.password;
              return transformedRet;
            },
          });
          res.send({ data: newUser });
        })
        .catch((err) => {
          if (err.name === "ValidationError") {
            return res.status(badRequest).send({ message: "Invalid data" });
          }
          if (err.code === 11000) {
            const message = "User already exists. Please sign in.";
            return res.status(conflict).send({ message });
          }
          return handleError(err, res);
        });
    })
    .catch((err) => handleError(err, res));
};

module.exports.login = (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res
      .status(badRequest)
      .send({ message: "Email and password are required." });
  }
  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
        expiresIn: "7d",
      });
      res.send({ token: token });
    })
    .catch((err) => {
      if (err.message === "Incorrect email or password") {
        return res.status(unauthorized).send({ message: err.message });
      }
      return res.status(serverError).send({ message: "Internal server error" });
    });
};

module.exports.updateProfile = (req, res) => {
  const { name, avatar } = req.body;
  if (!mongoose.Types.ObjectId.isValid(req.user._id)) {
    const err = new ClientError("Invalid userId");
    err.statusCode = badRequest;
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
    .catch((err) => {
      if (err.name === "ValidationError") {
        return res.status(badRequest).send({ message: "Invalid data" });
      }
      if (err.name === "CastError") {
        return res.status(badRequest).send({ message: "Invalid user ID" });
      }
      return handleError(err, res);
    });
};
