const mongoose = require("mongoose");
const BadRequestError = require("../utils/errors/BadRequestError");
const NotFoundError = require("../utils/errors/NotFoundError");
const ForbiddenError = require("../utils/errors/ForbiddenError");
const ConflictError = require("../utils/errors/ConflictError");
const ClothingItem = require("../models/items");

module.exports.getItems = (req, res, next) =>
  ClothingItem.find({})
    .then((items) => res.send({ data: items }))
    .catch(next);

module.exports.createItem = (req, res, next) => {
  const { name, weather, imageUrl } = req.body;
  return ClothingItem.create({ name, weather, imageUrl, owner: req.user._id })
    .then((item) => {
      if (!item) {
        return next(new BadRequestError("Item creation failed"));
      }
      res.send({ data: item });
      return undefined;
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        return next(new BadRequestError("Invalid data"));
      }
      if (err.code === 11000) {
        return next(new ConflictError("Item already exists."));
      }
      return next(err);
    });
};

module.exports.deleteItem = (req, res, next) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.itemId)) {
    return next(new BadRequestError("Invalid item ID"));
  }
  return ClothingItem.findById(req.params.itemId)
    .orFail(() => new NotFoundError("Item not found"))
    .then((item) => {
      if (!item.owner.equals(req.user._id)) {
        return next(
          new ForbiddenError("You do not have permission to delete this item")
        );
      }
      return ClothingItem.findByIdAndDelete(req.params.itemId).then(
        (deletedItem) => {
          res.send({ message: "Item deleted", item: deletedItem });
          return undefined;
        }
      );
    })
    .catch((err) => {
      if (err.name === "CastError") {
        return next(new BadRequestError("Invalid item ID"));
      }
      return next(err);
    });
};

module.exports.likeItem = (req, res, next) => {
  if (!req.params.itemId) {
    return next(new NotFoundError("Item not found"));
  }
  if (!mongoose.Types.ObjectId.isValid(req.params.itemId)) {
    return next(new BadRequestError("Invalid item ID"));
  }
  return ClothingItem.findByIdAndUpdate(
    req.params.itemId,
    { $addToSet: { likes: req.user._id } },
    { new: true }
  )
    .orFail(() => new NotFoundError("Item not found"))
    .then((item) => {
      res.send({ data: item });
      return undefined;
    })
    .catch((err) => {
      if (err.name === "CastError") {
        return next(new BadRequestError("Invalid item ID"));
      }
      return next(err);
    });
};

module.exports.dislikeItem = (req, res, next) => {
  if (!req.params.itemId) {
    return next(new NotFoundError("Item not found"));
  }
  if (!mongoose.Types.ObjectId.isValid(req.params.itemId)) {
    return next(new BadRequestError("Invalid item ID"));
  }
  return ClothingItem.findByIdAndUpdate(
    req.params.itemId,
    { $pull: { likes: req.user._id } },
    { new: true }
  )
    .orFail(() => new NotFoundError("Item not found"))
    .then((item) => {
      res.send({ data: item });
      return undefined;
    })
    .catch((err) => {
      if (err.name === "CastError") {
        return next(new BadRequestError("Invalid item ID"));
      }
      return next(err);
    });
};
