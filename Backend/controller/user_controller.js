import User from "../models/user_model.js"
import Task from "../models/task_model.js"  


export const getUsers= async(req,res,next)=>{
    try{
      const users = await User.find({role:"user"}).select("-password")

      const userWithTaskCount = await Promise.all(
        users.map(async(user)=>{
        const pendingTasks = await Task.countDocuments({
            assignedTo:user._id,
        status:"pending",
        })
        const inProgressTasks = await Task.countDocuments({
            assignedTo:user._id,
        status:"In Progress",
        })
        const completedTasks = await Task.countDocuments({
            assignedTo:user._id,
        status:"Completed",
        })
        return{
            ...user._doc,
            pendingTasks,
            inProgressTasks,
            completedTasks,
        }
    })
  )

   res.status(200).json(userWithTaskCount)
   }   catch(error){
      next(error);
    }
}


export const getUserById = async(req,res,next)=>{
    try{
        const user = await User.findById(req.params.id).select("-password")

        if(!user){
            return next(errorHandler(404,"User not found"));
        }   
        res.status(200).json(user)  
}catch(error){
    next(error);
}
}