const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
{
    name:{
        type:String,
        required:true,
        trim:true
    },

    email:{
        type:String,
        required:true,
        unique:true,
        lowercase:true,
        trim:true
    },

    phone:{
        type:String,
        required:true,
        unique:true,
        trim:true
    },

    password:{
        type:String,
        required:true
    },

    role:{
        type:String,
        enum:["SHOPKEEPER","CUSTOMER","ADMIN"],
        required:true
    },

    // Shop owned by shopkeeper
    shopId:{
        type:mongoose.Schema.Types.ObjectId,
        default:null,
        index:true
    },

    shopName:{
        type:String,
        default:"",
        trim:true
    },
    

    profilePhoto:{
        type:String,
        default:""
    },

    phoneVerified:{
        type:Boolean,
        default:false
    },

    emailVerified:{
        type:Boolean,
        default:false
    },

    isActive:{
        type:Boolean,
        default:true
    },

    lastLogin:{
        type:Date,
        default:null
    }

},
{
    timestamps:true
});

module.exports = mongoose.model("User", userSchema);