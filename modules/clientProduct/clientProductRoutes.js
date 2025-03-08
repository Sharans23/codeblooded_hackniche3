import express from "express";
import {
  createClientProduct,
  getClientProducts,
} from "../controllers/clientProductController.js";

const router = express.Router();

router.post("/create", createClientProduct);
router.get("/:clientId", getClientProducts);

export default router;
