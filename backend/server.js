
const express = require("express");
const cors = require("cors");
require("dotenv").config();

const connectDB = require("./config/db");
const productRoutes = require("./routes/productRoutes");
const uploadRoutes = require("./routes/uploadRoutes");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Product API routes
app.use("/api/products", uploadRoutes);
app.use("/api/products", productRoutes);

// Test route
app.get("/", (req, res) => {
    res.send("Campus Swap Backend is running!");
});

// Start server after connecting to MongoDB
const PORT = process.env.PORT || 5000;

connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Campus Swap server running on port ${PORT}`);
    });
});
