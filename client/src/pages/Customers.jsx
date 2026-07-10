import { useEffect, useState } from "react";
import MainLayout from "../layouts/MainLayout";
import {
    getCustomers,
    addCustomer,
    updateCustomer,
    deleteCustomer
} from "../services/customer";

function Customers() {

    const [customers, setCustomers] = useState([]);

    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);

const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    creditLimit: 5000,
    address: "",
    paymentPreference: "Cash"
});
const [search, setSearch] = useState("");

const [editingCustomer, setEditingCustomer] = useState(null);

    useEffect(() => {

        loadCustomers();

    }, []);

    const loadCustomers = async () => {

        try {

            const data = await getCustomers();

            setCustomers(data.customers);

        }

        catch (error) {

            console.log(error);

            alert(
                error.response?.data?.message ||
                "Could not load customers."
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
const handleDelete = async (id) => {

    const confirmDelete = window.confirm(
        "Are you sure you want to delete this customer?"
    );

    if (!confirmDelete) {

        return;

    }

    try {

        const response = await deleteCustomer(id);

        alert(response.message);

        loadCustomers();

    }

    catch (error) {

        alert(

            error.response?.data?.message ||

            "Could not delete customer."

        );

    }

};
const handleEdit = (customer) => {

    setEditingCustomer(customer);

    setFormData({

        name: customer.name,

        phone: customer.phone,

        email: customer.email,

        creditLimit: customer.creditLimit,
        address: customer.address || "",
    paymentPreference: customer.paymentPreference || "Cash"

    });

    setShowForm(true);

};

const handleSubmit = async (e) => {

    e.preventDefault();

    try {

        if (editingCustomer) {

    await updateCustomer(

        editingCustomer._id,

        formData

    );

    alert("Customer Updated Successfully");

} else {

    await addCustomer(formData);

    alert("Customer Added Successfully");

}

        setFormData({

    name: "",
    phone: "",
    email: "",
    creditLimit: 5000

});

setEditingCustomer(null);
        setShowForm(false);

        loadCustomers();

    }

    catch (error) {

        alert(

            error.response?.data?.message ||

            "Could not add customer."

        );

    }

};

    return (

        <MainLayout>
            

            <div className="flex justify-between items-center mb-6">

    <h1 className="text-3xl font-bold">

        Customers

    </h1>

    <button

        onClick={() => {

    setEditingCustomer(null);

    setFormData({

        name: "",

        phone: "",

        email: "",

        creditLimit: 5000

    });

    setShowForm(true);

}}

        className="bg-blue-600 text-white px-5 py-2 rounded"

    >

        + Add Customer

    </button>

</div>
<div className="mb-6">

<input

type="text"

placeholder="Search Customer..."

className="border p-3 rounded w-full"

value={search}

onChange={(e)=>setSearch(e.target.value)}

/>

</div>
{
showForm && (

<div className="bg-white p-6 rounded shadow mb-6">

<form onSubmit={handleSubmit}>

<div className="grid grid-cols-3 gap-4">

<input

name="name"

placeholder="Customer Name"

className="border p-3 rounded"

value={formData.name}

onChange={handleChange}

/>

<input

name="phone"

placeholder="Phone"

className="border p-3 rounded"

value={formData.phone}

onChange={handleChange}

/>

<input

name="email"

placeholder="Email"

className="border p-3 rounded"

value={formData.email}

onChange={handleChange}

/>
<input
    type="number"
    name="creditLimit"
    placeholder="Credit Limit"
    className="border p-3 rounded"
    value={formData.creditLimit}
    onChange={handleChange}
/>
<input
    name="address"
    placeholder="Address"
    className="border p-3 rounded"
    value={formData.address || ""}
    onChange={handleChange}
/>

<select
    name="paymentPreference"
    className="border p-3 rounded"
    value={formData.paymentPreference || "Cash"}
    onChange={handleChange}
>
    <option value="Cash">Cash</option>
    <option value="UPI">UPI</option>
    <option value="Bank">Bank</option>
</select>

</div>

<button
type="submit"
className="bg-green-600 text-white mt-4 px-5 py-2 rounded"

>

{
    editingCustomer
        ? "Update Customer"
        : "Save Customer"
}

</button>

</form>

</div>

)
}

            {

                loading ?

                (

                    <h2>Loading...</h2>

                )

                :

                customers.length === 0 ?

                (

                    <h2>No customers found.</h2>

                )

                :

                (

                    <div className="bg-white shadow rounded-lg overflow-hidden">

                        <table className="w-full">

                            <thead className="bg-slate-900 text-white">

                                <tr>

                                    <th className="p-3 text-left">

                                        Customer ID

                                    </th>

                                    <th className="p-3 text-left">

                                        Name

                                    </th>

                                    <th className="p-3 text-left">

                                        Phone

                                    </th>

                                    <th className="p-3 text-left">

                                        Total Due

                                    </th>

                                    <th className="p-3 text-left">

                                        Credit Limit

                                    </th>
                                    <th className="p-3">

Actions

</th>

                                </tr>

                            </thead>

                            <tbody>

                                {

    customers.filter((customer) => {

            return (

                customer.name.toLowerCase().includes(search.toLowerCase()) ||

                customer.customerId.toLowerCase().includes(search.toLowerCase()) ||

                customer.phone.includes(search)

            );

        })

        .map((customer) => (

            <tr
                key={customer._id}
                className="border-b hover:bg-gray-50"
            >

                <td className="p-3">
                    {customer.customerId}
                </td>

                <td className="p-3">
                    {customer.name}
                </td>

                <td className="p-3">
                    {customer.phone}
                </td>

                <td className="p-3">
                    ₹{customer.totalDue}
                </td>

                <td className="p-3">
                    ₹{customer.creditLimit}
                </td>

                <td className="p-3">

                    <button
                    onClick={() => handleEdit(customer)}
                        className="bg-yellow-500 text-white px-3 py-1 rounded mr-2"
                    >
                        Edit
                    </button>

                    <button

    onClick={() => handleDelete(customer._id)}

    className="bg-red-600 text-white px-3 py-1 rounded"

>

    Delete

</button>

                </td>

            </tr>

        ))
}


                            </tbody>

                        </table>

                    </div>

                )

            }

        </MainLayout>

    );

}

export default Customers;