const express = require("express");

const router = express.Router();

const authMiddleware =
require("../middleware/authMiddleware");

const roleMiddleware =
require("../middleware/roleMiddleware");

const {

    createManualTransaction,

    getAllTransactions,

    getTransactionById

} = require("../controllers/transactionController");

// ----------------------------------------
// Create Manual Transaction
// ----------------------------------------

router.post(

    "/manual",

    authMiddleware,

    roleMiddleware("SHOPKEEPER"),

    createManualTransaction

);

// ----------------------------------------
// Get All Transactions
// ----------------------------------------

router.get(

    "/",

    authMiddleware,

    roleMiddleware("SHOPKEEPER"),

    getAllTransactions

);

// ----------------------------------------
// Get Single Transaction
// ----------------------------------------

router.get(

    "/:id",

    authMiddleware,

    roleMiddleware("SHOPKEEPER"),

    getTransactionById

);

module.exports = router;