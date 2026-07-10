import { NavLink } from "react-router-dom";
import {
    LayoutDashboard,
    Users,
    Package,
    Mic,
    CreditCard,
    BarChart3,
    Bell,
    Settings
} from "lucide-react";

function Sidebar() {

    const menu = [

        {
            name: "Dashboard",
            path: "/dashboard",
            icon: <LayoutDashboard size={20}/>
        },

        {
            name: "Customers",
            path: "/customers",
            icon: <Users size={20}/>
        },

        {
            name: "Inventory",
            path: "/inventory",
            icon: <Package size={20}/>
        },
        {
    name: "Transactions",
    path: "/transactions",
    icon: <CreditCard size={20}/>
},
        {
            name: "Voice AI",
            path: "/voice",
            icon: <Mic size={20}/>
        },

        {
            name: "Payments",
            path: "/payments",
            icon: <CreditCard size={20}/>
        },

        {
            name: "Reports",
            path: "/reports",
            icon: <BarChart3 size={20}/>
        },

        {
            name: "Notifications",
            path: "/notifications",
            icon: <Bell size={20}/>
        },

        {
            name: "Settings",
            path: "/settings",
            icon: <Settings size={20}/>
        }

    ];

    return (

        <div className="w-64 bg-slate-900 text-white min-h-screen">

            <div className="text-3xl font-bold p-6 border-b border-slate-700">

                Secure Katha

            </div>

            <div className="mt-6">

                {

                    menu.map((item)=>(

                        <NavLink

                            key={item.path}

                            to={item.path}

                            className={({isActive})=>

                                `flex items-center gap-3 px-6 py-4 hover:bg-slate-800 ${
                                    isActive ? "bg-slate-800" : ""
                                }`

                            }

                        >

                            {item.icon}

                            {item.name}

                        </NavLink>

                    ))

                }

            </div>

        </div>

    );

}

export default Sidebar;