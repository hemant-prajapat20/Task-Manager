import User from "../models/user.model.js";
import Task from "../models/task.model.js";
import AppError from "../utils/appError.js";
import catchAsync from "../utils/catchAsync.js";

/**
 * Retrieves a list of users with the "user" role, including counts for their tasks.
 * This function calculates task statistics for each user individually.
 */
export const getUsers = catchAsync(async (req, res, next) => {
    // 1) Find all users with the role 'user', and exclude their passwords for security
    const users = await User.find({ role: "user" }).select("-password");

    // 2) Loop through each user and count their tasks based on status
    // We use Promise.all to fetch the counts for all users concurrently (at the same time)
    const userWithTaskCounts = await Promise.all(
        users.map(async (user) => {
            
            // Count tasks that are still Pending
            const pendingTasks = await Task.countDocuments({
                assignedTo: user._id,
                status: "Pending", 
            });
            
            // Count tasks that are currently In Progress
            const inProgressTasks = await Task.countDocuments({
                assignedTo: user._id,
                status: "In Progress",
            });
            
            // Count tasks that have been Completed
            const completedTasks = await Task.countDocuments({
                assignedTo: user._id,
                status: "Completed",
            });

            // 3) Combine the user data with their calculated task counts
            return {
                ...user.toObject(),
                pendingTasks,
                inProgressTasks,
                completedTasks,
            };
        })
    );

    // 4) Send back the enriched user list to the frontend
    res.status(200).json({
        success: true,
        data: userWithTaskCounts
    });
});

/**
 * Retrieves a specific user by their ID.
 */
export const getUserById = catchAsync(async (req, res, next) => {
    const user = await User.findById(req.params.id).select("-password");

    if (!user) {
        return next(new AppError("User not found", 404));
    }

    res.status(200).json({
        success: true,
        data: user
    });
});

/**
 * Deletes a specific user by their ID.
 */
export const deleteUser = catchAsync(async (req, res, next) => {
    const user = await User.findById(req.params.id);

    if (!user) {
        return next(new AppError("User not found", 404));
    }

    await user.deleteOne();

    res.status(200).json({
        success: true,
        message: "User deleted successfully"
    });
});
