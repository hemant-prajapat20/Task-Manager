import mongoose from "mongoose";

/**
 * Todo Schema for individual items within a task's checklist.
 */
const todoSchema = new mongoose.Schema({
    text: {
        type: String,
        required: [true, "Todo text is required"],
        trim: true
    },
    completed: {
        type: Boolean,
        default: false
    }
});

/**
 * Task Schema defining the structure of task documents.
 * Includes title, description, priority, status, and assignments.
 */
const taskSchema = new mongoose.Schema({
    title: {
        type: String, 
        required: [true, "Task title is required"],
        trim: true
    },
    description: {
        type: String,
        trim: true
    },
    priority: {
        type: String,
        enum: ["low", "medium", "high"],
        default: "low",
    },
    status: {
        type: String,
        enum: ["Pending", "In Progress", "Completed"],
        default: "Pending",
    },
    dueDate: {
        type: Date,
    },
    assignedTo: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    }],
    createdBy: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    }],
    attachements: [{
        type: String,
    }],
    todoChecklist: [todoSchema],
    progress: {
        type: Number,
        default: 0,
        min: 0,
        max: 100
    },
}, {
    timestamps: true,
});

// Indexing title and status for faster searching and filtering
taskSchema.index({ title: 1, status: 1 });

const Task = mongoose.model("Task", taskSchema);

export default Task;
