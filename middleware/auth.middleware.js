const jwt = require("jsonwebtoken");
const { sendError } = require("../utils/response.util");
const dotenv = require('dotenv')
dotenv.config()

function verifyToken(req, res, next) {
    const token = req.header("Authorization");


if (!token) 
    return sendError(res, 401, "INVALID_TOKEN", "Token not provided - Access Denied")
    const cleanToken = token.replace("Bearer ", "");
  try {
    const decoded = jwt.verify(cleanToken, process.env.JWT_SECRET_KEY);
    req.userId = decoded.userId;
    next();
  } catch (error) {
    return sendError(res, 401, "INVALID_TOKEN", "Token Invalid - Access Denied")
  }
}

module.exports = verifyToken;
