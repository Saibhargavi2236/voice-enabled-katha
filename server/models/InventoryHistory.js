const mongoose = require("mongoose");

const inventoryHistorySchema = new mongoose.Schema({

    shopId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Shop",
        required: true
    },

    itemId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Item",
        required: true
    },

    transactionId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Transaction",
        default: null
    },

    type: {
        type: String,
        enum: [
            "PURCHASE",
            "SALE",
            "MANUAL_ADD",
            "MANUAL_REMOVE"
        ],
        required: true
    },

    quantity: {
        type: Number,
        required: true
    },

    stockBefore: {
        type: Number,
        required: true
    },

    stockAfter: {
        type: Number,
        required: true
    },

    remarks: {
        type: String,
        default: ""
    }

}, {
    timestamps: true
});

module.exports = mongoose.model(
    "InventoryHistory",
    inventoryHistorySchema
);