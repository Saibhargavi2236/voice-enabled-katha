const express = require("express");

const router = express.Router();

const authMiddleware =
require("../middleware/authMiddleware");

const roleMiddleware =
require("../middleware/roleMiddleware");

const {

    collectPayment

} = require("../controllers/paymentController");

router.post(

    "/collect",

    authMiddleware,

    roleMiddleware("SHOPKEEPER"),

    collectPayment

);

module.exports = router;