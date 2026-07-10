import { LogOut } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

function Navbar() {

    const { user, logout } = useAuth();

    const navigate = useNavigate();

    const handleLogout = () => {

        logout();

        navigate("/");

    };

    return (

        <div className="h-16 bg-white shadow flex items-center justify-between px-8">

            <div>

                <h2 className="text-2xl font-semibold">

                    Dashboard

                </h2>

            </div>

            <div className="flex items-center gap-5">

                <div className="text-right">

                    <p className="font-semibold">

                        {user?.name}

                    </p>

                    <p className="text-sm text-gray-500">

                        {user?.shopName}

                    </p>

                </div>

                <button

                    onClick={handleLogout}

                    className="bg-red-500 text-white p-2 rounded"

                >

                    <LogOut size={20}/>

                </button>

            </div>

        </div>

    );

}

export default Navbar;