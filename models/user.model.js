const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      trim: true
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      select: false 
    },
    //   role: { type: String, enum: ["owner", "viewer", "accountant"] },
  },
  { timestamps: true }
);

UserSchema.index({ email: 1 }, { unique: true });
const User = mongoose.model("User", UserSchema);

module.exports = { User };
