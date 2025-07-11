const mongoose = require("mongoose");
const ClientError = require("../utils/errors/ClientError");
const NotFoundError = require("../utils/errors/NotFoundError");
const { handleError } = require("../utils/handleError");
const ClothingItem = require("../models/items");

module.exports.getItems = (req, res) => {
  ClothingItem.find({})
    .then((item) => res.send({ data: item }))
    .catch((err) => handleError(err, res));
};

module.exports.createItem = (req, res) => {
  const { name, weather, imageUrl } = req.body;
  ClothingItem.create({ name, weather, imageUrl, owner: req.user._id })
    .then((item) => res.send({ data: item }))
    .catch((err) => handleError(err, res));
};

module.exports.deleteItem = (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.itemId)) {
    const err = new ClientError("Invalid item ID");
    return handleError(err, res);
  }

  return ClothingItem.findById(req.params.itemId)
    .orFail(() => {
      const err = new NotFoundError("Item not found");
      throw err;
    })
    .then((item) => {
      if (!item.owner.equals(req.user._id)) {
        return res
          .status(403)
          .send({ message: "You do not have permission to delete this item." });
      }
      return ClothingItem.findByIdAndDelete(req.params.itemId).then(
        (deletedItem) => {
          res.send({ message: "Item deleted", item: deletedItem });
        }
      );
    })
    .catch((err) => handleError(err, res));
};

module.exports.likeItem = (req, res) => {
  if (!req.params.itemId) {
    const err = new NotFoundError("Item not found");
    return handleError(err, res);
  }

  if (!mongoose.Types.ObjectId.isValid(req.params.itemId)) {
    const err = new ClientError("Invalid item ID");
    return handleError(err, res);
  }

  return ClothingItem.findByIdAndUpdate(
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
};

module.exports.dislikeItem = (req, res) => {
  if (!req.params.itemId) {
    const err = new NotFoundError("Item not found");
    return handleError(err, res);
  }

  if (!mongoose.Types.ObjectId.isValid(req.params.itemId)) {
    const err = new ClientError("Invalid item ID");
    return handleError(err, res);
  }

  return ClothingItem.findByIdAndUpdate(
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
};
