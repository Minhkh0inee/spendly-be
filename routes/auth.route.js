const express = require("express");
const {registerUser, signIn} = require("../controllers/auth.controller")
const router = express.Router();

router.post("/register", registerUser);
router.post("/sign-in", signIn);
// router.get("/profile", protect, getUserProfile);

module.exports = router;
