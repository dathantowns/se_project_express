const router = require("express").Router();
const { createUser, login } = require("../controllers/users");
const { userValidator, loginValidator } = require("../middlewares/validation");

router.post("/signup", userValidator, createUser);
router.post("/signin", loginValidator, login);

module.exports = router;
