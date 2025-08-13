const { Category } = require("../models/category.model")
const { sendSuccess, sendError } = require("../utils/response.util")


const createCategory = async (req, res) => {
    try {
        const {name, description, owner} = req.body
        const newCategory = new Category({
            name, description,owner
        })
        const insertedNewCategory = await newCategory.save()
        return sendSuccess(res, 201, insertedNewCategory, "Category Created Successfully"); 
    } catch (error) {
        return sendError(res, 500, "INTERNAL_ERROR", "Failed to created Category");
    }
}

const getCategories = async (req, res) => {
    try {
        const categories = await Category.find()
        return sendSuccess(res, 200, categories, "Categories Retrive Successfully"); 
    } catch (error) {
        return sendError(res, 500, "INTERNAL_ERROR", "Failed to Retrive Category");
    }
}


module.exports = {createCategory, getCategories}