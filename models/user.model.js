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
    receipts: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Receipt"
    }],
    projects: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project"
    }]
  },
  { timestamps: true }
);

// Add utility methods for managing relationships
UserSchema.methods.addProject = function(projectId) {
  if (!this.projects.includes(projectId)) {
    this.projects.push(projectId);
  }
  return this.save();
};

UserSchema.methods.removeProject = function(projectId) {
  this.projects = this.projects.filter(id => !id.equals(projectId));
  return this.save();
};

UserSchema.methods.addReceipt = function(receiptId) {
  if (!this.receipts.includes(receiptId)) {
    this.receipts.push(receiptId);
  }
  return this.save();
};

UserSchema.methods.removeReceipt = function(receiptId) {
  this.receipts = this.receipts.filter(id => !id.equals(receiptId));
  return this.save();
};

// Virtual fields for counts
UserSchema.virtual('projectCount').get(function() {
  return this.projects.length;
});

UserSchema.virtual('receiptCount').get(function() {
  return this.receipts.length;
});

// Include virtuals in JSON
UserSchema.set('toJSON', { virtuals: true });
UserSchema.set('toObject', { virtuals: true });

UserSchema.index({ email: 1 }, { unique: true });
const User = mongoose.model("User", UserSchema);

module.exports = { User };
