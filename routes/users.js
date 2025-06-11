const router = require("express").Router();
const User = require("../models/users");
const { getUsers, getUser, createUser } = require("../controllers/users");

router.get("/", getUsers);
router.get("/:id", getUser);
router.post("/", createUser);

module.exports = router;
