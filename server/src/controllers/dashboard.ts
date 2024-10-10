import { Request, Response } from 'express';
import Customer from '../models/customerModel';
import Inventory from '../models/inventoryModel';
import Sales from '../models/saleModel';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';

dotenv.config();

export const fetchDashboardData: any = async (req: Request, res: Response): Promise<Response | void> => {
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

        const totalCustomers = await Customer.countDocuments({ creator: userEmail });

        const totalInventoryItems = await Inventory.countDocuments({ creator: userEmail });

        const sales = await Sales.find({ owner: userEmail });
        let totalProfit = 0;
        let totalItemsSold = 0;

        sales.forEach(sale => {
            totalProfit += sale.cash;
            totalItemsSold += sale.quantity;
        });

        return res.status(200).json({
            totalCustomers,
            totalInventoryItems,
            totalProfit,
            totalItemsSold,
        });
    } catch (err: any) {
        return res.status(500).json({ message: 'An error occurred', error: err.message });
    }
};
