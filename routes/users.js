const router = require("express").Router();
const { getCurrentUser, updateProfile } = require("../controllers/users");
const { updateProfileValidator } = require("../middlewares/validation");

router.get("/me", getCurrentUser);
router.patch("/me", updateProfileValidator, updateProfile);

module.exports = router;
