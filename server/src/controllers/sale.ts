import { Request, Response } from 'express';
import Sales from '../models/saleModel';
import Inventory from '../models/inventoryModel';
import Customer from '../models/customerModel';
import jwt from 'jsonwebtoken';


export const fetchSales:any = async (req: Request, res: Response): Promise<Response | void> => {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
    try {
        const decodedToken: any = jwt.decode(token);
        if (!decodedToken || !decodedToken.email) {
            return res.status(400).json({ message: 'Invalid token' });
        }

        const userEmail = decodedToken.email;
    const sales = await Sales.find({owner:userEmail});
    if (!sales) {
      return res.status(404).json({ message: 'No sales found' });
    }
    return res.status(200).json(sales);
  } catch (err: any) {
    return res.status(500).json({ message: 'An error occurred', error: err.message });
  }
};

export const recordSale:any = async (req: Request, res: Response): Promise<Response | void> => {
  const { itemName, customerName, quantity } = req.body;
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
      return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    const decodedToken: any = jwt.decode(token);
        if (!decodedToken || !decodedToken.email) {
            return res.status(400).json({ message: 'Invalid token' });
        }

        const userEmail = decodedToken.email;
    const item = await Inventory.findOne({ name: itemName });
    if (!item || item.quandity < quantity) {
      return res.status(400).json({ message: 'Not enough stock available' });
    }

    const cash = item.price * quantity;

    const sale = new Sales({
      itemName,
      customerName,
      quantity,
      owner:userEmail,
      cash
    });

    await sale.save();

    item.quandity -= quantity;
    await item.save();

    return res.status(201).json({ message: 'Sale recorded successfully' });
  } catch (err: any) {
    return res.status(500).json({ message: 'An error occurred', error: err.message });
  }
};
