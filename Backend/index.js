import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import mongoose from "mongoose"
import cookieParser from "cookie-parser"
import path from "path"

import auth_route from "./routes/auth_route.js"
import user_route from "./routes/user_route.js"
import task_route from "./routes/task_route.js"
import report_route from "./routes/report_route.js"
import { fileURLToPath } from "url"


// LOAD ENV FIRST
dotenv.config();

const __filename=fileURLToPath(import.meta.url)
const __dirname = path.dirname(__dirname)

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

App.use(cookieParser()) // for parsing cookies

App.listen(3000,()=>{
    console.log("server run on port 3000");
})

App.use("/api/auth",auth_route)
App.use("/api/users",user_route)
App.use("/api/tasks",task_route)
App.use("/api/reports",report_route)

//serve static files from uploads
App.use("/uploads",express.static(path.join(__dirname,"uploads")))

App.use((err,req,res,next)=>{

    const statusCode = err.statusCode || 500
    const message = err.message || "Internal Server Error"
    res.status(res.statusCode).json
    ({
     success:false, 
     statusCode,
     message
    })
})