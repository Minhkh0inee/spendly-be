const { extractTextFromImage } = require("../utils/ocr.service");
const { parseReceiptText } = require("../utils/parseReceipt");
const { callGeminiForReceipt } = require("../utils/gemini.service");
const { sendSuccess, sendError } = require("../utils/response.util");

const upload = async (req, res) => {
  try {
    if (!req.file) return sendError(res, 400, {}, "No file uploaded");

    const ocrText = await extractTextFromImage(req.file.buffer);

    let geminiParsed = await callGeminiForReceipt(ocrText);

    if (!geminiParsed || typeof geminiParsed !== 'object' || !geminiParsed.vendor) {
      console.warn("Gemini failed or incomplete — using fallback parser");
      geminiParsed = parseReceiptText(ocrText);
    }

    return sendSuccess(res, 200, geminiParsed, "OCR and parsing successful");
  } catch (error) {
    console.error("Upload error:", error);
    return sendError(res, 500, error, "Internal Server Error");
  }
};

module.exports = { upload };
