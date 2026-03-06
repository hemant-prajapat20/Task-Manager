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

export const updateTaskStatus = async(req,res,next)=>{
try{
 const task = await Task.findById(req.params.id)
 if(!task){
    return next(errorHandler(404,"Task not found"));
 }    
  const isAssigned = task.assignedTo.some((userId)=>userId.toString() === req.user.Id.toString());  
  
    if(!isAssigned && req.user.role !== "admin"){
        return next(errorHandler(403,"You are not authorized to update the status of this task"));
    }
    const {status} = req.body.status|| task.status;
     if(task.status === "Completed")
        { task.todoChecklist.forEach(item=>item.completed=true);
        }
        await task.save();
        res.status(200).json({message:"Task status updated successfully!", task})
}catch(error){
    next(error);
  }
}

export const updateTaskChecklist = async(req,res,next)=>{
    try{
        const task = await Task.findById(req.params.id) 
        if(!task){
            return next(errorHandler(404,"Task not found"));    
        }
         if(!task.assignedTo.includes(req.user.Id) && req.user.role !== "admin"){
            return next(errorHandler(403,"You are not authorized to update the checklist of this task"));
         }
         task.todoChecklist=todoChecklist;

          const completedCount = task.todoChecklist.filter(item=>item.completed).length;
           const totalItems = task.todoChecklist.length;
           task.progress = totalItems === 0 ? Math.round((completedCount/totalItems)*100) : 0;
         

           if(task.progress === 100){
           task.status = "Completed";
           }    
           else if(task.progress > 0){
            task.status = "In Progress";
           } else{
            task.status = "Pending";
           }

           await task.save();
           const updatedTask = await Task.findById(req.params.id).populate("assignedTo","name email profileImageUrl")
           res.status(200).json({message:"Task checklist updated successfully!", task:updatedTask})
        }

    catch(error){
      next(error);
    }}


    export const getDashboardData = async(req,res,next)=>{
      try{
       //fetch statistics 
        const totalTasks = await Task.countDocuments();
        const pendingTasks = await Task.countDocuments({status:"Pending"});
        const inProgressTasks = await Task.countDocuments({status:"In Progress"});
        const completedTasks = await Task.countDocuments({status:"Completed"}); 
        const overdueTasks = await Task.countDocuments({dueDate:{$lt:new Date()}, status:{$ne:"Completed"}
        });
     const taskStatuses=["Pending","In Progress","Completed"]
     const taskDistributionRaw=await Task.aggregate([
         {
         $group:{
          _id: "$status",
          count:{$sum:1},
        },
     }
     ])
    const taskDistribution = taskStatuses.reduce((acc, status)=>{
        const formattedKey = status.replace(/\s+/g, "")  //remove spaces for response keys
        acc[formattedKey] = taskDistributionRaw.find(item=>item._id === status)?.count || 0;
      return acc
    }, {}) 
     taskDistribution["All"] = totalTasks; //include total tasks in distribution

     const taskPriorities = ["Low","Medium","High"]
     const taskPriorityLevelRaw= await Task.aggregate([
    {
      $group:{
        _id:"$priority",
        count:{$sum:1},
      },
     },
     ])

     const taskPriorityLevel =taskPriorities.reduce((acc, priority)=>{  
        acc[priority] = taskPriorityLevelRaw.find((find)=>item._id === priority)?.count || 0;
        return acc
     }, {})

     //fetch recent 10 tasks
     const recentTask=await Task.find().sort({createdAt:-1}).limit(10).select("title status priority dueDate CreatedAt")

     res.status(200).json({
       statistics:{
            totalTasks,
            pendingTasks,
            inProgressTasks,
            completedTasks,
            overdueTasks,   
        },
      charts:{
        taskDistribution,
        taskPriorityLevel,
      }, 
       recentTask,
     })
  }catch(error){
      next(error);
       }
    }

export const userDashboardData = async(req,res,next)=>{
    try{
     const userId = req.user.Id;
     
     //convert userID to mongoose ObjectId for aggregation queries
     const userObjectId = new mongoose.Types.ObjectId(userId);

      //fetch statistics for user-specific tasks
      const totalTasks = await Task.countDocuments({assignedTo:userId});
      const pendingTasks = await Task.countDocuments({assignedTo:userId, status:"Pending"});
      const inProgressTasks = await Task.countDocuments({assignedTo:userId, status:"In Progress"});
      const completedTasks = await Task.countDocuments({assignedTo:userId, status:"Completed"}); 
      const overdueTasks = await Task.countDocuments({assignedTo:userId, status:{$ne:"Completed"},dueDate:{$lt:new Date()},
      });

      //task distribution by status for user
      const taskStatuses=["Pending","In Progress","Completed"]
      const taskDistributionRaw=await Task.aggregate([
        {
          $match:{assignedTo: userObjectId},
        },
      {
        $group:{
          _id:"$status",
          count:{$sum:1}
        },
       },
      ])

      const taskDistribution = taskStatuses.reduce((acc, status)=>{
        const formattedKey = status.replace(/\s+/g, "")  //remove spaces for response keys
        acc[formattedKey] = taskDistributionRaw.find(item=>item._id === status)?.count || 0;
        return acc;
      },{})

     taskDistribution["All"] = totalTasks; //include total tasks in distribution

     //task distribution by priority for user
     const taskPriorities = ["Low","Medium","High"]
     const taskPriorityLevelRaw= await Task.aggregate([
         {
           $match:{assignedTo: userObjectId},
         },
       {
         $group:{
           _id:"$priority",
           count:{$sum:1}
         },           
         },
     ])
     const taskPriorityLevel = taskPriorities.reduce((acc, priority)=>{
      acc[priority] = taskPriorityLevelRaw.find(item=>item._id === priority)?.count || 0;
      return acc;
     },{})

    //fetch recent 10 tasks for user
    const recentTask = await Task.find({assignedTo:userObjectId}).sort({createdAt:-1}).limit(10).select("title status priority dueDate createdAt")

    res.status(200).json({  
        statistics:{
          totalTasks,
          pendingTasks,
          inProgressTasks,
          completedTasks,
          overdueTasks,
        },
        charts:{
          taskDistribution,   
          taskPriorityLevel,
        },
        recentTask,
    })
    }catch(error){  
        next(error);
    }
}