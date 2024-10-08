import { Request, Response } from 'express';
import User from '../models/userModel';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv'
import bcrypt from 'bcryptjs'
dotenv.config()


export const registerUser:any = async (req: Request, res: Response): Promise<Response | void> => {
    const { name, email, password } = req.body;
  
    try {
      const userExists = await User.findOne({ email });
  
      if (userExists) {
        return res.status(400).json({ message: 'User already exists' });
      }
  
      const user = await User.create({
        name,
        email,
        password,
      });
  
      if (user) {
        return res.status(201).json({
            message: "Signup Successfull"
        });
      } else {
        return res.status(400).json({ message: 'Invalid user data' });
      }
    } catch (error) {
      return res.status(500).json({ message: 'Server error' });
    }
  };

export const logincheck:any = async (req: Request, res: Response): Promise<Response | void> => {
    const { username, password } = req.body;    
    try {
        const user = await User.findOne({ email:username });

        if (!user) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        const token = jwt.sign({  email: user.email }, process.env.JWT_SECRET as string, {
            expiresIn: '24h', 
        });

        return res.status(200).json({ message: 'Login successful', token });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal server error' });
    }

}

export const userDetails:any = async (req: Request, res: Response): Promise<Response | void> => {
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

    const user = await User.findOne({ email: userEmail });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const userDetails = {
      name: user.name,
      email: user.email,
      createdAt: user.createdAt,
    };

    return res.status(200).json(userDetails);
  } catch (error:any) {
    return res.status(500).json({ message: 'An error occurred', error: error.message });
  }
}