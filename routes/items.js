const router = require("express").Router();
const {
  getItems,
  createItem,
  deleteItem,
  likeItem,
  dislikeItem,
} = require("../controllers/items");
const {
  itemValidator,
  idParamValidator,
} = require("../middlewares/validation");

router.get("/", getItems);
router.post("/", itemValidator, createItem);
router.delete("/:itemId", idParamValidator("itemId"), deleteItem);
router.put("/:itemId/likes", idParamValidator("itemId"), likeItem);
router.delete("/:itemId/likes", idParamValidator("itemId"), dislikeItem);

module.exports = router;
