const { User } = require("../models/user.model");
const { sendSuccess, sendError } = require("../utils/response.util");

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    return sendSuccess(res, 200, users, "Retrive Users Successfully");
  } catch (error) {
    return sendError(res, 500, "INTERNAL_ERROR", "Failed to retrive users");
  }
};

const createUser = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const newUser = new User({ name, email, password });
    const insertedNewUser = await newUser.save();
    return sendSuccess(res, 201, insertedNewUser, "Create Users Successfully");
  } catch (error) {
    return sendError(res, 500, "INTERNAL_ERROR", "Failed to create users");
  }
};

const updateUser = async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;
  try {
    const userFound = await User.findById(id);
    if (!userFound) {
      return sendError(res, 404, "NOT_FOUND", "User not found");
    }
    const userUpdated = await User.findOneAndUpdate(
      { _id: id }, {name},
      { new: true }
    );
    return sendSuccess(res, 201, userUpdated, `Update User ${id} Successfully`);
  } catch (error) {
    return sendError(res, 500, "INTERNAL_ERROR", error);
  }
};

const deleteUser = async (req, res) => {
  const { id } = req.params;
  try {
    const userFound = await User.findById(id);
    if (!userFound) {
      return sendError(res, 404, "NOT_FOUND", "User not found");
    }
    const userDelete = await User.findOneAndDelete({_id: id});
    return sendSuccess(res, 200, userDelete, `Delete User ${id} Successfully`);
  } catch (error) {
    return sendError(res, 500, "INTERNAL_ERROR", error);
  }
};

module.exports = { getAllUsers, createUser, updateUser, deleteUser };
