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

export const getTasks = async(req,res,next)=>{
  try{
      const {status}= req.query;

      let filter = {};
        if(status){
            filter.status = status;
        }
       let tasks;
         if(req.user.role === "admin"){
            tasks = await Task.find(filter).populate("assignedTo","name email profileImage")

         }else{
            tasks = await Task.find({
                ...filter,
                assignedTo:req.user.Id,
            }).populate("assignedTo","name email profileImage")
         }
         tasks=await Promise.all(
            tasks.map(async(task)=>{
               const completedCount = task.todoChecklist.filter(item=>item.completed).length;
                
               return{
                ...task._doc, completedCount:completedCount}
            })
         )

      //status summary count

      const allTasks= await Task.countDocuments(
        req.user.role === "admin" ? {} : {assignedTo:req.user.Id}
      )

       const pendingTasks= await Task.countDocuments({
        ...filter,
        status:"Pending",
        ...(req.user.role !== "admin" && {assignedTo: req.user.Id}),
       })

       const inProgressTasks= await Task.countDocuments({
        ...filter,
        status:"In Progress",
        ...(req.user.role !== "admin" && {assignedTo:req.user.Id}),
       })

       const completedTasks= await Task.countDocuments({
        ...filter,
        status:"Completed",
        ...(req.user.role !== "admin" && {assignedTo:req.user.Id}),
       })

     res.status(200).json({
        tasks,
        statusSummary:{
        all:allTasks,
        pendingTasks,
        inProgressTasks,
        completedTasks,
        },
        })
  }catch(error){
    next(error);
  }
}

export const getTaskById = async(req,res,next)=>{

    try{
        const task = await Task.findById(req.params.id).populate("assignedTo","name email profileImageUrl")
    
        if(!task){
            return next(errorHandler(404,"Task not found"));
        }
        res.status(200).json(task)
    }
    catch(error){
        next(error);
    }
}

export const updateTask = async(req,res,next)=>{
    try{
        const task = await Task.findById(req.params.id)
    if(!task){
        return next(errorHandler(404,"Task not found"));
    }
    task.title = req.body.title || task.title;
    task.description = req.body.description || task.description;
    task.priority = req.body.priority || task.priority;
    task.dueDate = req.body.dueDate || task.dueDate;
    task.attachements = req.body.attachements || task.attachements;
    task.todoChecklist = req.body.todoChecklist || task.todoChecklist;
   
    if(req.body.assignedTo){
        if(!Array.isArray(req.body.assignedTo)){
            return next(errorHandler(400,"assignedTo should be an array of user IDs"));
        }
        task.assignedTo = req.body.assignedTo;  
    }
    const updatedTask = await task.save();

    return res.status(200).json({success:true,updatedTask, message:"Task updated successfully!"})
}
    catch(error){
    next(error);
       }
       };


 export const deleteTask = async(req,res,next)=>{
    try{
        const task = await Task.findById(req.params.id) 
        if(!task){
            return next(errorHandler(404,"Task not found"));    
        }
        await task.deleteOne();
        res.status(200).json({message:"Task deleted successfully!"})
        
    }catch(error){
        next(error);
    }      
}