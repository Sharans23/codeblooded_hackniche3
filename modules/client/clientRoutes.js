import express from "express";
import { register, login, myProfile, allClients, chooseWarehouse } from "./clientController.js";
import { authenticate } from "../../middleware/authMiddleware.js";

const router = express.Router();

router.post("/register", register); // Public
router.post("/login", login); // Public
router.get("/myProfile", authenticate, myProfile); // Protected
router.get("/allClients", allClients); // Protected
router.put("/chooseWarehouse", authenticate, chooseWarehouse); // Protected

export default router;
