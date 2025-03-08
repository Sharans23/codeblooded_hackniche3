import prisma from "../../utils/prisma.js";

export const createWarehouse = async (req, res) => {
  try {
    const { name, location } = req.body;
    const warehouse = await prisma.warehouse.create({
      data: {
        name,
        location,
        adminId: req.user.id,
      },
    });
    res.status(201).json(warehouse);
  } catch (error) {
    res.status(500).json(error);
  }
};

export const getWarehouses = async (req, res) => {
  try {
    const warehouses = await prisma.warehouse.findMany();
    res.json(warehouses);
  } catch (error) {
    res.status(500).json({ error: "Error fetching warehouses" });
  }
};

export const updateWarehouse = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, location } = req.body;

    const warehouse = await prisma.warehouse.update({
      where: { id },
      data: { name, location },
    });

    res.json(warehouse);
  } catch (error) {
    res.status(500).json({ error: "Error updating warehouse" });
  }
};

export const deleteWarehouse = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.warehouse.delete({ where: { id } });
    res.json({ message: "Warehouse deleted" });
  } catch (error) {
    res.status(500).json({ error: "Error deleting warehouse" });
  }
};
