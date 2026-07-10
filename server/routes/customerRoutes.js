const express = require("express");
const validator = require("validator");
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

const Customer = require("../models/Customer");
const Transaction = require("../models/Transaction");

const router = express.Router();

// Temporary until authentication is added

/* =====================================================
   Helper Function
===================================================== */

function buildCustomerResponse(customer) {
    return {
        _id: customer._id,
        customerId: customer.customerId,
        name: customer.name,
        phone: customer.phone,
        phoneVerified: customer.phoneVerified,
        email: customer.email,
        address: customer.address,
        paymentPreference: customer.paymentPreference,
        creditLimit: customer.creditLimit,
        totalDue: customer.totalDue,
        totalPaid: customer.totalPaid,
        totalPurchase: customer.totalPurchase,
        bankDetails: customer.bankDetails,
        upiDetails: customer.upiDetails,
        status: customer.status,
        createdAt: customer.createdAt,
        updatedAt: customer.updatedAt
    };
}

/* =====================================================
   CREATE CUSTOMER
===================================================== */

router.post("/", authMiddleware,
    roleMiddleware("SHOPKEEPER"),async (req, res) => {
    const SHOP_ID = req.user.shopId;

    try {

        const {
            name,
            phone,
            email = ""
        } = req.body;

        // ----------------------------
        // Required Fields
        // ----------------------------

        if (!name || !name.trim()) {

            return res.status(400).json({
                success: false,
                message: "Customer name is required."
            });

        }

        if (!phone || !phone.trim()) {

            return res.status(400).json({
                success: false,
                message: "Phone number is required."
            });

        }

        const cleanName = name.trim();
        const cleanPhone = phone.trim();

        // ----------------------------
        // Phone Validation
        // ----------------------------

        const phoneRegex = /^[6-9]\d{9}$/;

        if (!phoneRegex.test(cleanPhone)) {

            return res.status(400).json({
                success: false,
                message: "Invalid phone number."
            });

        }

        // ----------------------------
        // Email Validation
        // ----------------------------

        if (email && !validator.isEmail(email)) {

            return res.status(400).json({
                success: false,
                message: "Invalid email."
            });

        }

        // ----------------------------
        // Duplicate Customer Name
        // ----------------------------

        const existingCustomer = await Customer.findOne({

            shopId: SHOP_ID,

            name: {
                $regex: new RegExp(`^${cleanName}$`, "i")
            }

        });

        if (existingCustomer) {

            return res.status(409).json({

                success: false,

                message: "Customer already exists."

            });

        }

        // ----------------------------
        // Duplicate Phone
        // ----------------------------

        const existingPhone = await Customer.findOne({

            shopId: SHOP_ID,

            phone: cleanPhone

        });

        if (existingPhone) {

            return res.status(409).json({

                success: false,

                message: "Phone number already exists."

            });

        }

        // ----------------------------
        // Generate Customer ID
        // ----------------------------

        const lastCustomer = await Customer.findOne({

            shopId: SHOP_ID

        }).sort({

            createdAt: -1

        });

        let nextNumber = 1;

        if (
            lastCustomer &&
            lastCustomer.customerId
        ) {

            nextNumber =
                parseInt(
                    lastCustomer.customerId.replace("CUST", "")
                ) + 1;

        }

        const customerId =
            `CUST${String(nextNumber).padStart(4, "0")}`;

        // ----------------------------
        // Create Customer
        // ----------------------------

        const customer = await Customer.create({

            customerId,

            shopId: SHOP_ID,

            name: cleanName,

            phone: cleanPhone,

            email: email.trim().toLowerCase(),

            address: "",

            phoneVerified: false,

            otp: "",

            otpExpires: null,

            paymentPreference: "Cash",

            status: "ACTIVE",

            totalDue: 0,

            totalPaid: 0,

            totalPurchase: 0,

            creditLimit:5000,

            bankDetails: {

                accountHolder: "",

                bankName: "",

                accountNumber: "",

                ifsc: "",

                verified: false,

                verificationMethod: "NONE",

                verifiedBy: null,

                verifiedAt: null

            },

            upiDetails: {

                upiId: "",

                verified: false

            }

        });

        return res.status(201).json({

            success: true,

            message: "Customer created successfully.",

            customer: buildCustomerResponse(customer)

        });

    }

    catch (error) {

        return res.status(500).json({

            success: false,

            message: "Could not create customer.",

            error: error.message

        });

    }

});

/* =====================================================
   GET ALL CUSTOMERS
===================================================== */

router.get("/", authMiddleware,
    roleMiddleware("SHOPKEEPER"),async (req, res) => {
    const SHOP_ID = req.user.shopId;

    try {

        const customers = await Customer.find({

            shopId: SHOP_ID

        }).sort({

            createdAt: -1

        });

        return res.status(200).json({

            success: true,

            totalCustomers: customers.length,

            customers: customers.map(buildCustomerResponse)

        });

    }

    catch (error) {

        return res.status(500).json({

            success: false,

            message: "Could not fetch customers.",

            error: error.message

        });

    }

});
/* =====================================================
   UPDATE CUSTOMER
===================================================== */

router.put("/:id", authMiddleware,
    roleMiddleware("SHOPKEEPER"),async (req, res) => {
    const SHOP_ID = req.user.shopId;

    try {

        const {
            name,
            phone,
            email,
            address,
            paymentPreference,
            creditLimit,
            bankDetails,
            upiDetails
        } = req.body;

        const customer = await Customer.findOne({
            _id: req.params.id,
            shopId: SHOP_ID
        });

        if (!customer) {

            return res.status(404).json({
                success: false,
                message: "Customer not found."
            });

        }

        /* ----------------------------
           Name
        ----------------------------- */

        if (name && name.trim()) {
            customer.name = name.trim();
        }

        /* ----------------------------
           Phone
        ----------------------------- */

        if (phone !== undefined) {

            const cleanPhone = phone.trim();

            const phoneRegex = /^[6-9]\d{9}$/;

            if (!phoneRegex.test(cleanPhone)) {

                return res.status(400).json({
                    success: false,
                    message: "Invalid phone number."
                });

            }

            const existingPhone = await Customer.findOne({

                shopId: SHOP_ID,
                phone: cleanPhone,
                _id: { $ne: customer._id }

            });

            if (existingPhone) {

                return res.status(409).json({
                    success: false,
                    message: "Phone number already exists."
                });

            }

            customer.phone = cleanPhone;

            // Phone changed -> verify again
            customer.phoneVerified = false;
            customer.otp = "";
            customer.otpExpires = null;

        }

        /* ----------------------------
           Email
        ----------------------------- */

        if (email !== undefined) {

            if (email && !validator.isEmail(email)) {

                return res.status(400).json({
                    success: false,
                    message: "Invalid email."
                });

            }

            customer.email = email.trim().toLowerCase();

        }

        /* ----------------------------
           Address
        ----------------------------- */

        if (address !== undefined) {

            customer.address = address;

        }

        /* ----------------------------
           Payment Preference
        ----------------------------- */

        if (paymentPreference !== undefined) {

            const allowedPayments = [
                "Cash",
                "UPI",
                "Bank"
            ];

            if (!allowedPayments.includes(paymentPreference)) {

                return res.status(400).json({
                    success: false,
                    message: "Invalid payment preference."
                });

            }

            customer.paymentPreference = paymentPreference;

        }

        /* ----------------------------
           Credit Limit
        ----------------------------- */

        if (creditLimit !== undefined) {

            if (creditLimit < 0) {

                return res.status(400).json({
                    success: false,
                    message: "Credit limit cannot be negative."
                });

            }

            customer.creditLimit = creditLimit;

        }

        /* ----------------------------
           Bank Details
        ----------------------------- */

        if (bankDetails) {

            const ifscRegex = /^[A-Z]{4}0[A-Z0-9]{6}$/;

            const accountRegex = /^[0-9]{9,18}$/;

            if (
                bankDetails.ifsc &&
                !ifscRegex.test(bankDetails.ifsc.trim().toUpperCase())
            ) {

                return res.status(400).json({
                    success: false,
                    message: "Invalid IFSC code."
                });

            }

            if (
                bankDetails.accountNumber &&
                !accountRegex.test(bankDetails.accountNumber)
            ) {

                return res.status(400).json({
                    success: false,
                    message: "Invalid account number."
                });

            }

            if (bankDetails.accountHolder !== undefined)
                customer.bankDetails.accountHolder =
                    bankDetails.accountHolder;

            if (bankDetails.bankName !== undefined)
                customer.bankDetails.bankName =
                    bankDetails.bankName;

            if (bankDetails.accountNumber !== undefined)
                customer.bankDetails.accountNumber =
                    bankDetails.accountNumber;

            if (bankDetails.ifsc !== undefined)
                customer.bankDetails.ifsc =
                    bankDetails.ifsc.trim().toUpperCase();

            // Never allow frontend to verify
            customer.bankDetails.verified = false;
            customer.bankDetails.verificationMethod = "NONE";
            customer.bankDetails.verifiedBy = null;
            customer.bankDetails.verifiedAt = null;

        }

        /* ----------------------------
           UPI Details
        ----------------------------- */

        if (upiDetails) {

            if (upiDetails.upiId !== undefined)
                customer.upiDetails.upiId =
                    upiDetails.upiId;

            customer.upiDetails.verified = false;

        }

        await customer.save();

        return res.status(200).json({

            success: true,

            message: "Customer updated successfully.",

            customer: buildCustomerResponse(customer)

        });

    }

    catch (error) {

        return res.status(500).json({

            success: false,

            message: "Could not update customer.",

            error: error.message

        });

    }

});


/* =====================================================
   DELETE CUSTOMER
===================================================== */

router.delete("/:id", authMiddleware,
    roleMiddleware("SHOPKEEPER"),async (req, res) => {
    const SHOP_ID = req.user.shopId;

    try {

        const customer = await Customer.findOne({

            _id: req.params.id,

            shopId: SHOP_ID

        });

        if (!customer) {

            return res.status(404).json({

                success: false,

                message: "Customer not found."

            });

        }

        const transactionExists = await Transaction.exists({

            customerId: customer._id

        });

        if (transactionExists) {

            return res.status(400).json({

                success: false,

                message: "Customer has transactions and cannot be deleted."

            });

        }

        await customer.deleteOne();

        return res.status(200).json({

            success: true,

            message: "Customer deleted successfully."

        });

    }

    catch (error) {

        return res.status(500).json({

            success: false,

            message: "Could not delete customer.",

            error: error.message

        });

    }

});

module.exports = router;