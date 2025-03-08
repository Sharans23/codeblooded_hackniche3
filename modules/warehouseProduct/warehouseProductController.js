import prisma from "../../utils/prisma.js";
import cloudinary from "../../utils/cloudinary.js";

export const createWarehouseProduct = async (req, res) => {
  try {
    const { name, code, category, type, brand, price, unit, warehouseId, quantity } = req.body;
    const file = req.file;

    let imageUrl = null;
    if (file) {
      const uploadedImage = await cloudinary.uploader.upload(file.path, {
        folder: "products",
      });
      imageUrl = uploadedImage.secure_url;
    }

    const product = await prisma.product.create({
      data: { name, code, category, type, brand, price, unit, img: imageUrl },
    });

    const warehouseProduct = await prisma.warehouseProduct.create({
      data: {
        warehouseId,
        productId: product.id,
        quantity,
      },
    });

    res.json({ product, warehouseProduct });
  } catch (error) {
    res.status(500).json({ error: "Error creating warehouse product" });
  }
};

// export const createWarehouseProduct = async (req, res) => {
//     try {
//       const { products, warehouseId } = req.body; // Expect an array of products in req.body
//       const files = req.files || []; // Handle multiple file uploads
  
//       const createdProducts = [];
  
//       for (let i = 0; i < products.length; i++) {
//         const { name, code, category, type, brand, price, unit, quantity } = products[i];
//         let imageUrl = null;
  
//         if (files[i]) {
//           const uploadedImage = await cloudinary.uploader.upload(files[i].path, {
//             folder: "products",
//           });
//           imageUrl = uploadedImage.secure_url;
//         }
  
//         const product = await prisma.product.create({
//           data: { name, code, category, type, brand, price, unit, img: imageUrl },
//         });
  
//         const warehouseProduct = await prisma.warehouseProduct.create({
//           data: {
//             warehouseId,
//             productId: product.id,
//             quantity,
//           },
//         });
  
//         createdProducts.push({ product, warehouseProduct });
//       }
  
//       res.json({ createdProducts });
//     } catch (error) {
//       console.error(error);
//       res.status(500).json({ error: "Error creating warehouse products" });
//     }
// };
  
export const getWarehouseProducts = async (req, res) => {
  try {
    const { warehouseId } = req.params;

    const warehouseProducts = await prisma.warehouseProduct.findMany({
      where: { warehouseId },
      include: { product: true },
    });

    res.json(warehouseProducts);
  } catch (error) {
    res.status(500).json({ error: "Error fetching warehouse products" });
  }
};
