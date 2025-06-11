const ClothingItem = require("../models/clothingItems.js");

module.exports.getItems = (req, res) => {
  ClothingItem.find({})
    .then((item) => res.send({ data: item }))
    .catch(() => res.status(500).send({ message: "Error" }));
};

module.exports.createItem = (req, res) => {
  const { name, weather, imageUrl } = req.body;
  ClothingItem.create({ name, weather, imageUrl, owner: req.user._id });
};

module.exports.deleteItem = (req, res) => {
  ClothingItem.findByIdAndDelete(params.itemId);
};
