const validator = require("validator");
const mongoose = require("mongoose");

const {
  NotFoundError,
  handleError,
  ClientError,
} = require("../utils/errors.js");
const ClothingItem = require("../models/items.js");

module.exports.getItems = (req, res) => {
  ClothingItem.find({})
    .then((item) => res.send({ data: item }))
    .catch((err) => handleError(err, res));
};

module.exports.createItem = (req, res) => {
  const { name, weather, imageUrl } = req.body;
  if (!(name && weather && imageUrl)) {
    const err = new ClientError("Invalid item information");
    return handleError(err, res);
  } else if (name.length < 2 || name.length > 30) {
    const err = new ClientError("Name must be 2-30 letters");
    return handleError(err, res);
  } else if (!(name && weather && imageUrl)) {
    const err = new ClientError("Invalid item information");
    return handleError(err, res);
  } else if (!validator.isURL(imageUrl)) {
    const err = new ClientError("Invalid URL");
    return handleError(err, res);
  } else {
    ClothingItem.create({ name, weather, imageUrl, owner: req.user._id })
      .then((item) => res.send({ data: item }))
      .catch((err) => handleError(err, res));
  }
};

module.exports.deleteItem = (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.itemId)) {
    const err = new ClientError("Invalid item ID");
    return handleError(err, res);
  } else {
    ClothingItem.findByIdAndDelete(req.params.itemId)
      .orFail(() => {
        const err = new NotFoundError("Item not found");
        throw err;
      })
      .then((deletedItem) => {
        res.send({ message: "Item deleted", item: deletedItem });
      })
      .catch((err) => handleError(err, res));
  }
};

module.exports.likeItem = (req, res) => {
  if (!req.params.itemId) {
    const err = new NotFoundError("Item not found");
    return handleError(err, res);
  } else if (!mongoose.Types.ObjectId.isValid(req.params.itemId)) {
    const err = new ClientError("Invalid user ID");
    return handleError(err, res);
  } else {
    ClothingItem.findByIdAndUpdate(
      req.params.itemId,
      { $addToSet: { likes: req.user._id } },
      { new: true }
    )
      .orFail(() => {
        const err = new NotFoundError("Item not found");
        throw err;
      })
      .then((item) => res.send({ data: item }))
      .catch((err) => handleError(err, res));
  }
};

module.exports.dislikeItem = (req, res) => {
  if (!req.params.itemId) {
    const err = new NotFoundError("Item not found");
    return handleError(err, res);
  } else if (!mongoose.Types.ObjectId.isValid(req.params.itemId)) {
    const err = new ClientError("Invalid user ID");
    return handleError(err, res);
  } else {
    ClothingItem.findByIdAndUpdate(
      req.params.itemId,
      { $pull: { likes: req.user._id } },
      { new: true }
    )
      .orFail(() => {
        const err = new NotFoundError("Item not found");
        throw err;
      })
      .then((item) => res.send({ data: item }))
      .catch((err) => handleError(err, res));
  }
};
