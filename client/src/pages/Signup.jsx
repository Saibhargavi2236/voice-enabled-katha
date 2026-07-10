import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signupUser } from "../services/auth";

function Signup() {

    const navigate = useNavigate();

    const [formData, setFormData] = useState({

        name: "",
        email: "",
        phone: "",
        password: "",
        role: "SHOPKEEPER",
        shopName: ""

    });

    const handleChange = (e) => {

        setFormData({

            ...formData,
            [e.target.name]: e.target.value

        });

    };

    const handleSubmit = async (e) => {

        e.preventDefault();

        try {

            const data = await signupUser(formData);

            alert(data.message);

            navigate("/");

        }

        catch (error) {

            alert(
                error.response?.data?.message ||
                "Signup Failed"
            );

        }

    };

    return (

        <div className="min-h-screen flex items-center justify-center bg-gray-100">

            <div className="bg-white shadow-lg rounded-lg p-8 w-96">

                <h1 className="text-3xl font-bold text-center mb-6">
                    Create Account
                </h1>

                <form onSubmit={handleSubmit}>

                    <input
                        type="text"
                        name="name"
                        placeholder="Name"
                        className="w-full border p-3 rounded mb-4"
                        onChange={handleChange}
                    />

                    <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        className="w-full border p-3 rounded mb-4"
                        onChange={handleChange}
                    />

                    <input
                        type="text"
                        name="phone"
                        placeholder="Phone Number"
                        className="w-full border p-3 rounded mb-4"
                        onChange={handleChange}
                    />

                    <input
                        type="text"
                        name="shopName"
                        placeholder="Shop Name"
                        className="w-full border p-3 rounded mb-4"
                        onChange={handleChange}
                    />

                    <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        className="w-full border p-3 rounded mb-4"
                        onChange={handleChange}
                    />

                    <button
                        type="submit"
                        className="w-full bg-green-600 text-white p-3 rounded"
                    >
                        Signup
                    </button>

                </form>

                <p className="mt-5 text-center">

                    Already have an account?

                    <Link
                        to="/"
                        className="text-blue-600 ml-2"
                    >
                        Login
                    </Link>

                </p>

            </div>

        </div>

    );

}

export default Signup;