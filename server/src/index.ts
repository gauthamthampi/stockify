import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from 'cors';
import router from "./routes/userRouter";

dotenv.config();

const app: Express = express();
const port = process.env.PORT;

app.use(cors());
app.use(express.json());
app.use('/api',router)
app.get("/", (req: Request, res: Response) => {
  res.send("Express + TypeScript Server");
});

mongoose.connect(`mongodb+srv://gthampies:${process.env.DBPASS}@stockifycluster0.3jvcc.mongodb.net/?retryWrites=true&w=majority&appName=stockifycluster0`)
  .then(() => console.log('Database connected successfully'))
  .catch(err => console.error('Database connection error:', err));


app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
