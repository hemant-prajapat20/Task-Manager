import mongoose from "mongoose";

const todoSchema = new mongoose.Schema({
    text:{
        type:String,
        required:true,
    },
    completed:{
        type:Boolean,
        default:false,
    }
})

const taskSchema = new mongoose.Schema(
    {
        title:{
           type:String, 
           required:true 
        },
        description:{
            type:String,
        },

        priority:{
            type:String,
            enum:["low","medium","high"],
            default:"low",
        },
        status:{
            type:String,
            enum:["pending","in-progress","completed"],
            default:"pending",
        },          
      dueDate:{
        type:Date,
      },

      assignedTo:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        },  
    ],
    createdBy:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
      },
    ],
    attachements:[{
        type:String,
    }],

    todoChecklist:[todoSchema],
    
    progress:{
        type:Number,
        default:0,
    },
},
    {
       timestamps:true,
    }
)
const Task= mongoose.model("Task", taskSchema);

export default Task;


