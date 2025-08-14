const { extractTextFromImage } = require("../utils/ocr.service");
const { parseReceiptText } = require("../utils/parseReceipt");
const { callGeminiForReceipt } = require("../utils/gemini.service");
const { sendSuccess, sendError } = require("../utils/response.util");
const { Receipt } = require("../models/receipt.model");
const { uploadCloudinary } = require("../utils/cloudinary.service");

const upload = async (req, res) => {
  try {
    if (!req.file) return sendError(res, 400, {}, "No file uploaded");

    const ocrText = await extractTextFromImage(req.file.buffer);

    let geminiParsed = await callGeminiForReceipt(ocrText);

    if (
      !geminiParsed ||
      typeof geminiParsed !== "object" ||
      !geminiParsed.vendor
    ) {
      console.warn("Gemini failed or incomplete — using fallback parser");
      geminiParsed = parseReceiptText(ocrText);
    }

    return sendSuccess(res, 200, geminiParsed, "OCR and parsing successful");
  } catch (error) {
    console.error("Upload error:", error);
    return sendError(res, 500, error, "Internal Server Error");
  }
};

const saveReceipt = async (req, res) => {
  try {
    const { vendor, date, invoiceNumber, address, amount, items } = req.body;
    const newReceipt = new Receipt({
      vendor,
      date,
      address,
      invoiceNumber,
      items,
      amount,
    });
    const insertedNewReceipt = await newReceipt.save();
    return sendSuccess(
      res,
      201,
      insertedNewReceipt,
      "Save Receipt Successfully"
    );
  } catch (error) {
    return sendError(res, 500, error, "Internal Server Error");
  }
};

const uploadToCloudinary = async (req, res) => {
  try {
    const cloudinaryResult = await uploadCloudinary(req.file.buffer, {
      folder: "spendly-receipts",
      resource_type: "image",
    });
    return sendSuccess(res, 200, cloudinaryResult, "Upload To Cloudinary successful");
  } catch (error) {
    console.log(error)
    return sendError(res, 500, error, "Internal Server Error");
  }
};

module.exports = { upload, saveReceipt, uploadToCloudinary };
