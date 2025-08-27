const express = require('express')
const router = express.Router()
const projectController = require("../controllers/project.controller")
const verifyToken = require("../middleware/auth.middleware")

router.get("/", projectController.getProjects)
router.post("/", verifyToken, projectController.createProject)
router.get("/:id", projectController.getProject)
router.patch("/update/:id", verifyToken, projectController.updateProject)
router.delete("/delete/:id", verifyToken, projectController.deleteProject)


module.exports = router