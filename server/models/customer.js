const mongoose = require("mongoose");
const customerSchema = new mongoose.Schema(
{
    shopId:{
        type:mongoose.Schema.Types.ObjectId,
        required:true
    },
    customerId: {
    type: String,
    required: true
},

    name:{
        type:String,
        required:true
    },

    phone:{
        type:String,
        default:""
    },
    phoneVerified: {
    type: Boolean,
    default: false
},

otp: {
    type: String,
    default: ""
},

otpExpires: {
    type: Date,
    default: null
},

    address:{
        type:String,
        default:""
    },

    email:{
        type:String,
        default:""
    },

    paymentPreference:{
        type:String,
        enum:["Cash","UPI","Bank"],
        default:"Cash"
    },
    status: {
    type: String,
    enum: ["ACTIVE", "BLOCKED", "INACTIVE"],
    default: "ACTIVE"
},

    bankDetails:{
        accountHolder:{
            type:String,
            default:""
        },
        bankName:{
            type:String,
            default:""
        },
        accountNumber:{
            type:String,
            default:""
        },
        ifsc:{
            type:String,
            default:""
        },
        verified: {
        type: Boolean,
        default: false
    },

    verificationMethod: {
        type: String,
        enum: ["NONE", "MANUAL", "BANK_API"],
        default: "NONE"
    },

    verifiedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: null
    },

    verifiedAt: {
        type: Date,
        default: null
    }
    },

    upiDetails: {
    upiId: {
        type: String,
        default: ""
    },

    verified: {
        type: Boolean,
        default: false
    }
},

    creditLimit:{
        type:Number,
        default:0
    },

    totalDue:{
        type:Number,
        default:0
    },

    totalPaid:{
        type:Number,
        default:0
    },

    totalPurchase:{
        type:Number,
        default:0
    }

},
{
    timestamps:true
});
customerSchema.index(
    {
        shopId: 1,
        customerId: 1
    },
    {
        unique: true
    }
);
module.exports = mongoose.model("Customer", customerSchema);