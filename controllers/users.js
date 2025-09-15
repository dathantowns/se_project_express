const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/users");
const BadRequestError = require("../utils/errors/BadRequestError");
const NotFoundError = require("../utils/errors/NotFoundError");
const UnauthorizedError = require("../utils/errors/UnauthorizedError");
const ConflictError = require("../utils/errors/ConflictError");
const { JWT_SECRET } = require("../utils/config");

module.exports.getCurrentUser = (req, res, next) => {
  if (!mongoose.Types.ObjectId.isValid(req.user._id)) {
    return next(new BadRequestError("Invalid userId"));
  }
  return User.findById(req.user._id)
    .orFail(() => new NotFoundError("User not found"))
    .then((user) => res.send({ data: user }))
    .catch(next);
};

module.exports.createUser = (req, res, next) => {
  const { name, avatar, email, password } = req.body;
  return bcrypt
    .hash(password, 10)
    .then((hash) => User.create({ name, avatar, email, password: hash }))
    .then((user) => {
      const newUser = user.toObject();
      delete newUser.password;
      res.send({ data: newUser });
      return undefined;
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        return next(new BadRequestError("Invalid data"));
      }
      if (err.code === 11000) {
        return next(new ConflictError("User already exists. Please sign in."));
      }
      return next(err);
    });
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return next(new BadRequestError("Email and password are required."));
  }
  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
        expiresIn: "7d",
      });
      res.send({ token });
      return undefined;
    })
    .catch((err) => {
      if (err.message === "Incorrect email or password") {
        return next(new UnauthorizedError(err.message));
      }
      return next(err);
    });
};

module.exports.updateProfile = (req, res, next) => {
  const { name, avatar } = req.body;
  if (!mongoose.Types.ObjectId.isValid(req.user._id)) {
    return next(new BadRequestError("Invalid userId"));
  }
  return User.findByIdAndUpdate(
    req.user._id,
    { name, avatar },
    { new: true, runValidators: true }
  )
    .orFail(() => new NotFoundError("User not found"))
    .then((user) => {
      res.send({ data: user });
      return undefined;
    })
    .catch((err) => {
      if (err.name === "ValidationError" || err.name === "CastError") {
        return next(new BadRequestError("Invalid data"));
      }
      return next(err);
    });
};
