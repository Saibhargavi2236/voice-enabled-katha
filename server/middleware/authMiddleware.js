const jwt = require("jsonwebtoken");
const User = require("../models/user");

const authMiddleware = async (req, res, next) => {

    try {

        // ---------------------------------
        // Get Authorization Header
        // ---------------------------------

        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {

            return res.status(401).json({

                success: false,

                message: "Access denied. Token missing."

            });

        }

        // ---------------------------------
        // Extract Token
        // ---------------------------------

        const token = authHeader.split(" ")[1];

        // ---------------------------------
        // Verify Token
        // ---------------------------------

        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        // ---------------------------------
        // Find User
        // ---------------------------------

        const user = await User.findById(decoded.userId)
            .select("-password");

        if (!user) {

            return res.status(401).json({

                success: false,

                message: "User not found."

            });

        }

        // ---------------------------------
        // Check Active Account
        // ---------------------------------

        if (!user.isActive) {

            return res.status(403).json({

                success: false,

                message: "Account is inactive."

            });

        }

        // ---------------------------------
        // Attach User
        // ---------------------------------

        req.user = user;

        next();

    }

    catch (error) {

        return res.status(401).json({

            success: false,

            message: "Invalid or expired token.",

            error: error.message

        });

    }

};

module.exports = authMiddleware;