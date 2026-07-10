const Notification =
require("../models/notification");

const Item =
require("../models/item");

const Customer =
require("../models/customer");

// ----------------------------------
// Get Notifications
// ----------------------------------

const getNotifications = async(req,res)=>{

    try{

        const SHOP_ID =
        req.user.shopId;

        const notifications =
        await Notification.find({

            shopId:SHOP_ID

        })
        .sort({

            createdAt:-1

        })
        .limit(20);

        return res.status(200).json({

            success:true,

            total:notifications.length,

            notifications

        });

    }

    catch(error){

        return res.status(500).json({

            success:false,

            message:error.message

        });

    }

};

// ----------------------------------
// Generate Notifications
// ----------------------------------

const generateNotifications =
async(req,res)=>{

    try{

        const SHOP_ID =
        req.user.shopId;

        // Remove old notifications

        await Notification.deleteMany({

            shopId:SHOP_ID

        });

        // -------------------
        // Low Stock
        // -------------------

       const allItems = await Item.find({
    shopId: SHOP_ID,
    status: "ACTIVE"
});

for (const item of allItems) {
    if (item.stock <= item.minimumStock) {
        await Notification.create({
            shopId: SHOP_ID,
            title: "Low Stock",
            message: `${item.name} stock is only ${item.stock}.`,
            type: "LOW_STOCK"
        });
    }
}

        // -------------------
        // Due Customers
        // -------------------

        const dueCustomers =
        await Customer.find({

            shopId:SHOP_ID,

            totalDue:{
                $gt:0
            }

        });

        for(const customer of dueCustomers){

            await Notification.create({

                shopId:SHOP_ID,

                title:"Payment Due",

                message:
`${customer.name} has ₹${customer.totalDue} pending.`,

                type:"DUE"

            });

        }

        return res.status(200).json({

            success:true,

            message:"Notifications generated."

        });

    }

    catch(error){

        return res.status(500).json({

            success:false,

            message:error.message

        });

    }

};

module.exports={

    getNotifications,

    generateNotifications

};