const Item = require("../models/item");

const InventoryHistory = require("../models/InventoryHistory");
// -------------------------
// Add Item
// -------------------------

const addItem = async (req,res)=>{

    try{

        const SHOP_ID = req.user.shopId;
       console.log("Adding item for SHOP_ID:", SHOP_ID);
        const {

            name,
            category="General",
            unit="piece",
            sellingPrice,
            purchasePrice=0,
            stock=0,
            minimumStock=5

        } = req.body;

        if(!name || sellingPrice==null){

            return res.status(400).json({

                success:false,
                message:"Item name and selling price are required."

            });

        }

        const cleanName = name.trim();

        const existingItem = await Item.findOne({

            shopId:SHOP_ID,
            name:{
                $regex:new RegExp(`^${cleanName}$`,"i")
            }

        });

        if (existingItem) {

    if (existingItem.status === "INACTIVE") {

        existingItem.status = "ACTIVE";
        existingItem.category = category;
        existingItem.unit = unit;
        existingItem.sellingPrice = sellingPrice;
        existingItem.purchasePrice = purchasePrice;
        existingItem.stock = stock;
        existingItem.minimumStock = minimumStock;

        await existingItem.save();

        return res.status(200).json({

            success: true,

            message: "Inactive item reactivated successfully.",

            item: existingItem

        });

    }

    return res.status(409).json({

        success: false,

        message: "Item already exists."

    });

}

        const lastItem = await Item.findOne({

            shopId:SHOP_ID

        }).sort({createdAt:-1});

        let nextNumber = 1;

        if(lastItem){

            nextNumber =
            parseInt(
                lastItem.itemCode.replace("ITEM","")
            )+1;

        }

        const itemCode =
        `ITEM${String(nextNumber).padStart(4,"0")}`;

        const item = await Item.create({

            shopId:SHOP_ID,

            itemCode,

            name:cleanName,

            category,

            unit,

            sellingPrice,

            purchasePrice,

            stock,

            minimumStock

        });

        return res.status(201).json({

            success:true,

            message:"Item added successfully.",

            item

        });

    }

    catch(error){

        return res.status(500).json({

            success:false,

            message:"Could not add item.",

            error:error.message

        });

    }

};


// -------------------------
// Get Items
// -------------------------

const getItems = async(req,res)=>{

    try{

        const SHOP_ID = req.user.shopId;
console.log("Logged in SHOP_ID:", SHOP_ID);
        const items = await Item.find({

            shopId:SHOP_ID,

            status:"ACTIVE"

        }).sort({

            name:1

        });

        return res.status(200).json({

            success:true,

            totalItems:items.length,

            items

        });

    }

    catch(error){

        return res.status(500).json({

            success:false,

            message:"Could not fetch items.",

            error:error.message

        });

    }

};
const updateItem = async (req, res) => {

    try {

        const SHOP_ID = req.user.shopId;

        const item = await Item.findOne({

            _id: req.params.id,

            shopId: SHOP_ID,

            status: "ACTIVE"

        });

        if (!item) {

            return res.status(404).json({

                success: false,

                message: "Item not found."

            });

        }

        const {

            name,
            category,
            unit,
            sellingPrice,
            purchasePrice,
            stock,
            minimumStock

        } = req.body;

        if (name && name.trim()) {

            const duplicate = await Item.findOne({

                shopId: SHOP_ID,

                name: {
                    $regex: new RegExp(`^${name.trim()}$`, "i")
                },

                _id: { $ne: item._id }

            });

            if (duplicate) {

                return res.status(409).json({

                    success: false,

                    message: "Another item with this name already exists."

                });

            }

            item.name = name.trim();

        }

        if (category !== undefined)
            item.category = category;

        if (unit !== undefined)
            item.unit = unit;

        if (sellingPrice !== undefined)
            item.sellingPrice = sellingPrice;

        if (purchasePrice !== undefined)
            item.purchasePrice = purchasePrice;

        if (stock !== undefined)
            item.stock = stock;

        if (minimumStock !== undefined)
            item.minimumStock = minimumStock;

        await item.save();

        return res.status(200).json({

            success: true,

            message: "Item updated successfully.",

            item

        });

    }

    catch (error) {

        return res.status(500).json({

            success: false,

            message: "Could not update item.",

            error: error.message

        });

    }

};
const deleteItem = async (req, res) => {

    try {

        const SHOP_ID = req.user.shopId;

        const item = await Item.findOne({

            _id: req.params.id,

            shopId: SHOP_ID

        });

        if (!item) {

            return res.status(404).json({

                success: false,

                message: "Item not found."

            });

        }

        item.status = "INACTIVE";

        await item.save();

        return res.status(200).json({

            success: true,

            message: "Item deleted successfully."

        });

    }

    catch (error) {

        return res.status(500).json({

            success: false,

            message: "Could not delete item.",

            error: error.message

        });

    }

};
const searchItems = async (req, res) => {

    try {

        const SHOP_ID = req.user.shopId;

        const keyword = req.query.name || "";

        const items = await Item.find({

            shopId: SHOP_ID,

            status: "ACTIVE",

            name: {

                $regex: keyword,

                $options: "i"

            }

        }).sort({

            name: 1

        });

        return res.status(200).json({

            success: true,

            totalItems: items.length,

            items

        });

    }

    catch (error) {

        return res.status(500).json({

            success: false,

            message: "Search failed.",

            error: error.message

        });

    }

};
const getLowStockItems = async (req, res) => {

    try {

        const SHOP_ID = req.user.shopId;

        const items = await Item.find({

            shopId: SHOP_ID,

            status: "ACTIVE"

        });

        const lowStockItems = items.filter(item =>
            item.stock <= item.minimumStock
        );

        return res.status(200).json({

            success: true,

            totalItems: lowStockItems.length,

            items: lowStockItems

        });

    }

    catch (error) {

        return res.status(500).json({

            success: false,

            message: "Could not fetch low stock items.",

            error: error.message

        });

    }

};
const getInventoryHistory =
async (req,res)=>{

    try{

        const SHOP_ID =
        req.user.shopId;

        const history =
        await InventoryHistory.find({

            shopId:SHOP_ID

        })
        .populate(
            "itemId",
            "itemCode name"
        )
        .sort({

            createdAt:-1

        });

        return res.status(200).json({

            success:true,

            history

        });

    }

    catch(error){

        return res.status(500).json({

            success:false,

            message:
            "Could not fetch history.",

            error:error.message

        });

    }

};

module.exports = {

    addItem,

    getItems,

    updateItem,

    deleteItem,

    searchItems,

    getLowStockItems,
     getInventoryHistory

};