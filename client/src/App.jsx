import { Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import Customers from "./pages/Customers";
import ProtectedRoute from "./components/ProtectedRoute";
import Transactions from "./pages/Transactions";
import Inventory from "./pages/Inventory";
import Voice from "./pages/Voice";
import Payments from "./pages/Payments";
import Notifications from "./pages/Notifications";
import Reports from "./pages/Reports";
import Settings from "./pages/Settings";
function App() {

    return (

        <Routes>

            <Route
                path="/"
                element={<Login />}
            />

            <Route
                path="/signup"
                element={<Signup />}
            />

            <Route
                path="/dashboard"
                element={
                    <ProtectedRoute>
                        <Dashboard />
                    </ProtectedRoute>
                }
            />
            <Route
    path="/customers"
    element={
        <ProtectedRoute>
            <Customers />
        </ProtectedRoute>
    }
/>
<Route
    path="/transactions"
    element={
        <ProtectedRoute>
            <Transactions />
        </ProtectedRoute>
    }
/>
<Route
    path="/inventory"
    element={
        <ProtectedRoute>
            <Inventory />
        </ProtectedRoute>
    }
/>
<Route
    path="/voice"
    element={
        <ProtectedRoute>
            <Voice />
        </ProtectedRoute>
    }
/>
<Route
    path="/payments"
    element={
        <ProtectedRoute>
            <Payments />
        </ProtectedRoute>
    }
/>
<Route
    path="/notifications"
    element={
        <ProtectedRoute>
            <Notifications />
        </ProtectedRoute>
    }
/>
<Route
    path="/reports"
    element={
        <ProtectedRoute>
            <Reports />
        </ProtectedRoute>
    }
/>
<Route
    path="/settings"
    element={
        <ProtectedRoute>
            <Settings />
        </ProtectedRoute>
    }
/>
        

        </Routes>

    );

}

export default App;