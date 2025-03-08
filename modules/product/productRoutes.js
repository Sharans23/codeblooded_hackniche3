import express from "express";
import upload from "../../middleware/multer.js";
import {
  getAllProducts,
  getProductsByCategory,
  uploadProductImage,
} from "./productController.js";

const router = express.Router();

router.get("/", getAllProducts);
router.get("/filter", getProductsByCategory);
router.post("/upload", upload.single("image"), uploadProductImage);

export default router;
