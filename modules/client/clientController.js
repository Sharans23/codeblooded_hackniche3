import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const prisma = new PrismaClient();
const SECRET = process.env.SESSION_SECRET; // Use your env variable

export const register = async (req, res) => {
  try {
    const { name, email, password, location } = req.body;

    // Check if email exists
    const existingClient = await prisma.client.findFirst({ where: { email } });
    if (existingClient) return res.status(400).json({ message: "Email already exists" });

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create client
    const newClient = await prisma.client.create({
      data: { name, email, password: hashedPassword, location },
    });

    res.status(201).json({ message: "Client registered successfully", client: newClient });
  } catch (error) {
    console.error("Register Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const client = await prisma.client.findFirst({ where: { email } });
    if (!client) return res.status(404).json({ message: "Client not found" });

    // Compare password
    const isMatch = await bcrypt.compare(password, client.password);
    if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

    // Generate JWT Token
    const token = jwt.sign({ id: client.id, email: client.email }, SECRET, { expiresIn: "24h" });

    res.status(200).json({ message: "Login successful", token });
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const myProfile = async (req, res) => {
  try {
    const client = await prisma.client.findUnique({ 
        where: { id: req.user.id }, 
        include: {warehouse:true}
    });

    if (!client) return res.status(404).json({ message: "Client not found" });

    res.status(200).json(client);
  } catch (error) {
    console.error("Profile Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const allClients = async (req, res) => {
  try {
    const clients = await prisma.client.findMany();
    res.status(200).json(clients);
  } catch (error) {
    console.error("All Clients Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const chooseWarehouse = async (req, res) => {
  try {
    const {warehouseId} = req.body;

    const updatedClient = await prisma.client.update({
      where: { id: req.user.id },
      data: { warehouseId },
    });

    res.status(200).json({ message: "Warehouse assigned successfully", client: updatedClient });
  } catch (error) {
    console.error("Choose Warehouse Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
