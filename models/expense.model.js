const mongoose = require("mongoose")

const expenseSchema = new mongoose.Schema({
  project: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // creator

  vendor: { type: String },
  date: { type: Date },
  amount: { type: Number },
  currency: { type: String, default: 'USD' },

  category: { type: String }, 

  notes: { type: String },
  receiptUrl: { type: String }, 
  rawText: { type: String },    

}, { timestamps: true });

export default mongoose.model('Expense', expenseSchema);