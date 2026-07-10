const mongoose = require("mongoose");
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const validator = require("validator");


const generateToken = require("../utils/jwt");

/*
    POST /api/auth/signup

    Body

    {
        "name":"Ramesh",
        "email":"ramesh@gmail.com",
        "phone":"9876543210",
        "password":"12345678",
        "role":"SHOPKEEPER"
    }
*/

const signup = async (req, res) => {

    try {

        const {
            name,
            email,
            phone,
            password,
            role,
             shopName = ""
        } = req.body;
         const cleanName = name ? name.trim() : "";
        const cleanEmail = email ? email.trim().toLowerCase() : "";
        const cleanPhone = phone ? phone.trim() : "";
        const cleanShopName = shopName ? shopName.trim() : "";

        // -----------------------------
        // Required fields
        // -----------------------------

       if (
    !cleanName ||
    !cleanEmail ||
    !cleanPhone ||
    !password ||
    !role
) {

    return res.status(400).json({
        success: false,
        message: "All fields are required."
    });

}

        // -----------------------------
        // Validate Email
        // -----------------------------

        if (!validator.isEmail(cleanEmail)) {

            return res.status(400).json({
                success: false,
                message: "Invalid email address."
            });

        }

        // -----------------------------
        // Validate Phone
        // -----------------------------

        if (!validator.isMobilePhone(cleanPhone, "en-IN")) {

            return res.status(400).json({
                success: false,
                message: "Invalid phone number."
            });

        }

        // -----------------------------
        // Password Length
        // -----------------------------
         const passwordRegex =
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;

        if (!passwordRegex.test(password)) {

            return res.status(400).json({
                success: false,
                message:
                    "Password must contain uppercase, lowercase and a number."
            });

        }

        // -----------------------------
        // Validate Role
        // -----------------------------

        const allowedRoles = [
            "SHOPKEEPER",
            "CUSTOMER",
            "ADMIN"
        ];

        if (!allowedRoles.includes(role)) {

            return res.status(400).json({
                success: false,
                message: "Invalid role."
            });

        }
        if (role === "SHOPKEEPER") {
            if(!cleanShopName){

    return res.status(400).json({
        success: false,
        message: "Shop name is required."
    });
}
if (cleanShopName.length < 3) {

                return res.status(400).json({
                    success: false,
                    message: "Shop name must contain at least 3 characters."
                });

            }

}

        // -----------------------------
        // Duplicate Email
        // -----------------------------

        const existingEmail = await User.findOne({
            email:cleanEmail
        });

        if (existingEmail) {

            return res.status(409).json({
                success: false,
                message: "Email already registered."
            });

        }

        // -----------------------------
        // Duplicate Phone
        // -----------------------------

        const existingPhone = await User.findOne({
            phone:cleanPhone
        });

        if (existingPhone) {

            return res.status(409).json({
                success: false,
                message: "Phone number already registered."
            });

        }

        // -----------------------------
        // Encrypt Password
        // -----------------------------

        const hashedPassword =
            await bcrypt.hash(password, 10);
            let shopId = null;

        if (role === "SHOPKEEPER") {

            shopId = new mongoose.Types.ObjectId();

        }

        // -----------------------------
        // Create User
        // -----------------------------

          const user = await User.create({

            name: cleanName,

            email: cleanEmail,

            phone: cleanPhone,

            password: hashedPassword,

            role,

            shopId,

            shopName:
                role === "SHOPKEEPER"
                    ? cleanShopName
                    : "",

            phoneVerified: false,

            emailVerified: false,

            profilePhoto: ""

        });


        // -----------------------------
        // Generate JWT
        // -----------------------------

        const token = generateToken(user);

        return res.status(201).json({

            success: true,

            message: "Account created successfully.",

            token,

             user: {

                id: user._id,

                shopId: user.shopId,

                shopName: user.shopName,

                name: user.name,

                email: user.email,

                phone: user.phone,

                role: user.role

            }

        });

    }

    catch (error) {

        console.log(error);

        return res.status(500).json({

            success: false,

            message: "Signup failed.",

            error: error.message

        });

    }

};
/*
    POST /api/auth/login

    Body

    {
        "email":"ramesh@gmail.com",
        "password":"Password123"
    }
*/

const login = async (req, res) => {

    try {

        const {
            email,
            password
        } = req.body;

        // -----------------------------
        // Required Fields
        // -----------------------------

        if (!email || !password) {

            return res.status(400).json({

                success: false,

                message: "Email and password are required."

            });

        }

        const cleanEmail = email.trim().toLowerCase();

        // -----------------------------
        // Validate Email
        // -----------------------------

        if (!validator.isEmail(cleanEmail)) {

            return res.status(400).json({

                success: false,

                message: "Invalid email address."

            });

        }

        // -----------------------------
        // Find User
        // -----------------------------

        const user = await User.findOne({

            email: cleanEmail

        });

        if (!user) {

            return res.status(401).json({

                success: false,

                message: "Invalid email or password."

            });

        }

        // -----------------------------
        // Check Active Account
        // -----------------------------

        if (!user.isActive) {

            return res.status(403).json({

                success: false,

                message: "Account has been disabled."

            });

        }

        // -----------------------------
        // Compare Password
        // -----------------------------

        const isPasswordCorrect =
            await bcrypt.compare(
                password,
                user.password
            );

        if (!isPasswordCorrect) {

            return res.status(401).json({

                success: false,

                message: "Invalid email or password."

            });

        }

        // -----------------------------
        // Update Last Login
        // -----------------------------

        user.lastLogin = new Date();

        await user.save();

        // -----------------------------
        // Generate JWT
        // -----------------------------

        const token = generateToken(user);

        return res.status(200).json({

            success: true,

            message: "Login successful.",

            token,

            user: {

                id: user._id,

                shopId: user.shopId,

                shopName: user.shopName,

                name: user.name,

                email: user.email,

                phone: user.phone,

                role: user.role,

                profilePhoto: user.profilePhoto,

                phoneVerified: user.phoneVerified,

                emailVerified: user.emailVerified

            }

        });

    }

    catch (error) {

        console.error(error);

        return res.status(500).json({

            success: false,

            message: "Login failed.",

            error: error.message

        });

    }

};

module.exports = {

    signup,
    login

};