import express from "express";
import upload from "../../middleware/multer.js";
import {
  createWarehouseProduct,
  getWarehouseProducts,
} from "./warehouseProductController.js";

const router = express.Router();

router.post("/create", upload.single("image"), createWarehouseProduct);
router.get("/:warehouseId", getWarehouseProducts);

export default router;
