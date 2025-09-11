const mongoose = require("mongoose");
const BadRequestError = require("../utils/errors/BadRequestError");
const NotFoundError = require("../utils/errors/NotFoundError");
UnauthorizedError = require("../utils/errors/UnauthorizedError");
const { handleError, badRequest, forbidden } = require("../utils/handleError");
const ClothingItem = require("../models/items");

module.exports.getItems = (req, res, next) => {
  ClothingItem.find({})
    .then((items) => res.send({ data: items }))
    .catch(next);
};

module.exports.createItem = (req, res, next) => {
  const { name, weather, imageUrl } = req.body;
  ClothingItem.create({ name, weather, imageUrl, owner: req.user._id })
    .then((item) => {
      if (!item) {
        throw new BadRequestError("Item creation failed");
      }
      res.send({ data: item });
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        throw new BadRequestError("Invalid data");
      }
      throw err;
    })
    .catch(next);
};

module.exports.deleteItem = (req, res, next) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.itemId)) {
    throw new BadRequestError("Invalid item ID");
  }
  ClothingItem.findById(req.params.itemId)
    .orFail(() => new NotFoundError("Item not found"))
    .then((item) => {
      if (!item.owner.equals(req.user._id)) {
        throw new UnauthorizedError(
          "You do not have permission to delete this item"
        );
      }
      return ClothingItem.findByIdAndDelete(req.params.itemId).then(
        (deletedItem) => {
          res.send({ message: "Item deleted", item: deletedItem });
        }
      );
    })
    .catch((err) => {
      if (err.name === "CastError") {
        throw new BadRequestError("Invalid item ID");
      }
      throw err;
    })
    .catch(next);
};

module.exports.likeItem = (req, res, next) => {
  if (!req.params.itemId) {
    throw new NotFoundError("Item not found");
  }
  if (!mongoose.Types.ObjectId.isValid(req.params.itemId)) {
    throw new BadRequestError("Invalid item ID");
  }
  ClothingItem.findByIdAndUpdate(
    req.params.itemId,
    { $addToSet: { likes: req.user._id } },
    { new: true }
  )
    .orFail(() => new NotFoundError("Item not found"))
    .then((item) => res.send({ data: item }))
    .catch((err) => {
      if (err.name === "CastError") {
        throw new BadRequestError("Invalid item ID");
      }
      throw err;
    })
    .catch(next);
};

module.exports.dislikeItem = (req, res, next) => {
  if (!req.params.itemId) {
    throw new NotFoundError("Item not found");
  }
  if (!mongoose.Types.ObjectId.isValid(req.params.itemId)) {
    throw new BadRequestError("Invalid item ID");
  }
  ClothingItem.findByIdAndUpdate(
    req.params.itemId,
    { $pull: { likes: req.user._id } },
    { new: true }
  )
    .orFail(() => new NotFoundError("Item not found"))
    .then((item) => res.send({ data: item }))
    .catch((err) => {
      if (err.name === "CastError") {
        throw new BadRequestError("Invalid item ID");
      }
      throw err;
    })
    .catch(next);
};
