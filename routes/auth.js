const express = require("express");
const {
  register,
  login,
  logout,
  getMe,
  updateDetails,
  forgotPassword,
  resetPassword,
  updatePassword,
} = require("../controllers/auth");

// Guard middleware
const { guard } = require("../middlewares/auth");

const router = express.Router();

router.get("/me", guard, getMe);
router.post("/register", register);
router.post("/login", login);
router.get("/logout", guard, logout);
router.post("/forgotpassword", forgotPassword);
router.put("/resetpassword/:resettoken", resetPassword);
router.put("/updatedetails", guard, updateDetails);
router.put("/updatepassword", guard, updatePassword);

module.exports = router;
