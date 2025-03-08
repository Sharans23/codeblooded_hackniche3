import express from "express";
import { createOrder, getClientOrders, getWarehouseOrders } from "./orderController.js";
import { authenticate, isAuthenticated } from "../../middleware/authMiddleware.js"; // Ensure user is logged in

const router = express.Router();

router.post("/create", authenticate, createOrder);
router.get("/my-orders-client", authenticate, getClientOrders);
router.get("/my-orders-warehouse", isAuthenticated, getWarehouseOrders);

export default router;
