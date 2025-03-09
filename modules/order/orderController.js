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
import { GoogleSpreadsheet } from "google-spreadsheet";
import { JWT } from "google-auth-library";
import { fileURLToPath } from "url";
import path from "path";
import fs from "fs";

// Manually define __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


const SERVICE_ACCOUNT_CREDENTIALS = JSON.parse(
    fs.readFileSync(path.resolve(__dirname, "./credentials.json"), "utf-8")
);

const SHEET_ID = "12Mb-rsBbHC1kzlHraIRUmS_73EfbtXccEQy4_3YhdMA"; // Replace with your Google Sheet ID

const auth = new JWT({
  email: SERVICE_ACCOUNT_CREDENTIALS.client_email,
  key: SERVICE_ACCOUNT_CREDENTIALS.private_key,
  scopes: ["https://www.googleapis.com/auth/spreadsheets"],
});

const doc = new GoogleSpreadsheet(SHEET_ID, auth);

export const createOrder = async (req, res) => {
  try {
    const { products } = req.body;
    const clientId = req.user.id;

    if (!Array.isArray(products) || products.length === 0) {
      return res.status(400).json({ error: "Invalid product list" });
    }

    let orderItems = [];
    let errors = [];

    for (const product of products) {
      const { productId, warehouseId, paymentMode, quantity } = product;

      if (!PAYMENT_MODES.includes(paymentMode)) {
        errors.push({ productId, error: "Invalid payment mode" });
        continue;
      }

      const warehouseProduct = await prisma.warehouseProduct.findFirst({
        where: { productId, warehouseId },
      });

      if (!warehouseProduct) {
        errors.push({ productId, error: "Product not found in warehouse" });
        continue;
      }

      const availableStock = parseInt(warehouseProduct.quantity);
      const orderQuantity = parseInt(quantity);

      if (orderQuantity <= 0) {
        errors.push({ productId, error: "Quantity must be greater than 0" });
        continue;
      }

      const inStock = orderQuantity <= availableStock;
      const expectedDelivery = inStock ? addDays(new Date(), 2) : addDays(new Date(), 4);

      if (inStock) {
        await prisma.warehouseProduct.update({
          where: { id: warehouseProduct.id },
          data: { quantity: String(availableStock - orderQuantity) },
        });
      }

      orderItems.push({
        clientId,
        productId,
        warehouseId,
        paymentMode,
        paymentStatus: paymentMode === "COD" ? false : true,
        quantity,
        inStock,
        deliveryStatus: "ORDER_PLACED",
        expectedDelivery,
      });
    }

    if (orderItems.length > 0) {
      const orders = await prisma.order.createMany({ data: orderItems });

      // Add orders to Google Sheets
      await addOrdersToGoogleSheet(orderItems);

      return res.status(201).json({
        message: "Order placed successfully",
        orders,
        errors,
      });
    }

    res.status(400).json({ error: "No valid orders could be placed", errors });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error placing order" });
  }
};

// Function to write orders to Google Sheets
async function addOrdersToGoogleSheet(orderItems) {
  await doc.loadInfo();
  const sheet = doc.sheetsByIndex[0]; // Assuming the first sheet

  const rows = orderItems.map((order) => ({
    ClientID: order.clientId,
    ProductID: order.productId,
    WarehouseID: order.warehouseId,
    PaymentMode: order.paymentMode,
    PaymentStatus: order.paymentStatus ? "Paid" : "Pending",
    Quantity: order.quantity,
    InStock: order.inStock ? "Yes" : "No",
    DeliveryStatus: order.deliveryStatus,
    ExpectedDelivery: order.expectedDelivery.toISOString(),
  }));

  await sheet.addRows(rows);
}

// export const createOrder = async (req, res) => {
//     try {
//       const { products } = req.body; // Array of products
//       const clientId = req.user.id; // Extract clientId from logged-in user
  
//       if (!Array.isArray(products) || products.length === 0) {
//         return res.status(400).json({ error: "Invalid product list" });
//       }
  
//       let orderItems = [];
//       let errors = [];
  
//       for (const product of products) {
//         const { productId, warehouseId, paymentMode, quantity } = product;
  
//         if (!PAYMENT_MODES.includes(paymentMode)) {
//           errors.push({ productId, error: "Invalid payment mode" });
//           continue;
//         }
  
//         const warehouseProduct = await prisma.warehouseProduct.findFirst({
//           where: { productId, warehouseId },
//         });
  
//         if (!warehouseProduct) {
//           errors.push({ productId, error: "Product not found in warehouse" });
//           continue;
//         }
  
//         const availableStock = parseInt(warehouseProduct.quantity);
//         const orderQuantity = parseInt(quantity);
  
//         if (orderQuantity <= 0) {
//           errors.push({ productId, error: "Quantity must be greater than 0" });
//           continue;
//         }
  
//         const inStock = orderQuantity <= availableStock;
//         const expectedDelivery = inStock ? addDays(new Date(), 2) : addDays(new Date(), 4);
  
//         if (inStock) {
//           await prisma.warehouseProduct.update({
//             where: { id: warehouseProduct.id },
//             data: { quantity: String(availableStock - orderQuantity) },
//           });
//         }
  
//         orderItems.push({
//           clientId,
//           productId,
//           warehouseId,
//           paymentMode,
//           paymentStatus: paymentMode === "COD" ? false : true,
//           quantity,
//           inStock,
//           deliveryStatus: "ORDER_PLACED",
//           expectedDelivery,
//         });
//       }
  
//       if (orderItems.length > 0) {
//         const orders = await prisma.order.createMany({
//           data: orderItems,
//         });
//         return res.status(201).json({ message: "Order placed successfully", orders, errors });
//       }
  
//       res.status(400).json({ error: "No valid orders could be placed", errors });
//     } catch (error) {
//       console.error(error);
//       res.status(500).json({ error: "Error placing order" });
//     }
// };
  
// export const createOrder = async (req, res) => {
//   try {
//     const { productId, warehouseId, paymentMode, quantity } = req.body;
//     const clientId = req.user.id; // Extract clientId from logged-in user

//     if (!PAYMENT_MODES.includes(paymentMode)) {
//       return res.status(400).json({ error: "Invalid payment mode" });
//     }

//     // Fetch product availability in warehouse
//     const warehouseProduct = await prisma.warehouseProduct.findFirst({
//       where: { productId, warehouseId },
//     });

//     if (!warehouseProduct) {
//       return res.status(404).json({ error: "Product not found in warehouse" });
//     }

//     const availableStock = parseInt(warehouseProduct.quantity);
//     const orderQuantity = parseInt(quantity);
    
//     if (orderQuantity <= 0) {
//       return res.status(400).json({ error: "Quantity must be greater than 0" });
//     }

//     // Determine stock availability & expected delivery
//     const inStock = orderQuantity <= availableStock;
//     const expectedDelivery = inStock ? addDays(new Date(), 2) : addDays(new Date(), 4);

//     // Update stock if available
//     if (inStock) {
//       await prisma.warehouseProduct.update({
//         where: { id: warehouseProduct.id },
//         data: { quantity: String(availableStock - orderQuantity) },
//       });
//     }

//     // Create order
//     const order = await prisma.order.create({
//       data: {
//         clientId,
//         productId,
//         warehouseId,
//         paymentMode,
//         paymentStatus: paymentMode === "COD" ? false : true,
//         quantity,
//         inStock,
//         deliveryStatus: "ORDER_PLACED",
//         expectedDelivery,
//       },
//     });

//     res.status(201).json(order);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: "Error placing order" });
//   }
// };

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
  
