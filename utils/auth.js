const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken')
const dotenv = require('dotenv')
dotenv.config()

const hashed = async (password)  => {
    return await bcrypt.hash(password, 10)
}

const compareHashedPassword = async (password, hashedPassword) => {
    return await bcrypt.compare(password, hashedPassword);
}

const generateToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

module.exports = {hashed, compareHashedPassword, generateToken}