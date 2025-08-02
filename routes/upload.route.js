const express = require('express')
const router = express.Router()
const uploadController = require("../controllers/upload.controller")
const {uploadMiddleware} = require("../middleware/upload.middleware")

router.post("/", uploadMiddleware.single('receipt'),uploadController.upload)

module.exports = router;