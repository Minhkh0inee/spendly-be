const { User } = require("../models/user.model");
const {
  hashed,
  compareHashedPassword,
  generateToken,
} = require("../utils/auth");
const { sendError, sendSuccess } = require("../utils/response.util");
const AUTH_ERR = { error: "Invalid credentials" };


const registerUser = async (req, res) => {
  const { email, password, name } = req.body;
  try {
    if (!email || !password || !name) {
      return sendError(res, 400, {}, "Missing name/email/password");
    }

    const exists = await User.findOne({ email }).lean();
    if (exists) return sendError(res, 400, {}, "Email already exists");

    const hashedPassword = await hashed(password);

    const doc = await User.create({ name, email, password: hashedPassword });

    const { password: _pw, ...safe } = doc.toObject();
    return sendSuccess(res, 201, safe, "Register Successfully");
  } catch (error) {
    if (error?.code === 11000 && error?.keyPattern?.email) {
      return sendError(res, 400, {}, "Email already exists");
    }
    console.error("Register error:", error);
    return sendError(res, 500, {}, "Internal Server Error");
  }
};

const signIn = async (req, res) => {

  try {
    let { email, password } = req.body || {};
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }
    email = String(email).trim()
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res.status(401).json(AUTH_ERR);
    }

    const ok = await compareHashedPassword(password, user.password);
    if (!ok) {
      return res.status(401).json(AUTH_ERR);
    }
    const payload = { id: user._id.toString(), email: user.email };
    const accessToken = generateToken(payload);
    return res.status(200).json({
      accessToken,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
      },
    });
  } catch (err) {
    console.error("Sign-in error:", err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = { registerUser, signIn };
