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

        const monthlySalesData = await Sales.aggregate([
            {
                $match: { owner: userEmail } // Match sales by user
            },
            {
                $group: {
                    _id: { month: { $month: "$date" }, year: { $year: "$date" } }, // Group by month and year
                    totalSales: { $sum: "$cash" }, // Sum of sales in each month
                    totalQuantitySold: { $sum: "$quantity" } // Sum of items sold in each month
                }
            },
            {
                $sort: { "_id.year": 1, "_id.month": 1 } // Sort by year and month
            }
        ]);

        const monthlySales = Array(12).fill(0); // Initialize with 0 for all months

        monthlySalesData.forEach(sale => {
            const monthIndex = sale._id.month - 1; // Adjust month to be 0-based
            monthlySales[monthIndex] = sale.totalSales;
        });

        return res.status(200).json({
            totalCustomers,
            totalInventoryItems,
            totalProfit,
            totalItemsSold,
            monthlySales, 
        });
    } catch (err: any) {
        return res.status(500).json({ message: 'An error occurred', error: err.message });
    }
};
