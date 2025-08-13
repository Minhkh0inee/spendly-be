const express = require('express')
const router = express.Router()
const projectController = require("../controllers/project.controller")

router.get("/", projectController.getProjects)
router.post("/", projectController.createProject)
router.get("/:id", projectController.getProject)
router.patch("/update/:id", projectController.updateProject)
router.delete("/delete/:id", projectController.deleteProject)


module.exports = router