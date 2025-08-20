const { Receipt } = require("../models/receipt.model");
const { sendError, sendSuccess } = require("../utils/response.util");

const getReceipts = async (req, res) => {
    try {

        const receipts = await Receipt.find();
        return sendSuccess(res, 200, receipts, "Retrive Receipts Successfully"); 

    } catch (error) {
        console.log(error)
        return sendError(res, 500, "INTERNAL_ERROR", "Failed to retrive Receipts");
    }
} 

const getReceipt = async (req, res) => {
    const { id } = req.params;
    try {
        const receiptFound = await Receipt.findById(id);
        if (!receiptFound) {
            return sendError(res, 404, "NOT_FOUND", "Project not found");
        }
        return sendSuccess(res, 200, receiptFound, "Retrive Receipts Successfully"); 
    } catch (error) {
        return sendError(res, 500, "INTERNAL_ERROR", "Failed to retrive receipt");
    }
}

module.exports = {getReceipts, getReceipt}