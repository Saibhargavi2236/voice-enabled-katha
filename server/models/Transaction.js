const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema(
  {
    // Shop
    shopId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      index: true
    },

    // MongoDB Customer ObjectId
    customerMongoId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
      required: true
    },

    // Business Customer ID (CUST0001)
    customerId: {
      type: String,
      required: true,
      index: true
    },

    // Purchased Items
    items: [
      {
        itemId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Item",
          required: true
        },

        itemName: {
          type: String,
          required: true
        },

        quantity: {
          type: Number,
          required: true
        },

        unit: {
          type: String,
          default: "piece"
        },

        unitPrice: {
          type: Number,
          required: true
        },

        totalPrice: {
          type: Number,
          required: true
        }
      }
    ],

    totalAmount: {
      type: Number,
      required: true
    },

    paidAmount: {
      type: Number,
      default: 0
    },

    dueAmount: {
      type: Number,
      default: 0
    },

    paymentMode: {
      type: String,
      enum: ["CASH", "UPI", "DUE", "PARTIAL"],
      default: "DUE"
    },

    source: {
    type: String,
    enum: [
        "VOICE",
        "MANUAL",
        "PAYMENT"
    ],
    default: "MANUAL"
},

    status: {
      type: String,
      enum: ["DRAFT", "CONFIRMED", "CANCELLED"],
      default: "CONFIRMED"
    },

    // Original voice spoken by shopkeeper
    spokenText: {
      type: String,
      default: ""
    },

    // Actual transaction date
    transactionDate: {
      type: Date,
      default: Date.now
    }
  },
  {
    timestamps: true
  }
);

// Useful indexes for reports

transactionSchema.index({ transactionDate: -1 });
transactionSchema.index({ shopId: 1, transactionDate: -1 });

module.exports = mongoose.model("Transaction", transactionSchema);