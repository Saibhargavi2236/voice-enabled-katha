const express = require("express");

const router = express.Router();

const authMiddleware =
require("../middleware/authMiddleware");

const roleMiddleware =
require("../middleware/roleMiddleware");

const {

    getDashboardSummary

} = require("../controllers/dashboardController");

router.get(

    "/summary",

    authMiddleware,

    roleMiddleware("SHOPKEEPER"),

    getDashboardSummary

);

module.exports = router;