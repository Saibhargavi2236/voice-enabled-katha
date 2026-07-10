const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema({

    shopId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Shop",
        required:true
    },

    title:{
        type:String,
        required:true
    },

    message:{
        type:String,
        required:true
    },

    type:{
        type:String,
        enum:[
            "LOW_STOCK",
            "PAYMENT",
            "DUE",
            "SYSTEM"
        ],
        required:true
    },

    isRead:{
        type:Boolean,
        default:false
    }

},{
    timestamps:true
});

module.exports =
mongoose.model(
    "Notification",
    notificationSchema
);