const calculateConfidence = (vendor, dateMatch, amount) => {
  let confidence = 0;
  if (vendor && vendor !== 'Unknown Vendor') confidence += 30;
  if (dateMatch) confidence += 35;
  if (amount) confidence += 35;
  return confidence;
};

const parseReceiptText = (text) => {
  
  const cleanText = text
    .replace(/\\n/g, '\n')  
    .replace(/\s+/g, ' ')   
    .trim();

  const lower = cleanText.toLowerCase();

  const datePatterns = [
    /(\d{1,2}\s+(january|february|march|april|may|june|july|august|september|october|november|december)\s+\d{4})/i,
    /(\d{1,2}\s+(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)\s+\d{4})/i,
    /(\d{1,2}[\/\-]\d{1,2}[\/\-]\d{4})/,
    /(\d{4}[\/\-]\d{1,2}[\/\-]\d{1,2})/
  ];

  let dateMatch = null;
  for (const pattern of datePatterns) {
    dateMatch = lower.match(pattern);
    if (dateMatch) break;
  }

  const amountPatterns = [
    /(?:grand\s*total|total|amount\s*due)[\s:$]*(\d+(?:\.\d{2})?)/i,
    /total[\s:$]*(\d+(?:\.\d{2})?)/i,
    // Last dollar amount in text (fallback)
    /\$\s*(\d+(?:\.\d{2})?)/g
  ];

  let totalAmount = null;
  for (const pattern of amountPatterns) {
    const match = lower.match(pattern);
    if (match) {
      totalAmount = match[1];
      break;
    }
  }

  if (!totalAmount) {
    const dollarMatches = [...lower.matchAll(/\$\s*(\d+(?:\.\d{2})?)/g)];
    if (dollarMatches.length > 0) {
      totalAmount = dollarMatches[dollarMatches.length - 1][1];
    }
  }

  const lines = cleanText.split('\n').filter(line => line.trim());
  let vendor = 'Unknown Vendor';
  
  for (let i = 0; i < Math.min(5, lines.length); i++) {
    const line = lines[i].trim();
    if (line && 
        !line.toLowerCase().includes('invoice') && 
        !line.toLowerCase().includes('date') &&
        !line.toLowerCase().includes('issued') &&
        line.length > 2) {
      vendor = line;
      break;
    }
  }

  const invoiceNumberMatch = cleanText.match(/invoice\s*(?:no|number)[\s:]*(\w+)/i);
  const addressMatch = cleanText.match(/(\d+\s+[^,\n]+(?:st|street|ave|avenue|rd|road|blvd|boulevard)[^,\n]*)/i);

  const result = {
    vendor: vendor.trim(),
    date: dateMatch?.[1] || dateMatch?.[0] || null,
    amount: totalAmount || null,
    invoiceNumber: invoiceNumberMatch?.[1] || null,
    address: addressMatch?.[1] || null,
    rawText: text,
    confidence: calculateConfidence(vendor, dateMatch, totalAmount)
  };

  return result;
};

module.exports = {parseReceiptText}