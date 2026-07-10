const Customer = require("../models/Customer");
const Transaction = require("../models/Transaction");

const collectPayment = async (req, res) => {

    try {

        const SHOP_ID = req.user.shopId;

        const {

            customerId,

            amount,

            paymentMode

        } = req.body;

        if (!customerId || !amount || amount <= 0) {

            return res.status(400).json({

                success: false,

                message: "Customer ID and valid amount are required."

            });

        }

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

        if (customer.totalDue < amount) {

            return res.status(400).json({

                success: false,

                message: "Amount exceeds customer's due."

            });

        }

        customer.totalDue -= amount;

        customer.totalPaid += amount;

        await customer.save();

        const payment = await Transaction.create({

            transactionDate: Date.now(),

            shopId: SHOP_ID,

            customerMongoId: customer._id,

            customerId: customer.customerId,

            items: [],

            totalAmount: amount,

            paidAmount: amount,

            dueAmount: 0,

            paymentMode,

            source: "PAYMENT",

            status: "CONFIRMED",

            spokenText: "Manual Payment Collection"

        });

        return res.status(201).json({

            success: true,

            message: "Payment collected successfully.",

            payment,

            customer

        });

    }

    catch (error) {

        return res.status(500).json({

            success: false,

            message: "Could not collect payment.",

            error: error.message

        });

    }

};

module.exports = {

    collectPayment

};