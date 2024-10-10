import mongoose, { Schema, Document } from 'mongoose';

export interface ISales extends Document {
  itemName: string;
  customerName: string;
  quantity: number;
  cash: number;
  owner: string;
  saleDate: Date;
}

const salesSchema: Schema = new mongoose.Schema({
  itemName: { type: String, },
  customerName: { type: String,},
  quantity: { type: Number, },
  cash: { type: Number,  },
  owner: {type:String},
  saleDate: { type: Date, default: Date.now }
});

const Sale =  mongoose.model<ISales>('Sales', salesSchema);
export default Sale; 


