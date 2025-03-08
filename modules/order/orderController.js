import prisma from "../../utils/prisma.js";
import { addDays } from "date-fns";

const PAYMENT_MODES = ["COD", "Card", "UPI", "NetBanking"];
const DELIVERY_STATUSES = [
  "ORDER_PLACED",
  "PROCESSING",
  "DISPATCHED",
  "OUT_FOR_DELIVERY",
  "DELIVERED",
  "CANCELLED",
];

export const createOrder = async (req, res) => {
  try {
    const { productId, warehouseId, paymentMode, quantity } = req.body;
    const clientId = req.user.id; // Extract clientId from logged-in user

    if (!PAYMENT_MODES.includes(paymentMode)) {
      return res.status(400).json({ error: "Invalid payment mode" });
    }

    // Fetch product availability in warehouse
    const warehouseProduct = await prisma.warehouseProduct.findFirst({
      where: { productId, warehouseId },
    });

    if (!warehouseProduct) {
      return res.status(404).json({ error: "Product not found in warehouse" });
    }

    const availableStock = parseInt(warehouseProduct.quantity);
    const orderQuantity = parseInt(quantity);
    
    if (orderQuantity <= 0) {
      return res.status(400).json({ error: "Quantity must be greater than 0" });
    }

    // Determine stock availability & expected delivery
    const inStock = orderQuantity <= availableStock;
    const expectedDelivery = inStock ? addDays(new Date(), 2) : addDays(new Date(), 4);

    // Update stock if available
    if (inStock) {
      await prisma.warehouseProduct.update({
        where: { id: warehouseProduct.id },
        data: { quantity: String(availableStock - orderQuantity) },
      });
    }

    // Create order
    const order = await prisma.order.create({
      data: {
        clientId,
        productId,
        warehouseId,
        paymentMode,
        paymentStatus: paymentMode === "COD" ? false : true,
        quantity,
        inStock,
        deliveryStatus: "ORDER_PLACED",
        expectedDelivery,
      },
    });

    res.status(201).json(order);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error placing order" });
  }
};

export const getClientOrders = async (req, res) => {
  try {
    const clientId = req.user.id;

    const orders = await prisma.order.findMany({
      where: { clientId },
      include: { product: true, warehouse: true },
    });

    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: "Error fetching orders" });
  }
};

export const getWarehouseOrders = async (req, res) => {
    try {
      const warehouseId = req.user.id;
  
      const orders = await prisma.order.findMany({
        where: { warehouseId },
        include: { product: true, warehouse: true },
      });
  
      res.json(orders);
    } catch (error) {
      res.status(500).json({ error: "Error fetching orders" });
    }
};
  
