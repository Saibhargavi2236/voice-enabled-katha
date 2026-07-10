const Customer = require("../models/Customer");
const Item = require("../models/item");
const Transaction = require("../models/Transaction");

// ---------------------------------------------------
// Create Manual Transaction
// POST /api/transactions/manual
// ---------------------------------------------------

const createManualTransaction = async (req, res) => {

    try {

        const SHOP_ID = req.user.shopId;

        const {

            customerId,

            items,

            paymentMode = "DUE",

            paidAmount = 0

        } = req.body;

        // ----------------------------
        // Validation
        // ----------------------------

        if (!customerId || !items || items.length === 0) {

            return res.status(400).json({

                success: false,

                message: "Customer ID and items are required."

            });

        }

        // ----------------------------
        // Find Customer
        // ----------------------------

        const customer = await Customer.findOne({

            shopId: SHOP_ID,

            customerId: customerId.trim().toUpperCase()

        });

        if (!customer) {

            return res.status(404).json({

                success: false,

                message: "Customer not found."

            });

        }

        // ----------------------------
        // Calculate Transaction
        // ----------------------------

        let finalItems = [];

        let totalAmount = 0;

        for (const data of items) {

            const inventoryItem = await Item.findOne({

                shopId: SHOP_ID,

                itemCode: data.itemCode,

                status: "ACTIVE"

            });

            if (!inventoryItem) {

                return res.status(404).json({

                    success: false,

                    message: `Item ${data.itemCode} not found.`

                });

            }

            if (inventoryItem.stock < data.quantity) {

                return res.status(400).json({

                    success: false,

                    message:
                        `${inventoryItem.name} has insufficient stock.`

                });

            }

            const itemTotal =
                inventoryItem.sellingPrice * data.quantity;

            totalAmount += itemTotal;

            finalItems.push({

                itemId: inventoryItem._id,

                itemName: inventoryItem.name,

                quantity: data.quantity,

                unit: inventoryItem.unit,

                unitPrice: inventoryItem.sellingPrice,

                totalPrice: itemTotal

            });

        }
                // ----------------------------
        // Calculate Paid & Due
        // ----------------------------

        let finalPaidAmount = 0;
        let dueAmount = totalAmount;

        if (paymentMode === "CASH" || paymentMode === "UPI") {

            finalPaidAmount = totalAmount;
            dueAmount = 0;

        }

        else if (paymentMode === "PARTIAL") {

            if (paidAmount <= 0 || paidAmount >= totalAmount) {

                return res.status(400).json({

                    success: false,

                    message:
                        "Enter a valid paid amount."

                });

            }

            finalPaidAmount = paidAmount;
            dueAmount = totalAmount - paidAmount;

        }

        // ----------------------------
        // Update Inventory Stock
        // ----------------------------

        for (const data of items) {

            const inventoryItem = await Item.findOne({

                shopId: SHOP_ID,

                itemCode: data.itemCode,

                status: "ACTIVE"

            });

            inventoryItem.stock -= data.quantity;

            await inventoryItem.save();

        }

        // ----------------------------
        // Update Customer Due
        // ----------------------------

        customer.totalDue += dueAmount;

        customer.totalPurchase += totalAmount;

        customer.totalPaid += finalPaidAmount;

        await customer.save();

        // ----------------------------
        // Save Transaction
        // ----------------------------

        const transaction = await Transaction.create({

            shopId: SHOP_ID,

            customerMongoId: customer._id,

            customerId: customer.customerId,

            items: finalItems,

            totalAmount,

            paidAmount: finalPaidAmount,

            dueAmount,

            paymentMode,

            source: "MANUAL",

            status: "CONFIRMED",

            spokenText: "Manual Transaction",

            transactionDate: Date.now()

        });

        return res.status(201).json({

            success: true,

            message: "Transaction saved successfully.",

            transaction

        });

    }

    catch (error) {

        console.error(error);

        return res.status(500).json({

            success: false,

            message: "Could not save transaction.",

            error: error.message

        });

    }

};
// ---------------------------------------------------
// Get All Transactions
// GET /api/transactions
// ---------------------------------------------------

const getAllTransactions = async (req, res) => {

    try {

        const SHOP_ID = req.user.shopId;

        const transactions = await Transaction.find({

            shopId: SHOP_ID

        })
        .populate(
            "customerMongoId",
            "customerId name phone"
        )
        .sort({

            transactionDate: -1

        });

        return res.status(200).json({

            success: true,

            totalTransactions: transactions.length,

            transactions

        });

    }

    catch (error) {

        return res.status(500).json({

            success: false,

            message: "Could not fetch transactions.",

            error: error.message

        });

    }

};

// ---------------------------------------------------
// Get Single Transaction
// GET /api/transactions/:id
// ---------------------------------------------------

const getTransactionById = async (req, res) => {

    try {

        const SHOP_ID = req.user.shopId;

        const transaction = await Transaction.findOne({

            _id: req.params.id,

            shopId: SHOP_ID

        })
        .populate(
            "customerMongoId",
            "customerId name phone"
        );

        if (!transaction) {

            return res.status(404).json({

                success: false,

                message: "Transaction not found."

            });

        }

        return res.status(200).json({

            success: true,

            transaction

        });

    }

    catch (error) {

        return res.status(500).json({

            success: false,

            message: "Could not fetch transaction.",

            error: error.message

        });

    }

};

// ---------------------------------------------------

module.exports = {

    createManualTransaction,

    getAllTransactions,

    getTransactionById

};