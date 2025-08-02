require("dotenv").config();
const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

const callGeminiForReceipt = async (rawText) => {
  const prompt = `
You are an intelligent receipt parser. Read the OCR text below and extract:
- vendor
- date
- invoice number (if any)
- address (if present)
- total amount
- items (name, qty, price if possible)

Return output in this JSON format:
{
  "vendor": "",
  "date": "",
  "invoiceNumber": "",
  "address": "",
  "amount": "",
  "items": [
    { "name": "", "qty": 0, "price": 0 }
  ]
}

Text:
"""
${rawText}
"""
Only return JSON. No explanation.
`;

  const result = await model.generateContent(prompt);
  const text = result.response.text();

  try {
    const jsonStart = text.indexOf('{');
    const jsonEnd = text.lastIndexOf('}');
    const jsonStr = text.slice(jsonStart, jsonEnd + 1);
    return JSON.parse(jsonStr);
  } catch (e) {
    console.error("Gemini parse error:", text);
    return null;
  }
};

module.exports = { callGeminiForReceipt };
