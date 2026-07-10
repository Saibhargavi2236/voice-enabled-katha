const { GoogleGenAI } = require("@google/genai");

const Customer = require("../models/Customer");
const Item = require("../models/Item");
const Transaction = require("../models/Transaction");
const mergeDuplicateItems = require("../utils/mergeItems");
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY
});
const InventoryHistory =
require("../models/InventoryHistory");

// Temporary until authentication is added

/*
  POST /api/voice/draft

  Body:
  {
    "spokenText": "Ramesh took rice rice 2 kg and oil one packet"
  }
*/
const createVoiceDraft = async (req, res) => {

    try {

        const SHOP_ID = req.user.shopId;

        const { customerId, spokenText } = req.body;

        if (!spokenText || !spokenText.trim()) {

            return res.status(400).json({
                success: false,
                message: "spokenText is required."
            });

        }

        if (!customerId) {

            return res.status(400).json({
                success: false,
                message: "Customer ID is required."
            });

        }

        const prompt = `

You are an AI assistant for Secure Katha.

Extract transaction details from the shopkeeper's voice.

Rules:

1. Return ONLY valid JSON.
2. Never use markdown.
3. Never create customers.
4. Customer ID is already provided.
5. Extract every purchased item.
6. Merge duplicate items.
7. If quantity is missing use null.
8. If payment mode is missing use DUE.

Voice:

"${spokenText}"

Example

Input:

2 kg rice and 1 oil packet

Output:

{
    "items":[
        {
            "itemName":"rice",
            "quantity":2,
            "unit":"kg"
        },
        {
            "itemName":"oil",
            "quantity":1,
            "unit":"piece"
        }
    ],
    "paymentMode":"DUE"
}

Return only

{
    "items":[
        {
            "itemName":"",
            "quantity":null,
            "unit":"piece"
        }
    ],
    "paymentMode":"DUE"
}

`;

        const response =
            await ai.models.generateContent({

                model: "gemini-2.5-flash",

                contents: prompt,

                config: {

                    responseMimeType: "application/json"

                }

            });

        let aiData;

        try {

            aiData = JSON.parse(response.text);

            console.log("Gemini Response:", aiData);

        }

        catch {

            return res.status(500).json({

                success: false,

                message: "Gemini returned invalid JSON.",

                rawResponse: response.text

            });

        }

        const mergedItems =
            mergeDuplicateItems(aiData.items || []);

        const hasMissingQuantity =
            mergedItems.some(

                item =>
                    item.quantity == null ||
                    item.quantity <= 0

            );

        let clarificationMessage = "";

        let needsClarification = false;

        if (!/^CUST\d{4}$/.test(customerId.trim().toUpperCase())) {

            needsClarification = true;

            clarificationMessage =
                "Customer ID should be like CUST0001.";

        }

        else if (mergedItems.length === 0) {

            needsClarification = true;

            clarificationMessage =
                "Please tell which items were purchased.";

        }

        else if (hasMissingQuantity) {

            needsClarification = true;

            clarificationMessage =
                "Please specify quantity.";

        }

        return res.status(200).json({

            success: true,

            message:
                "Voice transaction draft created.",

            draft: {

                customerId:
                    customerId.trim().toUpperCase(),

                items: mergedItems,

                paymentMode:
                    aiData.paymentMode || "DUE",

                needsClarification,

                clarificationMessage

            }

        });

    }

    catch (error) {

        console.error(error);

        return res.status(500).json({

            success: false,

            message:
                "Could not create draft.",

            error: error.message

        });

    }

};

/*
  POST /api/voice/confirm

  This is called only after user sees the draft and presses Confirm.

  Body:
  {
    "customerId": "CUST0001",
    "items": [
      { "itemName": "Rice", "quantity": 2, "unit": "kg" }
    ],
    "paymentMode": "DUE"
  }
*/
const confirmVoiceTransaction = async (req, res) => {

    try {

        const SHOP_ID = req.user.shopId;

        const {

            customerId,

            items,

            paymentMode = "DUE",

            spokenText = ""

        } = req.body;

        if (!customerId || !items || items.length === 0) {

            return res.status(400).json({

                success: false,

                message: "customerId and items are required."

            });

        }

        const normalizedCustomerId =
            customerId.trim().toUpperCase();

        const customer =
            await Customer.findOne({

                shopId: SHOP_ID,

                customerId: normalizedCustomerId

            });

        if (!customer) {

            return res.status(404).json({

                success: false,

                message: "Customer not found."

            });

        }

        const mergedItems =
            mergeDuplicateItems(items);

        const finalItems = [];

        let totalAmount = 0;

        for (const voiceItem of mergedItems) {

            if (!voiceItem.quantity ||
                voiceItem.quantity <= 0) {

                return res.status(400).json({

                    success: false,

                    message:
                        `Quantity is required for ${voiceItem.itemName}`

                });

            }

            // Normalize names like
            // "oil packet" -> "oil"

            const normalizedItem =
                voiceItem.itemName
                    .toLowerCase()
                    .replace(/\b(packet|pack|piece|pcs|bottle|bag)\b/g, "")
                    .trim();

            const inventoryItem = await Item.findOne({
    shopId: SHOP_ID,
    status: "ACTIVE",
    name: {
        $regex: normalizedItem,
        $options: "i"
    }
});

            if (!inventoryItem) {

                return res.status(404).json({

                    success: false,

                    message:
                        `${voiceItem.itemName} not found in inventory.`

                });

            }

            if (
                inventoryItem.stock <
                voiceItem.quantity
            ) {

                return res.status(400).json({

                    success: false,

                    message:
                        `Only ${inventoryItem.stock} ${inventoryItem.unit} of ${inventoryItem.name} available.`

                });

            }

            const itemTotal =
                inventoryItem.sellingPrice *
                voiceItem.quantity;

            totalAmount += itemTotal;

            finalItems.push({

                itemId:
                    inventoryItem._id,

                itemName:
                    inventoryItem.name,

                quantity:
                    voiceItem.quantity,

                unit:
                    inventoryItem.unit,

                unitPrice:
                    inventoryItem.sellingPrice,

                totalPrice:
                    itemTotal

            });

        }

        let paidAmount = 0;

        let dueAmount = totalAmount;

        switch (paymentMode) {

            case "CASH":

            case "UPI":

                paidAmount = totalAmount;

                dueAmount = 0;

                break;

            case "DUE":

                paidAmount = 0;

                dueAmount = totalAmount;

                break;

            case "PARTIAL":

                paidAmount = 0;

                dueAmount = totalAmount;

                break;

        }

        const transaction =
            await Transaction.create({

                transactionDate: Date.now(),

                shopId: SHOP_ID,

                customerMongoId:
                    customer._id,

                customerId:
                    normalizedCustomerId,

                items: finalItems,

                totalAmount,

                paidAmount,

                dueAmount,

                paymentMode,

                source: "VOICE",

                status: "CONFIRMED",

                spokenText

            });

        // Reduce stock

        for (const item of finalItems) {

    const inventoryItem =
        await Item.findById(item.itemId);

    const before =
        inventoryItem.stock;

    inventoryItem.stock -= item.quantity;

    await inventoryItem.save();

    await InventoryHistory.create({

        shopId: SHOP_ID,

        itemId: inventoryItem._id,

        transactionId: transaction._id,

        type: "SALE",

        quantity: item.quantity,

        stockBefore: before,

        stockAfter: inventoryItem.stock,

        remarks: "Voice Transaction"

    });

}

        // Update customer totals

        customer.totalPurchase += totalAmount;

        customer.totalPaid += paidAmount;

        customer.totalDue += dueAmount;

        await customer.save();

        return res.status(201).json({

            success: true,

            message:
                "Transaction saved successfully.",

            transaction

        });

    }

    catch (error) {

        console.error(error);

        return res.status(500).json({

            success: false,

            message:
                "Could not save transaction.",

            error: error.message

        });

    }

};

module.exports = {
  createVoiceDraft,
  confirmVoiceTransaction
};