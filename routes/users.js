const router = require("express").Router();
const {
  getUsers,
  getCurrentUser,
  createUser,
  updateProfile,
} = require("../controllers/users");

router.get("/me", getCurrentUser);
router.patch("/me", updateProfile);
router.post("/", createUser);

module.exports = router;
