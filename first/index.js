// server.js
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");
require("dotenv").config();
const Stripe = require("stripe");
const stripe = Stripe(process.env.STRIPE_API_KEY);

dotenv.config();

const app = express();
app.use(
  cors({
    origin: "http://localhost:3000", // Replace with your frontend URL
    credentials: true,
  })
);

app.use(express.json());
// Import dashboard routes
const dashboardRoutes = require("./routes/dashboard");
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Use dashboard routes
app.use("/api/dashboard", dashboardRoutes);

mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error(err));

// Import routes
const userRoutes = require("./routes/user");
const serviceRoutes = require("./routes/service");
const paymentRoutes = require("./routes/payment");
const cartRoutes = require("./routes/cart");

// Use routes
app.use("/api/users", userRoutes);
app.use("/api/services", serviceRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/cart", cartRoutes);

app.listen(5000, () => {
  console.log("Server running on localhost:5000");
});
