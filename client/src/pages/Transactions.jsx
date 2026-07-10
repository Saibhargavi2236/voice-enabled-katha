import { useEffect, useState } from "react";

import MainLayout from "../layouts/MainLayout";

import { getCustomers } from "../services/customer";
import { getItems } from "../services/item";
import {
    createTransaction,
    getTransactions
} from "../services/transaction";

function Transactions() {

    const [customers, setCustomers] = useState([]);
    const [items, setItems] = useState([]);
    const [totalAmount, setTotalAmount] = useState(0);
const [transactions, setTransactions] = useState([]);
const [selectedTransaction, setSelectedTransaction] = useState(null);
    const [formData, setFormData] = useState({

        customerId: "",

        paymentMode: "DUE",

        paidAmount: 0,

        items: [
            {
                itemCode: "",
                quantity: 1
            }
        ]

    });

    useEffect(() => {

    loadData();

}, []);

useEffect(() => {

    calculateTotal();

}, [formData.items, items]);

    const loadData = async () => {

        try {

            const customerRes = await getCustomers();

            const itemRes = await getItems();
             console.log("Customers:", customerRes);
        console.log("Items:", itemRes);
const transactionRes =
            await getTransactions();
            setCustomers(customerRes.customers);

            setItems(itemRes.items);
setTransactions(
            transactionRes.transactions
        );
        }

        catch (error) {

            console.log(error);

        }

    };

    const handleItemChange = (index, field, value) => {

        const updatedItems = [...formData.items];

        updatedItems[index][field] = value;

        setFormData({

            ...formData,

            items: updatedItems

        });

    };

    const addItemRow = () => {

        setFormData({

            ...formData,

            items: [

                ...formData.items,

                {

                    itemCode: "",

                    quantity: 1

                }

            ]

        });

    };
    const removeItemRow = (index) => {

    if (formData.items.length === 1) {

        alert("At least one item is required.");

        return;

    }

    const updatedItems = [...formData.items];

    updatedItems.splice(index, 1);

    setFormData({

        ...formData,

        items: updatedItems

    });

};
    const calculateTotal = () => {

    let total = 0;

    formData.items.forEach((selectedItem) => {

        const item = items.find(

            (i) => i.itemCode === selectedItem.itemCode

        );

        if (item) {

            total +=

                item.sellingPrice *

                selectedItem.quantity;

        }

    });

    setTotalAmount(total);

};

    const handleSubmit = async (e) => {

        e.preventDefault();

        try {

            const response = await createTransaction(formData);

            alert(response.message);
            loadData();

            setFormData({

                customerId: "",

                paymentMode: "DUE",

                paidAmount: 0,

                items: [

                    {

                        itemCode: "",

                        quantity: 1

                    }

                ]

            });

        }

        catch (error) {

            alert(

                error.response?.data?.message ||

                "Transaction Failed"

            );

        }

    };

    return (

        <MainLayout>
            <div className="mt-10">

    <h2 className="text-2xl font-bold mb-4">

        Recent Transactions

    </h2>

    <div className="bg-white rounded shadow overflow-hidden">

        <table className="w-full">

            <thead className="bg-slate-900 text-white">

                <tr>

                    <th className="p-3">Customer</th>

                    <th>Total</th>

                    <th>Paid</th>

                    <th>Due</th>

                    <th>Mode</th>

                    <th>Source</th>

                    <th>Date</th>
                    <th>Action</th>

                </tr>

            </thead>

            <tbody>

                {

                    transactions.map((transaction) => (

                        <tr
                            key={transaction._id}
                            className="border-b"
                        >

                            <td className="p-3">

                                {transaction.customerId}

                            </td>

                            <td>

                                ₹{transaction.totalAmount}

                            </td>

                            <td>

                                ₹{transaction.paidAmount}

                            </td>

                            <td>

                                ₹{transaction.dueAmount}

                            </td>

                            <td>

                                {transaction.paymentMode}

                            </td>

                            <td>

                                {transaction.source}

                            </td>

                            <td>

                                {

                                    new Date(

                                        transaction.transactionDate

                                    ).toLocaleDateString()

                                }

                            </td>
                            <td>

<button

onClick={()=>{
        console.log(transaction);
        setSelectedTransaction(transaction);
    }
}

className="bg-blue-600 text-white px-3 py-1 rounded"

>

View

</button>

</td>

                        </tr>

                    ))

                }

            </tbody>

        </table>
        {
selectedTransaction && (

<div className="bg-white shadow rounded mt-8 p-6">

<h2 className="text-2xl font-bold mb-4">

Transaction Details

</h2>

<p>

<b>Customer :</b>

{selectedTransaction.customerId}

</p>

<p>

<b>Payment Mode :</b>

{selectedTransaction.paymentMode}

</p>

<p>

<b>Source :</b>

{selectedTransaction.source}

</p>

<p>

<b>Total :</b>

₹{selectedTransaction.totalAmount}

</p>

<p>

<b>Paid :</b>

₹{selectedTransaction.paidAmount}

</p>

<p>

<b>Due :</b>

₹{selectedTransaction.dueAmount}

</p>

<h3 className="text-xl font-bold mt-6 mb-3">

Purchased Items

</h3>

<table className="w-full border">

<thead className="bg-gray-200">

<tr>

<th className="p-2">

Item

</th>

<th>

Qty

</th>

<th>

Unit Price

</th>

<th>

Total

</th>

</tr>

</thead>

<tbody>

{

selectedTransaction.items.map(

(item,index)=>(

<tr key={index}>

<td className="p-2">

{item.itemName}

</td>

<td>

{item.quantity}

</td>

<td>

₹{item.unitPrice}

</td>

<td>

₹{item.totalPrice}

</td>

</tr>

)

)

}

</tbody>

</table>

</div>

)
}

    </div>

</div>

            <h1 className="text-3xl font-bold mb-6">

                Manual Transaction

            </h1>

            <form
                onSubmit={handleSubmit}
                className="bg-white p-6 rounded shadow"
            >

                <div className="mb-5">

                    <label>

                        Customer

                    </label>

                    <select

                        className="border w-full p-3 rounded mt-2"

                        value={formData.customerId}

                        onChange={(e)=>

                            setFormData({

                                ...formData,

                                customerId:e.target.value

                            })

                        }

                    >

                        <option value="">

                            Select Customer

                        </option>

                        {

                            customers.map(customer=>(

                                <option

                                    key={customer._id}

                                    value={customer.customerId}

                                >

                                    {customer.customerId} - {customer.name}

                                </option>

                            ))

                        }

                    </select>

                </div>

                <h2 className="font-bold mb-3">

                    Items

                </h2>

                {

                    formData.items.map((item,index)=>(

                        <div
    key={index}
    className="grid grid-cols-3 gap-4 mb-4"
>

                            <select

                                className="border p-3 rounded"

                                value={item.itemCode}

                                onChange={(e)=>

                                    handleItemChange(

                                        index,

                                        "itemCode",

                                        e.target.value

                                    )

                                }

                            >

                                <option value="">

                                    Select Item

                                </option>

                                {

                                    items.map(product=>(

                                        <option

                                            key={product._id}

                                            value={product.itemCode}

                                        >

                                            {product.name}

                                        </option>

                                    ))

                                }

                            </select>

                            <input

                                type="number"

                                min="1"

                                className="border p-3 rounded"

                                value={item.quantity}

                                onChange={(e)=>

                                    handleItemChange(

                                        index,

                                        "quantity",

                                        Number(e.target.value)

                                    )

                                }

                            />
                            <button

    type="button"

    onClick={() => removeItemRow(index)}

    className="bg-red-600 text-white rounded"

>

    Remove

</button>

                        </div>

                    ))

                }

                <button

                    type="button"

                    onClick={addItemRow}

                    className="bg-gray-700 text-white px-4 py-2 rounded mb-5"

                >

                    + Add Item

                </button>
                <div className="bg-gray-100 rounded p-4 mb-5">

    <h2 className="text-xl font-bold">

        Total : ₹{totalAmount}

    </h2>

    {

        formData.paymentMode === "PARTIAL" && (

            <h3 className="mt-2">

                Due :

                ₹{totalAmount - formData.paidAmount}

            </h3>

        )

    }

</div>

                <div className="mb-5">

                    <label>

                        Payment Mode

                    </label>

                    <select

                        className="border w-full p-3 rounded mt-2"

                        value={formData.paymentMode}

                        onChange={(e)=>

                            setFormData({

                                ...formData,

                                paymentMode:e.target.value

                            })

                        }

                    >

                        <option value="DUE">Due</option>

                        <option value="CASH">Cash</option>

                        <option value="UPI">UPI</option>

                        <option value="PARTIAL">Partial</option>

                    </select>

                </div>

                {

                    formData.paymentMode==="PARTIAL" && (

                        <div className="mb-5">

                            <input

                                type="number"

                                placeholder="Paid Amount"

                                className="border w-full p-3 rounded"

                                value={formData.paidAmount}

                                onChange={(e)=>

                                    setFormData({

                                        ...formData,

                                        paidAmount:Number(e.target.value)

                                    })

                                }

                            />

                        </div>

                    )

                }

                <button

                    className="bg-green-600 text-white px-6 py-3 rounded"

                >

                    Save Transaction

                </button>

            </form>

        </MainLayout>

    );

}

export default Transactions;