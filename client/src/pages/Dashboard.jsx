import { useEffect, useState } from "react";

import MainLayout from "../layouts/MainLayout";

import { getDashboardSummary }
from "../services/dashboard";

function Dashboard() {

    const [dashboard, setDashboard] =
    useState(null);

    useEffect(() => {

        loadDashboard();

    }, []);

    const loadDashboard = async () => {

        try {

            const data =
            await getDashboardSummary();

            setDashboard(data.dashboard);

        }

        catch(error){

            console.log(error);

        }

    };

    if(!dashboard){

        return (

            <MainLayout>

                Loading...

            </MainLayout>

        );

    }

    return (

        <MainLayout>

            <h1
            className="text-3xl font-bold mb-8">

                Dashboard

            </h1>

            <div
            className="grid grid-cols-5 gap-6">

                <div className="bg-white p-6 rounded shadow">

                    <h3>Total Customers</h3>

                    <p className="text-3xl font-bold">

                        {dashboard.totalCustomers}

                    </p>

                </div>

                <div className="bg-white p-6 rounded shadow">

                    <h3>Outstanding</h3>

                    <p className="text-3xl font-bold">

                        ₹{dashboard.totalOutstanding}

                    </p>

                </div>

                <div className="bg-white p-6 rounded shadow">

                    <h3>Today's Collection</h3>

                    <p className="text-3xl font-bold">

                        ₹{dashboard.todayCollection}

                    </p>

                </div>

                <div className="bg-white p-6 rounded shadow">

                    <h3>Today's Due</h3>

                    <p className="text-3xl font-bold">

                        ₹{dashboard.todayDue}

                    </p>

                </div>

                <div className="bg-white p-6 rounded shadow">

                    <h3>Transactions</h3>

                    <p className="text-3xl font-bold">

                        {dashboard.todayTransactions}

                    </p>

                </div>

            </div>

        </MainLayout>

    );

}

export default Dashboard;