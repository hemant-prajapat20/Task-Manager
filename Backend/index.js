import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import mongoose from "mongoose"
import auth_route from "./routes/auth_route.js"

// LOAD ENV FIRST
dotenv.config();

mongoose.connect(process.env.MONGO_URI)
.then(()=>{
    console.log("connected to database");
}).catch((err)=>{
    console.log("DB Error:", err);
})

const App = express();

// middleware to handle cors
App.use(cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    methods:["GET","POST","PUT","DELETE"],
    allowedHeaders:["Content-Type","Authorization"],
    credentials:true
}));

// middleware to parse json data
App.use(express.json())

App.listen(3000,()=>{
    console.log("server run on port 3000");
})

App.use("/api/auth",auth_route)