import express from "express";
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";
import authRoute from './Routes/authRoute.js'
import { connectDB } from "./database/db.js";
import cookieParser from "cookie-parser";

const app = express();
dotenv.config();

connectDB();

app.use(cors());
app.use(cookieParser());

app.use(morgan("dev"));
app.use(express.json());


app.use("/api/v1/auth",authRoute);

app.get("/", (req, res) => {
  res.send("<h1>i am backend</h1>");
});

const port = process.env.PORT;

app.listen(port || 8000, () => {
  console.log(`server is running at port:${port}`);
});
