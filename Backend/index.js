import express from "express"
import cors from "cors"
import dotenv from "dotenv"

dotenv.config();

const App=express();

//middleware to handle cors

App.use(cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    methods:["GET","POST","PUT","DELETE"],
    allowedHeaders:["Content-Type","Authorization"],
    credentials:true
})
)

//middleware to parse json data
App.use(express.json())

App.listen(3000,()=>{
    console.log("server run on port 3000");
})