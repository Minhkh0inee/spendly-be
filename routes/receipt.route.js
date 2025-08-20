const express = require('express')
const router = express.Router()
const receiptController = require('../controllers/receipt.controller')

router.get("/", receiptController.getReceipts)
router.get("/:id", receiptController.getReceipt)

// router.post("/", receiptController.createUser)
// router.patch("/update/:id", receiptController.updateUser)
// router.delete("/delete/:id", receiptController.deleteUser)


module.exports = router