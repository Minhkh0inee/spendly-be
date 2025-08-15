const { extractTextFromImage } = require("../utils/ocr.service");
const { parseReceiptText } = require("../utils/parseReceipt");
const { callGeminiForReceipt } = require("../utils/gemini.service");
const { sendSuccess, sendError } = require("../utils/response.util");
const { Receipt } = require("../models/receipt.model");
const { uploadCloudinary } = require("../utils/cloudinary.service");
const { parseItems } = require("../utils/parseItems");

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
    if (!req.file) {
      return sendError(res, 400, {}, "No file uploaded");
    }

    const { vendor, date, invoiceNumber, address, amount, items, category } = req.body;
    let parsedItems;
    try {
      parsedItems = parseItems(items);
    } catch (err) {
      return sendError(res, 400, {}, err.message);
    }

    const uploadPromise = uploadCloudinary(req.file.buffer, {
      folder: 'spendly-receipts',
      resource_type: 'image',
      timeout: 30000
    });

    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Upload timeout')), 35000);
    });

    let cloudinaryResult;
    try {
      cloudinaryResult = await Promise.race([uploadPromise, timeoutPromise]);
    } catch (error) {
      console.error('Cloudinary upload failed:', error);
      return sendError(res, 408, {}, "File upload timeout or failed");
    }

    const newReceipt = new Receipt({
      vendor,
      date,
      address,
      invoiceNumber,
      amount,
      items: parsedItems,
      imgUrl: cloudinaryResult.secure_url,
      category
    });

    const inserted = await newReceipt.save();
    return sendSuccess(res, 201, inserted, "Save Receipt Successfully");
  } catch (error) {
    console.error('Save receipt error:', error);
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
