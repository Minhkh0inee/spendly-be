const { Project } = require("../models/project.model");
const { sendError, sendSuccess } = require("../utils/response.util");

const createProject = async (req, res) => {
    try {
        const {name, description, owner, team} = req.body;
        const newProject = new Project({
            name, description, owner, team, receipt
        })
        const insertedNewProject = await newProject.save()
        return sendSuccess(res, 201, insertedNewProject, "Project Created Successfully"); 
    } catch (error) {
        return sendError(res, 500, "INTERNAL_ERROR", "Failed to created users");
    }
}

const getProjects = async (req, res) => {
    try {

        const projects = await Project.find();
        return sendSuccess(res, 200, projects, "Retrive Projects Successfully"); 

    } catch (error) {
        console.log(error)
        return sendError(res, 500, "INTERNAL_ERROR", "Failed to retrive users");
    }
}

const getProject = async (req, res) => {
    const { id } = req.params;
    try {
        const projectFound = await Project.findById(id);
        if (!projectFound) {
            return sendError(res, 404, "NOT_FOUND", "Project not found");
        }
        return sendSuccess(res, 200, projectFound, "Retrive Project Successfully"); 
    } catch (error) {
        return sendError(res, 500, "INTERNAL_ERROR", "Failed to retrive users");
    }
}

const updateProject = async (req, res) => {
  const { id } = req.params;
  const { name, description, owner, team, receipt } = req.body;
  try {
    const projectFound = await Project.findById(id);
    if (!projectFound) {
      return sendError(res, 404, "NOT_FOUND", "Project not found");
    }
     const updateFields = {};
    if (name) updateFields.name = name;
    if (description) updateFields.description = description;
    if (owner) updateFields.owner = owner;

    const updateQuery = [
      { $set: updateFields },
    ];

    if (team && Array.isArray(team) && team.length > 0) {
      updateQuery.push({ $addToSet: { team: { $each: team } } });
    }

    if (receipt && Array.isArray(receipt) && receipt.length > 0) {
      updateQuery.push({ $addToSet: { receipt: { $each: receipt } } });
    }

    const projectUpdated = await Project.findOneAndUpdate(
      { _id: id },
      Object.assign({}, ...updateQuery),
      { new: true }
    );
    return sendSuccess(res, 201, projectUpdated, `Update Project ${id} Successfully`);
  } catch (error) {
    return sendError(res, 500, "INTERNAL_ERROR", error);
  }
};

const deleteProject = async (req, res) => {
  const { id } = req.params;
  try {
    const projectFound = await Project.findById(id);
    if (!projectFound) {
      return sendError(res, 404, "NOT_FOUND", "Project not found");
    }
    const projectDelete = await Project.findOneAndDelete({_id: id});
    return sendSuccess(res, 200, projectDelete, `Delete Project ${id} Successfully`);
  } catch (error) {
    return sendError(res, 500, "INTERNAL_ERROR", error);
  }
};


module.exports = {getProjects, createProject, getProject, updateProject, deleteProject}