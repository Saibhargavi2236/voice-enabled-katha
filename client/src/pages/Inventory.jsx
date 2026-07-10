import { useEffect, useState } from "react";

import MainLayout from "../layouts/MainLayout";

import {
    getItems,
    addItem,
    updateItem,
    deleteItem
} from "../services/item";

function Inventory() {

    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);

    const [search, setSearch] = useState("");

    const [showForm, setShowForm] = useState(false);

    const [editingItem, setEditingItem] = useState(null);

    const [formData, setFormData] = useState({

        name: "",

        category: "General",

        unit: "piece",

        sellingPrice: "",

        purchasePrice: "",

        stock: "",

        minimumStock: 5

    });

    useEffect(() => {

        loadItems();

    }, []);

    const loadItems = async () => {

        try {

            const data = await getItems();

            setItems(data.items);

        }

        catch (error) {

            alert(

                error.response?.data?.message ||

                "Could not load items."

            );

        }

        finally {

            setLoading(false);

        }

    };

    const handleChange = (e) => {

        setFormData({

            ...formData,

            [e.target.name]: e.target.value

        });

    };

    const handleSubmit = async (e) => {

        e.preventDefault();

        try {

            if (editingItem) {

                await updateItem(

                    editingItem._id,

                    formData

                );

                alert("Item Updated Successfully");

            }

            else {

                await addItem(formData);

                alert("Item Added Successfully");

            }

            setFormData({

                name: "",

                category: "General",

                unit: "piece",

                sellingPrice: "",

                purchasePrice: "",

                stock: "",

                minimumStock: 5

            });

            setEditingItem(null);

            setShowForm(false);

            loadItems();

        }

        catch (error) {

            alert(

                error.response?.data?.message ||

                "Operation Failed"

            );

        }

    };

    const handleEdit = (item) => {

        setEditingItem(item);

        setFormData({

            name: item.name,

            category: item.category,

            unit: item.unit,

            sellingPrice: item.sellingPrice,

            purchasePrice: item.purchasePrice,

            stock: item.stock,

            minimumStock: item.minimumStock

        });

        setShowForm(true);

    };

    const handleDelete = async (id) => {

        if (!window.confirm("Delete this item?")) {

            return;

        }

        try {

            const res = await deleteItem(id);

            alert(res.message);

            loadItems();

        }

        catch (error) {

            alert(

                error.response?.data?.message ||

                "Delete Failed"

            );

        }

    };

    return (

        <MainLayout>

            <div className="flex justify-between items-center mb-6">

                <h1 className="text-3xl font-bold">

                    Inventory

                </h1>

                <button

                    onClick={() => {

                        setEditingItem(null);

                        setShowForm(true);

                    }}

                    className="bg-blue-600 text-white px-5 py-2 rounded"

                >

                    + Add Item

                </button>

            </div>

            <input

                type="text"

                placeholder="Search Item"

                className="border w-full p-3 rounded mb-6"

                value={search}

                onChange={(e)=>setSearch(e.target.value)}

            />

            {showForm && (

                <div className="bg-white p-6 rounded shadow mb-6">

                    <form onSubmit={handleSubmit}>

                        <div className="grid grid-cols-2 gap-4">

                            <input
                                name="name"
                                placeholder="Item Name"
                                className="border p-3 rounded"
                                value={formData.name}
                                onChange={handleChange}
                            />

                            <input
                                name="category"
                                placeholder="Category"
                                className="border p-3 rounded"
                                value={formData.category}
                                onChange={handleChange}
                            />

                            <input
                                name="sellingPrice"
                                type="number"
                                placeholder="Selling Price"
                                className="border p-3 rounded"
                                value={formData.sellingPrice}
                                onChange={handleChange}
                            />

                            <input
                                name="purchasePrice"
                                type="number"
                                placeholder="Purchase Price"
                                className="border p-3 rounded"
                                value={formData.purchasePrice}
                                onChange={handleChange}
                            />

                            <input
                                name="stock"
                                type="number"
                                placeholder="Stock"
                                className="border p-3 rounded"
                                value={formData.stock}
                                onChange={handleChange}
                            />

                            <select
                                name="unit"
                                className="border p-3 rounded"
                                value={formData.unit}
                                onChange={handleChange}
                            >
                                <option value="kg">kg</option>
                                <option value="gram">gram</option>
                                <option value="liter">liter</option>
                                <option value="ml">ml</option>
                                <option value="piece">piece</option>
                                <option value="packet">packet</option>
                                <option value="box">box</option>
                                <option value="dozen">dozen</option>
                            </select>

                        </div>

                        <button
                            className="bg-green-600 text-white px-5 py-2 rounded mt-5"
                        >
                            {editingItem ? "Update Item" : "Save Item"}
                        </button>

                    </form>

                </div>

            )}

            {loading ? (

                <h2>Loading...</h2>

            ) : (

                <div className="bg-white rounded shadow overflow-hidden">

                    <table className="w-full">

                        <thead className="bg-slate-900 text-white">

                            <tr>

                                <th className="p-3">Code</th>
                                <th>Name</th>
                                <th>Price</th>
                                <th>Stock</th>
                                <th>Status</th>
                                <th>Actions</th>

                            </tr>

                        </thead>

                        <tbody>

                            {items

                                .filter(item =>

                                    item.name

                                        .toLowerCase()

                                        .includes(search.toLowerCase())

                                )

                                .map(item => (

                                    <tr key={item._id}>

                                        <td className="p-3">

                                            {item.itemCode}

                                        </td>

                                        <td>{item.name}</td>

                                        <td>₹{item.sellingPrice}</td>

                                        <td>{item.stock}</td>

                                        <td>

                                            {item.stock <= item.minimumStock ?

                                                <span className="text-red-600 font-bold">

                                                    Low Stock

                                                </span>

                                                :

                                                <span className="text-green-600">

                                                    Available

                                                </span>

                                            }

                                        </td>

                                        <td>

                                            <button

                                                onClick={() => handleEdit(item)}

                                                className="bg-yellow-500 text-white px-3 py-1 rounded mr-2"

                                            >

                                                Edit

                                            </button>

                                            <button

                                                onClick={() => handleDelete(item._id)}

                                                className="bg-red-600 text-white px-3 py-1 rounded"

                                            >

                                                Delete

                                            </button>

                                        </td>

                                    </tr>

                                ))}

                        </tbody>

                    </table>

                </div>

            )}

        </MainLayout>

    );

}

export default Inventory;