import mongoose, { Schema, Document } from 'mongoose';

export interface ICustomer extends Document {
  name: string;
  address: string;
  email: String
  phone: string;
  creator: string;
  createdAt: Date;
}

const customerSchema: Schema<ICustomer> = new Schema(
  {
    name: {
      type: String,
    },
    address: {
      type: String,
    },
    email: {
      type: String,
    },
    phone: {
      type: String,
    },
    creator: {
      type: String,
    }
  },
  {
    timestamps: true, 
  }
);

const Customer = mongoose.model<ICustomer>('Customer', customerSchema);
export default Customer;
