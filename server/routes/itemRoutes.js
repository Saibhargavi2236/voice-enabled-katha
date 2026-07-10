const express = require("express");

const router = express.Router();

const {

    addItem,

    getItems,

    updateItem,

    deleteItem,

    searchItems,

    getLowStockItems,
    getInventoryHistory

} = require("../controllers/itemController");

const authMiddleware =
require("../middleware/authMiddleware");

const roleMiddleware =
require("../middleware/roleMiddleware");

router.post(

    "/",

    authMiddleware,

    roleMiddleware("SHOPKEEPER"),

    addItem

);

router.get(

    "/",

    authMiddleware,

    roleMiddleware("SHOPKEEPER"),

    getItems

);
router.put(
    "/:id",
    authMiddleware,
    roleMiddleware("SHOPKEEPER"),
    updateItem
);

router.delete(
    "/:id",
    authMiddleware,
    roleMiddleware("SHOPKEEPER"),
    deleteItem
);

router.get(
    "/search",
    authMiddleware,
    roleMiddleware("SHOPKEEPER"),
    searchItems
);

router.get(
    "/low-stock",
    authMiddleware,
    roleMiddleware("SHOPKEEPER"),
    getLowStockItems
);
router.get(

    "/history",

    authMiddleware,

    roleMiddleware("SHOPKEEPER"),

    getInventoryHistory

);
module.exports = router;