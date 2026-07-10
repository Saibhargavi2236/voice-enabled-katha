import { useEffect, useState } from "react";

import MainLayout from "../layouts/MainLayout";

import {
    getNotifications,
    generateNotifications
} from "../services/notification";

function Notifications() {

    const [notifications, setNotifications] = useState([]);

    const loadNotifications = async () => {

        try {

            const data = await getNotifications();

            setNotifications(data.notifications);

        }

        catch (error) {

            alert("Could not load notifications.");

        }

    };

    useEffect(() => {

        loadNotifications();

    }, []);

    const handleGenerate = async () => {

        try {

            const response =
                await generateNotifications();

            alert(response.message);

            loadNotifications();

        }

        catch (error) {

            alert("Could not generate notifications.");

        }

    };

    return (

        <MainLayout>

            <div className="flex justify-between items-center mb-6">

                <h1 className="text-3xl font-bold">

                    Notifications

                </h1>

                <button

                    onClick={handleGenerate}

                    className="bg-blue-600 text-white px-5 py-2 rounded"

                >

                    Generate Notifications

                </button>

            </div>

            <div className="space-y-4">

                {

                    notifications.length === 0 ?

                    (

                        <div className="bg-white p-5 rounded shadow">

                            No notifications found.

                        </div>

                    )

                    :

                    notifications.map((notification) => (

                        <div

                            key={notification._id}

                            className="bg-white shadow rounded p-5"

                        >

                            <h2 className="text-xl font-bold">

                                {notification.title}

                            </h2>

                            <p className="mt-2">

                                {notification.message}

                            </p>

                            <p className="text-sm text-gray-500 mt-2">

                                {new Date(
                                    notification.createdAt
                                ).toLocaleString()}

                            </p>

                        </div>

                    ))

                }

            </div>

        </MainLayout>

    );

}

export default Notifications;