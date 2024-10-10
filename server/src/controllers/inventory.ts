import { Request, Response } from 'express';
import Inventory from '../models/inventoryModel';
import dotenv from 'dotenv'
import jwt from 'jsonwebtoken';
dotenv.config()

export const fetchItemDetails:any = async (req: Request, res: Response): Promise<Response | void> => {
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
      
      const itemDetails = await Inventory.find({ creator: userEmail }).exec();
      
      
      if (!itemDetails) {
          return res.status(404).json({ message: 'No items found' });
      }

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

export const editItem: any = async (req: Request, res: Response): Promise<Response | void> => {
  try {
    const { name, description, quandity, price } = req.body;
    const {id} = req.params    
    

    const item = await Inventory.findOne({ _id: id });

    if (!item) {
      return res.status(404).json({ message: 'Item not found or you do not have permission to edit this item' });
    }

    item.name = name || item.name;
    item.description = description || item.description;
    item.quandity = quandity || item.quandity;
    item.price = price || item.price;

    await item.save();

    return res.status(200).json({
      message: "Item updated successfully",
      item,
    });

  } catch (err: any) {
    return res.status(500).json({ message: 'An error occurred', error: err.message });
  }
};

export const deleteItem: any = async (req: Request, res: Response): Promise<Response | void> => {
 
  try {
    
    const { id } = req.params;

    const item = await Inventory.findOne({ _id: id });

    if (!item) {
      return res.status(404).json({ message: 'Item not found or you do not have permission to delete this item' });
    }

    await item.deleteOne();

    return res.status(200).json({
      message: "Item deleted successfully",
    });

  } catch (err: any) {
    return res.status(500).json({ message: 'An error occurred', error: err.message });    
  }
};


