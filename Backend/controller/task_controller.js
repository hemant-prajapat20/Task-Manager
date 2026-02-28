import mongoose from "mongoose";
import Task from "../models/task_model.js";
import { errorHandler } from "../utils/error.js";

export const createTask = async(req,res,next)=>{
    try{
         const {title, description,priority, assignedTo, attachements, todoChecklist}= req.body; 
         if(!Array.isArray(assignedTo)){
            return
         }
         const task = await Task.create({
            title,
            description,
            priority,
            assignedTo,
            attachements,
            todoChecklist,
            createdBy: req.user.Id,
         })
         res.status(201).json({message:"Task created successfully", task });
            
    }catch(error){
        next(error);
    }
}