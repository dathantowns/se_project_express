const User = require("../models/users");

module.exports.sendServerError = (err, res) =>
  res.status(500).send({ message: "Error" });

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((user) => res.send({ data: user }))
    .catch((err) => module.exports.sendServerError(err, res));
};

module.exports.getUser = (req, res) => {
  User.findById(req.params.id)
    .then((user) => res.send({ data: user }))
    .catch((err) => module.exports.sendServerError(err, res));
};

module.exports.createUser = (req, res) => {
  const { name, avatar } = req.body;
  User.create({ name, avatar })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      module.exports.sendServerError(err, res);
      console.log(err);
    });
};
