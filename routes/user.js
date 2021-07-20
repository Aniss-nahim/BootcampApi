/**
 * User Module routes for admin only
 */
const express = require("express");

// Model
const User = require("../models/User");

// Controllers
const {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  updateUserPassword,
} = require("../controllers/users.js");

// Guard middleware
const { guard, accessRole } = require("../middlewares/auth");

// Advance middleware
const paginate = require("../middlewares/paginate");
const advanceQuery = require("../middlewares/advanceQuery");
const sortResults = require("../middlewares/sortResults");

const router = express.Router();

router.use(guard, accessRole("admin"));

router
  .get("/", advanceQuery(User), sortResults, getUsers, paginate)
  .get("/:id", getUser)
  .post("/", createUser)
  .put("/:id", updateUser)
  .put("/:id/password", updateUserPassword)
  .delete("/:id", deleteUser);

module.exports = router;
