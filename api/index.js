require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const path = require("path");

const { connectDB } = require("../config/db");
// ... keep all your other requires ...

const productRoutes = require("../routes/productRoutes");
const customerRoutes = require("../routes/customerRoutes");
const adminRoutes = require("../routes/adminRoutes");
const orderRoutes = require("../routes/orderRoutes");
const customerOrderRoutes = require("../routes/customerOrderRoutes");
const categoryRoutes = require("../routes/categoryRoutes");
const couponRoutes = require("../routes/couponRoutes");
const attributeRoutes = require("../routes/attributeRoutes");
const settingRoutes = require("../routes/settingRoutes");
const currencyRoutes = require("../routes/currencyRoutes");
const languageRoutes = require("../routes/languageRoutes");
const notificationRoutes = require("../routes/notificationRoutes");
const { isAuth, isAdmin } = require("../config/auth");

const { addOrder } = require("../controller/orderController");


// Initialize DB connection
connectDB();

const app = express();

// Middleware
app.set("trust proxy", 1);
app.use(express.json({ limit: "4mb" }));
app.use(helmet());
app.options("*", cors());
app.use(cors());

// Routes
app.get("/", (req, res) => {
  res.send("App works properly!");
});

app.post("/api/order/add", (req, res) => {
  return addOrder(req,res);
});

// ... keep all your route middleware ...


app.use("/api/products/", productRoutes);
app.use("/api/category/", categoryRoutes);
app.use("/api/coupon/", couponRoutes);
app.use("/api/customer/", customerRoutes);
app.use("/api/order/", isAuth, customerOrderRoutes);
app.use("/api/attributes/", attributeRoutes);
app.use("/api/setting/", settingRoutes);
app.use("/api/currency/", isAuth, currencyRoutes);
app.use("/api/language/", languageRoutes);
app.use("/api/notification/", isAuth, notificationRoutes);


app.use("/api/admin/", adminRoutes);
app.use("/api/orders/", orderRoutes);



// Error handling
app.use((err, req, res, next) => {
  if (res.headersSent) return next(err);
  res.status(400).json({ message: err.message });
});

// Static files - only include if you have a frontend to serve
// app.use("/static", express.static(path.join(__dirname, "..", "public")));

// For Vercel, you typically don't want to serve HTML files from your API
// Remove this catch-all route if you're using Vercel for hosting frontend separately
// app.get("*", (req, res) => {
//   res.sendFile(path.join(__dirname, "..", "build", "index.html"));
// });

// Export the app for Vercel
module.exports = app;