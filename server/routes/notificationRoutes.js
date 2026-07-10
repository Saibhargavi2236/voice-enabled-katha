const express = require("express");

const router = express.Router();

const authMiddleware =
require("../middleware/authMiddleware");

const roleMiddleware =
require("../middleware/roleMiddleware");

const {

    getNotifications,

    generateNotifications

} =
require("../controllers/notificationController");

router.get(

    "/",

    authMiddleware,

    roleMiddleware("SHOPKEEPER"),

    getNotifications

);

router.post(

    "/generate",

    authMiddleware,

    roleMiddleware("SHOPKEEPER"),

    generateNotifications

);

module.exports = router;