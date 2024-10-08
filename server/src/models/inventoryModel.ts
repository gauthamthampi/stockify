import mongoose, { Schema, Document } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IInventory extends Document {
  name: string;
  description: string;
  quandity: number;
  price: number;
  creator: string;
  createdAt: Date;
}

const inventorySchema: Schema<IInventory> = new Schema(
    {
        name: {
          type: String,
          required: true,
        },
        description: {
          type: String,
          required: true,
          unique: true,
        },
        quandity: {
          type: Number,
        },
        price: {
          type: Number
        },
        creator: {
            type: String
        }
      },
      {
        timestamps: true,
      }
    );


const Inventory = mongoose.model<IInventory>('Inventory', inventorySchema);
export default Inventory;

