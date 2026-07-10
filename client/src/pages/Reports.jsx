import { useEffect, useState } from "react";
import MainLayout from "../layouts/MainLayout";

import {
    getDailyReport,
    getWeeklyReport,
    getMonthlyReport,
    getPaymentReport,
    getTopDueCustomers,
    getTopSellingItems
} from "../services/report";

function Reports() {

    const [daily, setDaily] = useState(null);
    const [weekly, setWeekly] = useState(null);
    const [monthly, setMonthly] = useState(null);

    const [payment, setPayment] = useState([]);
    const [dueCustomers, setDueCustomers] = useState([]);
    const [topItems, setTopItems] = useState([]);

    useEffect(() => {

        loadReports();

    }, []);

    const loadReports = async () => {

        try {

            const dailyRes = await getDailyReport();
            const weeklyRes = await getWeeklyReport();
            const monthlyRes = await getMonthlyReport();
            const paymentRes = await getPaymentReport();
            const dueRes = await getTopDueCustomers();
            const itemsRes = await getTopSellingItems();

            setDaily(dailyRes.report);
            setWeekly(weeklyRes.report);
            setMonthly(monthlyRes.report);

            setPayment(paymentRes.report);
            setDueCustomers(dueRes.customers);
            setTopItems(itemsRes.report);

        }

        catch (error) {

            console.log(error);

            alert("Could not load reports.");

        }

    };

    return (

        <MainLayout>

            <h1 className="text-3xl font-bold mb-8">

                Reports

            </h1>

            {/* Summary Cards */}

            <div className="grid grid-cols-3 gap-6 mb-8">

                <div className="bg-white rounded shadow p-5">

                    <h2 className="font-bold text-xl mb-3">

                        Today's Report

                    </h2>

                    {

                        daily && (

                            <>

                                <p>Total Sales : ₹{daily.totalSales}</p>

                                <p>Transactions : {daily.totalTransactions}</p>

                                <p>Cash : ₹{daily.cash}</p>

                                <p>UPI : ₹{daily.upi}</p>

                                <p>Due : ₹{daily.due}</p>

                            </>

                        )

                    }

                </div>

                <div className="bg-white rounded shadow p-5">

                    <h2 className="font-bold text-xl mb-3">

                        Weekly Report

                    </h2>

                    {

                        weekly && (

                            <>

                                <p>Total Sales : ₹{weekly.totalSales}</p>

                                <p>Transactions : {weekly.totalTransactions}</p>

                                <p>Total Due : ₹{weekly.totalDue}</p>

                            </>

                        )

                    }

                </div>

                <div className="bg-white rounded shadow p-5">

                    <h2 className="font-bold text-xl mb-3">

                        Monthly Report

                    </h2>

                    {

                        monthly && (

                            <>

                                <p>Total Sales : ₹{monthly.totalSales}</p>

                                <p>Total Paid : ₹{monthly.totalPaid}</p>

                                <p>Total Due : ₹{monthly.totalDue}</p>

                                <p>Transactions : {monthly.totalTransactions}</p>

                            </>

                        )

                    }

                </div>

            </div>

            {/* Payment Summary */}

            <div className="bg-white rounded shadow p-6 mb-8">

                <h2 className="text-2xl font-bold mb-5">

                    Payment Summary

                </h2>

                <table className="w-full">

                    <thead className="bg-slate-900 text-white">

                        <tr>

                            <th className="p-3">Payment Mode</th>

                            <th className="p-3">Transactions</th>

                            <th className="p-3">Amount</th>

                        </tr>

                    </thead>

                    <tbody>

                        {

                            payment.map((row, index) => (

                                <tr
                                    key={index}
                                    className="border-b"
                                >

                                    <td className="p-3">

                                        {row._id}

                                    </td>

                                    <td className="p-3">

                                        {row.count}

                                    </td>

                                    <td className="p-3">

                                        ₹{row.totalAmount}

                                    </td>

                                </tr>

                            ))

                        }

                    </tbody>

                </table>

            </div>

            {/* Top Due Customers */}

            <div className="bg-white rounded shadow p-6 mb-8">

                <h2 className="text-2xl font-bold mb-5">

                    Top Due Customers

                </h2>

                <table className="w-full">

                    <thead className="bg-slate-900 text-white">

                        <tr>

                            <th className="p-3">Customer</th>

                            <th className="p-3">Phone</th>

                            <th className="p-3">Due</th>

                        </tr>

                    </thead>

                    <tbody>

                        {

                            dueCustomers.map((customer) => (

                                <tr
                                    key={customer._id}
                                    className="border-b"
                                >

                                    <td className="p-3">

                                        {customer.name}

                                    </td>

                                    <td className="p-3">

                                        {customer.phone}

                                    </td>

                                    <td className="p-3">

                                        ₹{customer.totalDue}

                                    </td>

                                </tr>

                            ))

                        }

                    </tbody>

                </table>

            </div>

            {/* Top Selling Items */}

            <div className="bg-white rounded shadow p-6">

                <h2 className="text-2xl font-bold mb-5">

                    Top Selling Items

                </h2>

                <table className="w-full">

                    <thead className="bg-slate-900 text-white">

                        <tr>

                            <th className="p-3">Item</th>

                            <th className="p-3">Quantity Sold</th>

                        </tr>

                    </thead>

                    <tbody>

                        {

                            topItems.map((item, index) => (

                                <tr
                                    key={index}
                                    className="border-b"
                                >

                                    <td className="p-3">

                                        {item._id}

                                    </td>

                                    <td className="p-3">

                                        {item.totalSold}

                                    </td>

                                </tr>

                            ))

                        }

                    </tbody>

                </table>

            </div>

        </MainLayout>

    );

}

export default Reports;