const express = require("express");
const { protect } = require("../middleware/auth-middleware");

const {
  signUp,
  login,
  fetchAllUsers,
  fetchUser,
} = require("../controller/user-controller");

const router = express.Router();

router.post("/signUp", signUp);
router.post("/login", login);
router.get("/fetch_all_users", protect, fetchAllUsers);
router.get("/fetch_user/:id", protect, fetchUser);

module.exports = router;
