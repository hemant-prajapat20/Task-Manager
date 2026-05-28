import excelJs from "exceljs";
import Task from "../models/task.model.js";
import User from "../models/user.model.js";
import catchAsync from "../utils/catchAsync.js";

/**
 * Exports a detailed Excel report of all tasks.
 */
export const exportTaskReport = catchAsync(async (req, res, next) => {
    const tasks = await Task.find().populate("assignedTo", "name email");

    const workbook = new excelJs.Workbook();
    const worksheet = workbook.addWorksheet("Tasks Report");

    worksheet.columns = [
        { header: "Task Id", key: "_id", width: 25 },
        { header: "Title", key: "title", width: 30 },
        { header: "Description", key: "description", width: 50 },
        { header: "Priority", key: "priority", width: 15 },
        { header: "Status", key: "status", width: 20 },
        { header: "Due Date", key: "dueDate", width: 20 },
        { header: "Assigned To", key: "assignedTo", width: 30 },
    ];

    tasks.forEach((task) => {
        const assignedToNames = task.assignedTo
            .map((user) => `${user.name} (${user.email})`)
            .join(", ");

        worksheet.addRow({
            _id: task._id.toString(),
            title: task.title,
            description: task.description,
            priority: task.priority,
            status: task.status,
            dueDate: task.dueDate ? task.dueDate.toISOString().split("T")[0] : "No Date",
            assignedTo: assignedToNames || "Unassigned",
        });
    });

    res.setHeader(
        "Content-Type",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader(
        "Content-Disposition",
        'attachment; filename="tasks_report.xlsx"'
    );

    await workbook.xlsx.write(res);
    res.end();
});

/**
 * Exports an Excel report summarizing task statistics per user.
 */
export const exportUsersReport = catchAsync(async (req, res, next) => {
    // 1) Fetch all users and tasks
    const [users, tasks] = await Promise.all([
        User.find().select("name email _id").lean(),
        Task.find().populate("assignedTo", "_id")
    ]);

    const userTaskMap = {};

    // 2) Initialize user statistics map
    users.forEach((user) => {
        userTaskMap[user._id.toString()] = {
            name: user.name,
            email: user.email,
            taskCount: 0,
            pendingTasks: 0,
            inProgressTasks: 0,
            completedTasks: 0,
        };
    });

    // 3) Aggregate task counts per user
    tasks.forEach((task) => {
        if (task.assignedTo && task.assignedTo.length > 0) {
            task.assignedTo.forEach((assignedUser) => {
                const userIdStr = assignedUser._id.toString();
                if (userTaskMap[userIdStr]) {
                    userTaskMap[userIdStr].taskCount += 1;

                    if (task.status === "Pending") {
                        userTaskMap[userIdStr].pendingTasks += 1;
                    } else if (task.status === "In Progress") {
                        userTaskMap[userIdStr].inProgressTasks += 1;
                    } else if (task.status === "Completed") {
                        userTaskMap[userIdStr].completedTasks += 1;
                    }
                }
            });
        }
    });

    // 4) Build Excel workbook
    const workbook = new excelJs.Workbook();
    const worksheet = workbook.addWorksheet("User Task Report");

    worksheet.columns = [
        { header: "User Name", key: "name", width: 30 },
        { header: "Email", key: "email", width: 40 },
        { header: "Total Assigned Tasks", key: "taskCount", width: 20 },
        { header: "Pending Tasks", key: "pendingTasks", width: 20 },
        { header: "In Progress Tasks", key: "inProgressTasks", width: 20 },
        { header: "Completed Tasks", key: "completedTasks", width: 20 },
    ];

    Object.values(userTaskMap).forEach((userData) => {
        worksheet.addRow(userData);
    });

    res.setHeader(
        "Content-Type",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader(
        "Content-Disposition",
        'attachment; filename="users_report.xlsx"'
    );

    await workbook.xlsx.write(res);
    res.end();
});
