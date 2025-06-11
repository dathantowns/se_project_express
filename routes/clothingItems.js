const router = require("express").Router();
const ClothingItem = require("../models/clothingItems");
const {
  getItems,
  createItem,
  deleteItem,
} = require("../controllers/clothingItems.js");

router.get("/", getItems);
router.post("/", createItem);
router.delete("/:itemId", deleteItem);

module.exports = router;
