const { NotFoundError, handleError } = require("../utils/errors.js");
const ClothingItem = require("../models/clothingItems.js");

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
  ClothingItem.findByIdAndDelete(req.params.itemId)
    .orFail(() => {
      const err = new NotFoundError("Item not found");
      throw err;
    })
    .then((deletedItem) => {
      res.send({ message: "Item deleted", item: deletedItem });
    })
    .catch((err) => handleError(err, res));
};
