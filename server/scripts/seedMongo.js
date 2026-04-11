import "dotenv/config";
import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import { connectDatabase } from "../config/connectDatabase.js";
import { seedData } from "../data/seedData.js";
import { Task } from "../models/Task.js";
import { User } from "../models/User.js";

const getTaskStatus = (task) => {
  if (task.complete) {
    return "complete";
  }

  if (task.failed) {
    return "failed";
  }

  if (task.active) {
    return "active";
  }

  return "new";
};

const seedMongo = async () => {
  const connected = await connectDatabase();

  if (!connected) {
    throw new Error("MONGODB_URI is required to seed MongoDB.");
  }

  await Task.deleteMany({});
  await User.deleteMany({});

  const allUsers = [...seedData.admin, ...seedData.employees];
  const userIdMap = new Map();

  for (const user of allUsers) {
    const createdUser = await User.create({
      firstName: user.firstName,
      email: user.email,
      passwordHash: await bcrypt.hash(user.password, 10),
      role: user.role,
    });

    userIdMap.set(user.email, createdUser._id);
  }

  const adminId = userIdMap.get(seedData.admin[0].email);

  const tasksToInsert = seedData.employees.flatMap((employee) =>
    employee.tasks.map((task) => {
      const status = getTaskStatus(task);

      return {
        taskTitle: task.taskTitle,
        taskDescription: task.taskDescription,
        taskDate: new Date(task.taskDate),
        category: task.category,
        status,
        assignedTo: userIdMap.get(employee.email),
        createdBy: adminId,
        completedAt: status === "complete" ? new Date(task.taskDate) : null,
      };
    }),
  );

  await Task.insertMany(tasksToInsert);

  console.log("MongoDB seed completed successfully.");
  await mongoose.disconnect();
};

seedMongo().catch(async (error) => {
  console.error(error);
  await mongoose.disconnect();
  process.exit(1);
});
