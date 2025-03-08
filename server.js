import express from "express";
import session from "express-session";
import passport from "passport";
import dotenv from "dotenv";
import cors from "cors";
import userRoutes from "./modules/user/userRoutes.js";
import warehouseRoutes from "./modules/warehouse/warehouseRoutes.js";
import clientRoutes from './modules/client/clientRoutes.js';
import clientProductRoutes from './modules/clientProduct/clientProductRoutes.js';
import productRoutes from './modules/product/productRoutes.js';
import warehouseProductRoutes from './modules/warehouseProduct/warehouseProductRoutes.js';
import orderRoutes from './modules/order/orderRoutes.js'
import "./utils/auth.js"; // Import OAuth setup

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie:{
      maxAge: 24 * 60 * 60 * 1000,
      httpOnly: true
    }
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use("/api/users", userRoutes);
app.use("/api/warehouses", warehouseRoutes);
app.use("/api/clients", clientRoutes);
app.use("/api/clientProducts", clientProductRoutes);
app.use("/api/warehouseProducts", warehouseProductRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

app.get('/get-session', (req, res) => {
  const sessionId = req.cookies['connect.sid']; // Requires cookie-parser middleware
  res.json({ sessionId });
});