require("dotenv").config();

const express = require("express");
const cors = require("cors");

const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const transactionRoutes =
require("./routes/transactionRoutes");
const voiceTransactionRoutes = require("./routes/voiceTransactionRoutes");
const customerRoutes = require("./routes/customerRoutes");
const dashboardRoutes =
require("./routes/dashboardRoutes");
const itemRoutes = require("./routes/itemRoutes");
const reportRoutes =
require("./routes/reportRoutes");
const paymentRoutes =
require("./routes/paymentRoutes");
const notificationRoutes =
require("./routes/notificationRoutes");
const settingsRoutes =
require("./routes/settingsRoutes");
const app = express();


app.use(cors());
app.use(express.json());

connectDB();

app.get("/", (req, res) => {
  res.send("Secure Katha backend is running");
});
// Authentication routes
app.use("/api/auth", authRoutes);

// Voice transaction routes
app.use("/api/voice", voiceTransactionRoutes);
app.use(

    "/api/transactions",

    transactionRoutes

);
// Customer routes
app.use("/api/customers", customerRoutes);
app.use(
    "/api/dashboard",
    dashboardRoutes
);
app.use("/api/items",itemRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/payments", paymentRoutes);
app.use(
    "/api/notifications",
    notificationRoutes
);
app.use(
    "/api/settings",
    settingsRoutes
);
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});