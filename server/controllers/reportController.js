const Transaction = require("../models/Transaction");
const Customer = require("../models/Customer");
const Item = require("../models/item");
// ------------------------------------
// DAILY REPORT
// ------------------------------------

const getDailyReport = async (req, res) => {

    try {

        const SHOP_ID = req.user.shopId;

        const today = new Date();

        today.setHours(0, 0, 0, 0);

        const transactions = await Transaction.find({

            shopId: SHOP_ID,

            transactionDate: {

                $gte: today

            }

        });

        let totalSales = 0;

        let cash = 0;

        let upi = 0;

        let due = 0;

        transactions.forEach(transaction => {

            totalSales += transaction.totalAmount;

            if (transaction.paymentMode === "CASH") {

                cash += transaction.totalAmount;

            }

            else if (transaction.paymentMode === "UPI") {

                upi += transaction.totalAmount;

            }

            else {

                due += transaction.totalAmount;

            }

        });

        return res.status(200).json({

            success: true,

            report: {

                totalTransactions: transactions.length,

                totalSales,

                cash,

                upi,

                due

            }

        });

    }

    catch (error) {

        return res.status(500).json({

            success: false,

            message: "Could not generate daily report.",

            error: error.message

        });

    }

};


// ------------------------------------
// WEEKLY REPORT
// ------------------------------------

const getWeeklyReport = async (req, res) => {

    try {

        const SHOP_ID = req.user.shopId;

        const start = new Date();

        start.setDate(start.getDate() - 7);

        const transactions = await Transaction.find({

            shopId: SHOP_ID,

            transactionDate: {

                $gte: start

            }

        });

        let totalSales = 0;

        let totalDue = 0;

        transactions.forEach(transaction => {

            totalSales += transaction.totalAmount;

            totalDue += transaction.dueAmount;

        });

        return res.status(200).json({

            success: true,

            report: {

                totalTransactions: transactions.length,

                totalSales,

                totalDue

            }

        });

    }

    catch (error) {

        return res.status(500).json({

            success: false,

            message: "Could not generate weekly report.",

            error: error.message

        });

    }

};
const getMonthlyReport = async (req, res) => {

    try {

        const SHOP_ID = req.user.shopId;

        const start = new Date();

        start.setDate(1);

        start.setHours(0, 0, 0, 0);

        const transactions = await Transaction.find({

            shopId: SHOP_ID,

            transactionDate: {

                $gte: start

            }

        });

        let totalSales = 0;

        let totalDue = 0;

        let totalPaid = 0;

        transactions.forEach(transaction => {

            totalSales += transaction.totalAmount;

            totalDue += transaction.dueAmount;

            totalPaid += transaction.paidAmount;

        });

        return res.status(200).json({

            success: true,

            report: {

                totalTransactions: transactions.length,

                totalSales,

                totalPaid,

                totalDue

            }

        });

    }

    catch (error) {

        return res.status(500).json({

            success: false,

            message: "Could not generate monthly report.",

            error: error.message

        });

    }

};
const getCustomerReport = async (req, res) => {

    try {

        const SHOP_ID = req.user.shopId;

        const customerId = req.params.customerId;

        const customer = await Customer.findOne({

            shopId: SHOP_ID,

            customerId

        });

        if (!customer) {

            return res.status(404).json({

                success: false,

                message: "Customer not found."

            });

        }

        const transactions = await Transaction.find({

            shopId: SHOP_ID,

            customerId

        }).sort({

            transactionDate: -1

        });

        return res.status(200).json({

            success: true,

            customer,

            totalTransactions: transactions.length,

            transactions

        });

    }

    catch (error) {

        return res.status(500).json({

            success: false,

            message: "Could not fetch customer report.",

            error: error.message

        });

    }

};
const getPaymentReport = async (req, res) => {

    try {

        const SHOP_ID = req.user.shopId;

        const report = await Transaction.aggregate([

            {

                $match: {

                    shopId: SHOP_ID

                }

            },

            {

                $group: {

                    _id: "$paymentMode",

                    totalAmount: {

                        $sum: "$totalAmount"

                    },

                    count: {

                        $sum: 1

                    }

                }

            }

        ]);

        return res.status(200).json({

            success: true,

            report

        });

    }

    catch (error) {

        return res.status(500).json({

            success: false,

            message: "Could not generate payment report.",

            error: error.message

        });

    }

};
const getTopDueCustomers = async (req, res) => {

    try {

        const SHOP_ID = req.user.shopId;

        const customers = await Customer.find({

            shopId: SHOP_ID,

            totalDue: {

                $gt: 0

            }

        })

        .sort({

            totalDue: -1

        })

        .limit(10);

        return res.status(200).json({

            success: true,

            customers

        });

    }

    catch (error) {

        return res.status(500).json({

            success: false,

            message: "Could not fetch due customers.",

            error: error.message

        });

    }

};
const getTopSellingItems = async (req, res) => {

    try {

        const SHOP_ID = req.user.shopId;

        const report = await Transaction.aggregate([

            {

                $match: {

                    shopId: SHOP_ID

                }

            },

            {

                $unwind: "$items"

            },

            {

                $group: {

                    _id: "$items.itemName",

                    totalSold: {

                        $sum: "$items.quantity"

                    }

                }

            },

            {

                $sort: {

                    totalSold: -1

                }

            },

            {

                $limit: 10

            }

        ]);

        return res.status(200).json({

            success: true,

            report

        });

    }

    catch (error) {

        return res.status(500).json({

            success: false,

            message: "Could not fetch top selling items.",

            error: error.message

        });

    }

};
module.exports = {

    getDailyReport,

    getWeeklyReport,

    getMonthlyReport,

    getCustomerReport,

    getPaymentReport,

    getTopDueCustomers,

    getTopSellingItems

};