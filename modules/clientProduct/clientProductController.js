import prisma from "../../utils/prisma.js";

export const createClientProduct = async (req, res) => {
  try {
    const clientId = req.user.id;
    const { productId, quantity } = req.body;
    // console.log(clientId)

    const clientProduct = await prisma.clientProduct.create({
      data: { clientId:clientId, productId, quantity },
    });

    res.json(clientProduct);
  } catch (error) {
    console.log(error)
    res.status(500).json(error);
  }
};

export const getClientProducts = async (req, res) => {
  try {
    const { clientId } = req.params;

    const clientProducts = await prisma.clientProduct.findMany({
      where: { clientId },
      include: { product: true },
    });

    res.json(clientProducts);
  } catch (error) {
    res.status(500).json({ error: "Error fetching client products" });
  }
};
