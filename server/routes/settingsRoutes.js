const express = require("express");

const router = express.Router();

const authMiddleware =
require("../middleware/authMiddleware");

const roleMiddleware =
require("../middleware/roleMiddleware");

const {

    getProfile,

    updateProfile

} = require("../controllers/settingsController");

// -----------------------------
// Get Profile
// -----------------------------

router.get(

    "/profile",

    authMiddleware,

    roleMiddleware("SHOPKEEPER"),

    getProfile

);

// -----------------------------
// Update Profile
// -----------------------------

router.put(

    "/profile",

    authMiddleware,

    roleMiddleware("SHOPKEEPER"),

    updateProfile

);

module.exports = router;