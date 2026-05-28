import mongoose from "mongoose";
import Task from "../models/task.model.js";
import AppError from "../utils/appError.js";
import catchAsync from "../utils/catchAsync.js";

/**
 * Creates a new task.
 */
export const createTask = catchAsync(async (req, res, next) => {
    const { title, description, priority, assignedTo, attachements, todoChecklist } = req.body;

    if (!Array.isArray(assignedTo)) {
        return next(new AppError("assignedTo must be an array of user IDs", 400));
    }

    const task = await Task.create({
        title,
        description,
        priority,
        assignedTo,
        attachements,
        todoChecklist,
        createdBy: req.user.Id,
    });

    res.status(201).json({
        success: true,
        message: "Task created successfully",
        data: task
    });
});

/**
 * Retrieves tasks with optional status filtering.
 * Admins see all tasks, users see only their assigned tasks.
 */
export const getTasks = catchAsync(async (req, res, next) => {
    const { status } = req.query;

    let filter = {};
    if (status) {
        filter.status = status;
    }

    let query = Task.find(filter).populate("assignedTo", "name email profileImage");

    if (req.user.role !== "admin") {
        query = query.find({ assignedTo: req.user.Id });
    }

    let tasks = await query;

    // Add completed count to each task for UI progress bars
    tasks = tasks.map(task => {
        const completedCount = task.todoChecklist.filter(item => item.completed).length;
        return {
            ...task.toObject(),
            completedCount
        };
    });

    // Summary counts for dashboard metrics
    const userFilter = req.user.role === "admin" ? {} : { assignedTo: req.user.Id };
    
    const [allTasks, pendingTasks, inProgressTasks, completedTasks] = await Promise.all([
        Task.countDocuments(userFilter),
        Task.countDocuments({ ...userFilter, status: "Pending" }),
        Task.countDocuments({ ...userFilter, status: "In Progress" }),
        Task.countDocuments({ ...userFilter, status: "Completed" })
    ]);

    res.status(200).json({
        success: true,
        data: tasks,
        statusSummary: {
            all: allTasks,
            pendingTasks,
            inProgressTasks,
            completedTasks,
        },
    });
});

/**
 * Retrieves a single task by its ID.
 */
export const getTaskById = catchAsync(async (req, res, next) => {
    const task = await Task.findById(req.params.id)
        .populate("assignedTo", "name email profileImageUrl");

    if (!task) {
        return next(new AppError("Task not found", 404));
    }

    res.status(200).json({
        success: true,
        data: task
    });
});

/**
 * Updates task details.
 */
export const updateTask = catchAsync(async (req, res, next) => {
    const task = await Task.findById(req.params.id);
    if (!task) {
        return next(new AppError("Task not found", 404));
    }

    const fieldsToUpdate = ['title', 'description', 'priority', 'dueDate', 'attachements', 'todoChecklist'];
    fieldsToUpdate.forEach(field => {
        if (req.body[field] !== undefined) {
            task[field] = req.body[field];
        }
    });

    if (req.body.assignedTo) {
        if (!Array.isArray(req.body.assignedTo)) {
            return next(new AppError("assignedTo should be an array of user IDs", 400));
        }
        task.assignedTo = req.body.assignedTo;
    }

    const updatedTask = await task.save();

    res.status(200).json({
        success: true,
        data: updatedTask,
        message: "Task updated successfully!"
    });
});

/**
 * Deletes a task.
 */
export const deleteTask = catchAsync(async (req, res, next) => {
    const task = await Task.findById(req.params.id);
    if (!task) {
        return next(new AppError("Task not found", 404));
    }
    await task.deleteOne();
    
    res.status(200).json({
        success: true,
        message: "Task deleted successfully!"
    });
});

/**
 * Updates the status of a task.
 */
export const updateTaskStatus = catchAsync(async (req, res, next) => {
    const task = await Task.findById(req.params.id);
    if (!task) {
        return next(new AppError("Task not found", 404));
    }

    const isAssigned = task.assignedTo.some(userId => userId.toString() === req.user.Id.toString());
    if (!isAssigned && req.user.role !== "admin") {
        return next(new AppError("You are not authorized to update this task", 403));
    }

    task.status = req.body.status || task.status;
    
    if (task.status === "Completed") {
        task.todoChecklist.forEach(item => item.completed = true);
        task.progress = 100;
    }

    await task.save();
    
    res.status(200).json({
        success: true,
        message: "Task status updated successfully!",
        data: task
    });
});

/**
 * Updates the todo checklist and recalculates progress.
 */
export const updateTaskChecklist = catchAsync(async (req, res, next) => {
    const task = await Task.findById(req.params.id);
    if (!task) {
        return next(new AppError("Task not found", 404));
    }

    const isAssigned = task.assignedTo.some(userId => userId.toString() === req.user.Id.toString());
    if (!isAssigned && req.user.role !== "admin") {
        return next(new AppError("You are not authorized to update this task", 403));
    }

    const { todoChecklist } = req.body;
    if (todoChecklist) {
        task.todoChecklist = todoChecklist;
        
        const totalItems = task.todoChecklist.length;
        const completedCount = task.todoChecklist.filter(item => item.completed).length;
        
        task.progress = totalItems > 0 ? Math.round((completedCount / totalItems) * 100) : 0;

        // Automatically update status based on progress
        if (task.progress === 100) {
            task.status = "Completed";
        } else if (task.progress > 0) {
            task.status = "In Progress";
        } else {
            task.status = "Pending";
        }
    }

    await task.save();
    
    const updatedTask = await Task.findById(req.params.id)
        .populate("assignedTo", "name email profileImageUrl");

    res.status(200).json({
        success: true,
        message: "Task checklist updated successfully!",
        data: updatedTask
    });
});

/**
 * Common logic to aggregate dashboard statistics.
 */
const aggregateStats = async (filter = {}) => {
    const taskStatuses = ["Pending", "In Progress", "Completed"];
    const taskPriorities = ["Low", "Medium", "High"];

    const [totalTasks, overdueTasks, taskDistributionRaw, taskPriorityLevelRaw] = await Promise.all([
        Task.countDocuments(filter),
        Task.countDocuments({ ...filter, status: { $ne: "Completed" }, dueDate: { $lt: new Date() } }),
        Task.aggregate([
            { $match: filter },
            { $group: { _id: "$status", count: { $sum: 1 } } }
        ]),
        Task.aggregate([
            { $match: filter },
            { $group: { _id: "$priority", count: { $sum: 1 } } }
        ])
    ]);

    const taskDistribution = taskStatuses.reduce((acc, status) => {
        const key = status.replace(/\s+/g, "");
        acc[key] = taskDistributionRaw.find(item => item._id === status)?.count || 0;
        return acc;
    }, { All: totalTasks });

    const taskPriorityLevel = taskPriorities.reduce((acc, priority) => {
        acc[priority] = taskPriorityLevelRaw.find(item => item._id === priority.toLowerCase())?.count || 0;
        return acc;
    }, {});

    return { totalTasks, overdueTasks, taskDistribution, taskPriorityLevel };
};

/**
 * Admin Dashboard Data: overview across all tasks.
 */
export const getDashboardData = catchAsync(async (req, res, next) => {
    const stats = await aggregateStats();
    const recentTasks = await Task.find()
        .sort({ createdAt: -1 })
        .limit(10)
        .select("title status priority dueDate createdAt");

    res.status(200).json({
        success: true,
        statistics: {
            totalTasks: stats.totalTasks,
            pendingTasks: stats.taskDistribution.Pending,
            inProgressTasks: stats.taskDistribution.InProgress,
            completedTasks: stats.taskDistribution.Completed,
            overdueTasks: stats.overdueTasks,
        },
        charts: stats,
        recentTasks
    });
});

/**
 * User Dashboard Data: filtered for a specific user.
 */
export const userDashboardData = catchAsync(async (req, res, next) => {
    const userObjectId = new mongoose.Types.ObjectId(req.user.Id);
    const filter = { assignedTo: userObjectId };
    
    const stats = await aggregateStats(filter);
    const recentTasks = await Task.find(filter)
        .sort({ createdAt: -1 })
        .limit(10)
        .select("title status priority dueDate createdAt");

    res.status(200).json({
        success: true,
        stats: {
            totalTasks: stats.totalTasks,
            pendingTasks: stats.taskDistribution.Pending,
            inProgressTasks: stats.taskDistribution.InProgress,
            completedTasks: stats.taskDistribution.Completed,
            overdueTasks: stats.overdueTasks,
        },
        charts: stats,
        recentTasks
    });
});
