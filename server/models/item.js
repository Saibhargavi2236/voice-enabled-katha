const mongoose = require("mongoose");

const itemSchema = new mongoose.Schema(
{
    shopId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Shop",
        required: true
    },

    itemCode: {
        type: String,
        required: true
    },

    name: {
        type: String,
        required: true,
        trim: true
    },

    category: {
        type: String,
        default: "General"
    },

    unit: {
        type: String,
        enum: [
            "kg",
            "gram",
            "liter",
            "ml",
            "piece",
            "packet",
            "box",
            "dozen"
        ],
        default: "piece"
    },

    sellingPrice: {
        type: Number,
        required: true,
        min: 0
    },

    purchasePrice: {
        type: Number,
        default: 0
    },

    stock: {
        type: Number,
        default: 0
    },

    minimumStock: {
        type: Number,
        default: 5
    },

    status: {
        type: String,
        enum: ["ACTIVE","INACTIVE"],
        default: "ACTIVE"
    }

},
{
    timestamps:true
});

itemSchema.index(
    {
        shopId:1,
        name:1
    },
    {
        unique:true
    }
);

module.exports = mongoose.model("Item", itemSchema);