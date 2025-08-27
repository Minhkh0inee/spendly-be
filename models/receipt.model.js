const mongoose = require("mongoose");

const ReceiptSchema = new mongoose.Schema(
  {
    vendor: {
      type: String,
      required: [true, "Vendor is required"],
      trim: true,
    },
    date: {
      type: String,
      required: [true, "Date is required"],
      trim: true,
    },
    invoiceNumber: {
      type: String,
      required: [true, "invoiceNumber is required"],
      trim: true,
    },
    address: {
      type: String,
      required: [true, "Address is required"],
      trim: true,
    },
    amount: {
      type: String,
      required: [true, "Address is required"],
      trim: true,
    },
    items: [{
        name: {
            type: String,
            required: [true, "Item name is required"],
            trim: true,
        },
        qty: {
            type: Number,
            required: [true, "Quantity is required"],
            min: [0, "Quantity must be positive"],
        },
        price: {
            type: Number,
            required: [true, "Price is required"],
            min: [0, "Price must be positive"],
        }
    }],
    imgUrl: {
      type: String,
      required: [true, "imgUrl is required"],
      trim: true,
    },
    category: {
      type: String,
      required: [true, "Category is Required"],
      trim: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User reference is required"]
    }
  },
  { timestamps: true }
);

const Receipt = mongoose.model("Receipt", ReceiptSchema);

module.exports = { Receipt };
