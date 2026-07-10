import { useEffect, useState } from "react";

import MainLayout from "../layouts/MainLayout";

import { getCustomers } from "../services/customer";

import { collectPayment } from "../services/payment";

function Payments() {

    const [customers, setCustomers] = useState([]);

    const [formData, setFormData] = useState({

        customerId: "",

        amount: "",

        paymentMode: "CASH"

    });

    useEffect(() => {

        loadCustomers();

    }, []);

    const loadCustomers = async () => {

        const data = await getCustomers();

        setCustomers(data.customers);

    };

    const handleSubmit = async (e) => {

        e.preventDefault();

        try {

            const response =
                await collectPayment(formData);

            alert(response.message);

            setFormData({

                customerId: "",

                amount: "",

                paymentMode: "CASH"

            });

            loadCustomers();

        }

        catch (error) {

            alert(

                error.response?.data?.message ||

                "Payment Failed"

            );

        }

    };

    return (

        <MainLayout>

            <h1 className="text-3xl font-bold mb-6">

                Collect Payment

            </h1>

            <form

                onSubmit={handleSubmit}

                className="bg-white p-6 rounded shadow"

            >

                <select

                    className="border w-full p-3 rounded mb-4"

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

                                {customer.customerId}

                                {" - "}

                                {customer.name}

                                {" (Due ₹"}

                                {customer.totalDue}

                                )

                            </option>

                        ))

                    }

                </select>

                <input

                    type="number"

                    placeholder="Amount"

                    className="border w-full p-3 rounded mb-4"

                    value={formData.amount}

                    onChange={(e)=>

                        setFormData({

                            ...formData,

                            amount:Number(e.target.value)

                        })

                    }

                />

                <select

                    className="border w-full p-3 rounded mb-5"

                    value={formData.paymentMode}

                    onChange={(e)=>

                        setFormData({

                            ...formData,

                            paymentMode:e.target.value

                        })

                    }

                >

                    <option value="CASH">

                        CASH

                    </option>

                    <option value="UPI">

                        UPI

                    </option>

                </select>

                <button

                    className="bg-green-600 text-white px-6 py-3 rounded"

                >

                    Collect Payment

                </button>

            </form>

        </MainLayout>

    );

}

export default Payments;