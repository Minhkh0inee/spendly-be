const { Project } = require("../models/project.model");
const { User } = require("../models/user.model");
const { sendError, sendSuccess } = require("../utils/response.util");

const createProject = async (req, res) => {
    try {
        if (!req.userId) {
            return sendError(res, 401, "UNAUTHORIZED", "User authentication required");
        }

        const { name, description, team } = req.body;
        const newProject = new Project({
            name, 
            description, 
            owner: req.userId, 
            team: team || []
        });
        
        const insertedNewProject = await newProject.save();
        
        // Add project to user's projects array
        const user = await User.findById(req.userId);
        if (user) {
            await user.addProject(insertedNewProject._id);
        }
        
        return sendSuccess(res, 201, insertedNewProject, "Project Created Successfully"); 
    } catch (error) {
        console.error("Create project error:", error);
        return sendError(res, 500, "INTERNAL_ERROR", "Failed to create project");
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
    
    // Handle owner change
    if (owner && owner !== projectFound.owner.toString()) {
      // Remove project from old owner's projects array
      const oldOwner = await User.findById(projectFound.owner);
      if (oldOwner) {
        oldOwner.projects = oldOwner.projects.filter(projectId => !projectId.equals(id));
        await oldOwner.save();
      }
      
      // Add project to new owner's projects array
      const newOwner = await User.findById(owner);
      if (newOwner) {
        if (!newOwner.projects.includes(id)) {
          newOwner.projects.push(id);
          await newOwner.save();
        }
      }
      
      updateFields.owner = owner;
    }

    const updateQuery = [
      { $set: updateFields },
    ];

    // Handle team updates
    if (team && Array.isArray(team) && team.length > 0) {
      // Add new team members to their projects arrays
      for (const userId of team) {
        const user = await User.findById(userId);
        if (user && !user.projects.includes(id)) {
          user.projects.push(id);
          await user.save();
        }
      }
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
    console.error("Update project error:", error);
    return sendError(res, 500, "INTERNAL_ERROR", error);
  }
};

const deleteProject = async (req, res) => {
  const { id } = req.params;
  try {
    if (!req.userId) {
      return sendError(res, 401, "UNAUTHORIZED", "User authentication required");
    }

    const projectFound = await Project.findById(id);
    if (!projectFound) {
      return sendError(res, 404, "NOT_FOUND", "Project not found");
    }

    // Check if user is the owner of the project
    if (projectFound.owner.toString() !== req.userId) {
      return sendError(res, 403, "FORBIDDEN", "You can only delete your own projects");
    }

    const projectDelete = await Project.findOneAndDelete({_id: id});
    
    // Remove project from user's projects array
    const user = await User.findById(req.userId);
    if (user) {
      await user.removeProject(id);
    }

    return sendSuccess(res, 200, projectDelete, `Delete Project ${id} Successfully`);
  } catch (error) {
    return sendError(res, 500, "INTERNAL_ERROR", error);
  }
};


module.exports = {getProjects, createProject, getProject, updateProject, deleteProject}