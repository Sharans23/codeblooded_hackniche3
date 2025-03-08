import prisma from "../../utils/prisma.js";
import cloudinary from "../../utils/cloudinary.js";

export const getAllProducts = async (req, res) => {
  try {
    const products = await prisma.product.findMany();
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: "Error fetching products" });
  }
};

export const getProductsByCategory = async (req, res) => {
  try {
    const { category, type } = req.query;
    const products = await prisma.product.findMany({
      where: {
        ...(category && { category }),
        ...(type && { type }),
      },
    });
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: "Error fetching products" });
  }
};

export const uploadProductImage = async (req, res) => {
  try {
    const file = req.file;
    if (!file) return res.status(400).json({ error: "No file uploaded" });

    const uploadedImage = await cloudinary.uploader.upload(file.path, {
      folder: "products",
    });

    res.json({ url: uploadedImage.secure_url });
  } catch (error) {
    res.status(500).json({ error: "Error uploading image" });
  }
};
