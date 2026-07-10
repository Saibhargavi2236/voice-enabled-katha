import { useEffect, useState } from "react";

import MainLayout from "../layouts/MainLayout";

import {
    getProfile,
    updateProfile
} from "../services/settings";

function Settings() {

    const [formData, setFormData] = useState({

        name: "",

        email: "",

        phone: "",

        shopName: ""

    });

    useEffect(() => {

        loadProfile();

    }, []);

    const loadProfile = async () => {

        try {

            const data = await getProfile();

            setFormData({

                name: data.user.name,

                email: data.user.email,

                phone: data.user.phone,

                shopName: data.user.shopName || ""

            });

        }

        catch (error) {

            alert("Could not load profile.");

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

            const response =
                await updateProfile(formData);

            alert(response.message);

        }

        catch (error) {

            alert(

                error.response?.data?.message ||

                "Update Failed"

            );

        }

    };

    return (

        <MainLayout>

            <h1 className="text-3xl font-bold mb-6">

                Settings

            </h1>

            <form

                onSubmit={handleSubmit}

                className="bg-white p-6 rounded shadow"

            >

                <input

                    type="text"

                    name="name"

                    placeholder="Name"

                    className="border w-full p-3 rounded mb-4"

                    value={formData.name}

                    onChange={handleChange}

                />

                <input

                    type="email"

                    name="email"

                    placeholder="Email"

                    className="border w-full p-3 rounded mb-4"

                    value={formData.email}

                    onChange={handleChange}

                />

                <input

                    type="text"

                    name="phone"

                    placeholder="Phone"

                    className="border w-full p-3 rounded mb-4"

                    value={formData.phone}

                    onChange={handleChange}

                />

                <input

                    type="text"

                    name="shopName"

                    placeholder="Shop Name"

                    className="border w-full p-3 rounded mb-6"

                    value={formData.shopName}

                    onChange={handleChange}

                />

                <button

                    className="bg-blue-600 text-white px-6 py-3 rounded"

                >

                    Update Profile

                </button>

            </form>

        </MainLayout>

    );

}

export default Settings;