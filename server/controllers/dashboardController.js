const Customer = require("../models/Customer");
const Transaction = require("../models/Transaction");

const getDashboardSummary = async (req, res) => {

    try {

        const SHOP_ID = req.user.shopId;

        const today = new Date();

        today.setHours(0, 0, 0, 0);

        // -----------------------------
        // Total Customers
        // -----------------------------

        const totalCustomers =
            await Customer.countDocuments({
                shopId: SHOP_ID
            });

        // -----------------------------
        // Total Outstanding Due
        // -----------------------------

        const dueResult =
            await Customer.aggregate([
                {
                    $match: {
                        shopId: SHOP_ID
                    }
                },
                {
                    $group: {
                        _id: null,
                        totalDue: {
                            $sum: "$totalDue"
                        }
                    }
                }
            ]);

        const totalOutstanding =
            dueResult.length > 0
                ? dueResult[0].totalDue
                : 0;

        // -----------------------------
        // Today's Transactions
        // -----------------------------

        const todayTransactions =
            await Transaction.countDocuments({

                shopId: SHOP_ID,

                transactionDate: {

                    $gte: today

                }

            });

        // -----------------------------
        // Today's Collection
        // -----------------------------

        const collectionResult =
            await Transaction.aggregate([

                {
                    $match: {

                        shopId: SHOP_ID,

                        transactionDate: {

                            $gte: today

                        }

                    }

                },

                {

                    $group: {

                        _id: null,

                        totalCollection: {

                            $sum: "$paidAmount"

                        }

                    }

                }

            ]);

        const todayCollection =
            collectionResult.length > 0
                ? collectionResult[0].totalCollection
                : 0;

        // -----------------------------
        // Today's Due
        // -----------------------------

        const dueToday =
            await Transaction.aggregate([

                {

                    $match: {

                        shopId: SHOP_ID,

                        transactionDate: {

                            $gte: today

                        }

                    }

                },

                {

                    $group: {

                        _id: null,

                        totalDue: {

                            $sum: "$dueAmount"

                        }

                    }

                }

            ]);

        const todayDue =
            dueToday.length > 0
                ? dueToday[0].totalDue
                : 0;

        return res.status(200).json({

            success: true,

            dashboard: {

                totalCustomers,

                totalOutstanding,

                todayTransactions,

                todayCollection,

                todayDue

            }

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
        const getRecentTransactions = async (req, res) => {

    try {

        const SHOP_ID = req.user.shopId;

        const transactions = await Transaction.find({

            shopId: SHOP_ID

        })
        .populate("customerMongoId", "customerId name phone")
        .sort({ transactionDate: -1 })
        .limit(10);

        return res.status(200).json({

            success: true,

            total: transactions.length,

            transactions

        });

    }

    catch (error) {

        return res.status(500).json({

            success: false,

            message: "Could not fetch recent transactions.",

            error: error.message

        });

    }

};
const getTopDueCustomers = async (req, res) => {

    try {

        const SHOP_ID = req.user.shopId;

        const customers = await Customer.find({

            shopId: SHOP_ID,

            totalDue: { $gt: 0 }

        })
        .sort({ totalDue: -1 })
        .limit(10)
        .select(

            "customerId name phone totalDue creditLimit"

        );

        return res.status(200).json({

            success: true,

            customers

        });

    }

    catch (error) {

        console.error(error);

        return res.status(500).json({

            success: false,

            message: "Could not load dashboard.",

            error: error.message

        });

    }

};
const getCustomerDueList = async (req, res) => {

    try {

        const SHOP_ID = req.user.shopId;

        const customers = await Customer.find({

            shopId: SHOP_ID

        })
        .select(

            "customerId name phone totalDue totalPaid totalPurchase"

        )
        .sort({

            name: 1

        });

        return res.status(200).json({

            success: true,

            totalCustomers: customers.length,

            customers

        });

    }

    catch (error) {

        return res.status(500).json({

            success: false,

            message: "Could not fetch customer dues.",

            error: error.message

        });

    }

};

module.exports = {

    getDashboardSummary,

    getRecentTransactions,

    getTopDueCustomers,

    getCustomerDueList

};