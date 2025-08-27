const express = require('express')
const router = express.Router()
const uploadController = require("../controllers/upload.controller")
const {uploadMiddleware} = require("../middleware/upload.middleware")
const verifyToken = require("../middleware/auth.middleware")

router.post("/", uploadMiddleware.single('receipt'),uploadController.upload)
router.post("/cloudinary", uploadMiddleware.single('receipt'), uploadController.uploadToCloudinary)
router.post("/save", verifyToken, uploadMiddleware.single('receipt'), uploadController.saveReceipt)


module.exports = router;