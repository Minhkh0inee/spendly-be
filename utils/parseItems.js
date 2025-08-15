function parseItems(raw) {
  if (!raw) return [];

  let parsed = raw;
  if (typeof raw === "string") {
    try {
     
      parsed = JSON.parse(raw);
    } catch {
      throw new Error("Invalid JSON in 'items'");
    }
  }

  if (!Array.isArray(parsed)) {
    throw new Error("'items' must be an array");
  }

  return parsed;
}

module.exports = {parseItems}