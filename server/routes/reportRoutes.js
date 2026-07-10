const express = require("express");

const router = express.Router();

const authMiddleware =
require("../middleware/authMiddleware");

const roleMiddleware =
require("../middleware/roleMiddleware");

const {
    getDailyReport,
    getWeeklyReport,
    getMonthlyReport,
    getCustomerReport,
    getPaymentReport,
    getTopDueCustomers,
    getTopSellingItems
} = require("../controllers/reportController");

router.get(

    "/daily",

    authMiddleware,

    roleMiddleware("SHOPKEEPER"),

    getDailyReport

);

router.get(

    "/weekly",

    authMiddleware,

    roleMiddleware("SHOPKEEPER"),

    getWeeklyReport

);
router.get(
    "/monthly",
    authMiddleware,
    roleMiddleware("SHOPKEEPER"),
    getMonthlyReport
);

router.get(
    "/customer/:customerId",
    authMiddleware,
    roleMiddleware("SHOPKEEPER"),
    getCustomerReport
);

router.get(
    "/payment",
    authMiddleware,
    roleMiddleware("SHOPKEEPER"),
    getPaymentReport
);

router.get(
    "/top-due-customers",
    authMiddleware,
    roleMiddleware("SHOPKEEPER"),
    getTopDueCustomers
);

router.get(
    "/top-selling-items",
    authMiddleware,
    roleMiddleware("SHOPKEEPER"),
    getTopSellingItems
);

module.exports = router;