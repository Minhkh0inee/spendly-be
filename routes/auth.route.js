const express = require("express");
const { registerUser, signIn, getProfile } = require("../controllers/auth.controller")
const verifyToken = require("../middleware/auth.middleware")
const router = express.Router();

router.post("/register", registerUser);
router.post("/sign-in", signIn);
router.get("/profile", verifyToken, getProfile);

module.exports = router;
