import { Request, Response } from 'express';
import Customer from '../models/customerModel'; // Adjust the path according to your project structure
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';

dotenv.config();

export const fetchCustomerDetails:any = async (req: Request, res: Response): Promise<Response | void> => {
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

        const customerDetails = await Customer.find({ creator: userEmail }).exec();

        if (!customerDetails.length) {
            return res.status(404).json({ message: 'No customers found' });
        }

        return res.status(200).json(customerDetails);
    } catch (error: any) {
        return res.status(500).json({ message: 'An error occurred', error: error.message });
    }
};

export const addNewCustomer:any = async (req: Request, res: Response): Promise<Response | void> => {
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
        const { name, email, phone, address } = req.body;
 
        const newCustomer = await Customer.create({
            name,
            email,
            phone,
            address,
            creator: userEmail
        });

        return res.status(201).json({
            message: "Customer added successfully",
            customer: newCustomer
        });
    } catch (err: any) {
        return res.status(500).json({ message: 'An error occurred', error: err.message });
    }
};

export const editCustomer:any = async (req: Request, res: Response): Promise<Response | void> => {

    try {
        const { id } = req.params;
        const { name, email, phone, address } = req.body;

        const customer = await Customer.findOne({ _id: id});

        if (!customer) {
            return res.status(404).json({ message: 'Customer not found or you do not have permission to edit this customer' });
        }

        customer.name = name || customer.name;
        customer.email = email || customer.email;
        customer.phone = phone || customer.phone;
        customer.address = address || customer.address;

        await customer.save();

        return res.status(200).json({
            message: "Customer updated successfully",
            customer,
        });
    } catch (err: any) {
        return res.status(500).json({ message: 'An error occurred', error: err.message });
    }
};

export const deleteCustomer:any = async (req: Request, res: Response): Promise<Response | void> => {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    try {
        const decodedToken: any = jwt.decode(token);
        if (!decodedToken || !decodedToken.email) {
            return res.status(400).json({ message: 'Invalid token' });
        }

        const { id } = req.params;

        const customer = await Customer.findOne({ _id: id, creator: decodedToken.email });

        if (!customer) {
            return res.status(404).json({ message: 'Customer not found or you do not have permission to delete this customer' });
        }

        await customer.deleteOne();

        return res.status(200).json({
            message: "Customer deleted successfully",
        });
    } catch (err: any) {
        return res.status(500).json({ message: 'An error occurred', error: err.message });
    }
};