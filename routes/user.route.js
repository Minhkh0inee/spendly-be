const express = require('express')
const router = express.Router()
const userController = require("../controllers/user.controller")
const verifyToken = require("../middleware/auth.middleware")

router.get("/", userController.getAllUsers)
router.post("/", userController.createUser)
router.patch("/update/:id", userController.updateUser)
router.delete("/delete/:id", userController.deleteUser)

// // Protected routes
// router.get("/profile", verifyToken, userController.getUserProfile)
// router.get("/receipts", verifyToken, userController.getUserReceipts)
// router.get("/projects", verifyToken, userController.getUserProjects)


module.exports = router