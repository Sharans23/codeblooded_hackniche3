import express from "express";
import {
  createClientProduct,
  getClientProducts,
} from "./clientProductController.js";
import { authenticate } from "../../middleware/authMiddleware.js";

const router = express.Router();

router.post("/create", authenticate, createClientProduct);
router.get("/:clientId", getClientProducts);

export default router;
