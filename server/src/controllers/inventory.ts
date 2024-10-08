import { Request, Response } from 'express';
import Inventory from '../models/inventoryModel';
import dotenv from 'dotenv'
import jwt from 'jsonwebtoken';
dotenv.config()

export const fetchItemDetails:any = async (req: Request, res: Response): Promise<Response | void> => {
    const token = req.headers.authorization?.split(" ")[1];
    console.log("token is "+token);
    if (!token) {
        return res.status(401).json({ message: 'Unauthorized' });
      }
    
    try {
        const decodedToken: any = jwt.decode(token);
        if (!decodedToken || !decodedToken.email) {
          return res.status(400).json({ message: 'Invalid token' });
        }
        const userEmail = decodedToken.email;
        const itemDetails = Inventory.find({creator:userEmail})
        return res.status(200).json(itemDetails);
      } catch (error:any) {
        return res.status(500).json({ message: 'An error occurred', error: error.message });
      }
}

export const addNewItems:any = async(req:Request, res:Response): Promise<Response | void> => {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
        return res.status(401).json({ message: 'Unauthorized' });
      } 

      try{
        const decodedToken: any = jwt.decode(token);
    
        if (!decodedToken || !decodedToken.email) {
          return res.status(400).json({ message: 'Invalid token' });
        }
    
        const userEmail = decodedToken.email;
        const {name,description,quandity,price} = req.body
        const newitem = await Inventory.create({
            name,
            description,
            quandity,
            price,
            creator:userEmail
        })
        if (newitem) {
            return res.status(201).json({
                message: "Signup Successfull"
            });
          } else {
            return res.status(400).json({ message: 'Invalid item data' });
          }
      }catch(err:any){
        return res.status(500).json({ message: 'An error occurred', error: err.message });
      }
}