import express from "express";
import {
  createWarehouse,
  getWarehouses,
  updateWarehouse,
  deleteWarehouse,
} from "./warehouseController.js";
import { isAuthenticated } from "../../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", isAuthenticated, createWarehouse);
router.get("/", getWarehouses);
router.put("/:id", isAuthenticated, updateWarehouse);
router.delete("/:id", isAuthenticated, deleteWarehouse);

export default router;
