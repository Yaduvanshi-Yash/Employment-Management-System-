export const statusToFlags = (status) => ({
  active: status === "active",
  newTask: status === "new",
  complete: status === "complete",
  failed: status === "failed",
});

export const buildTaskNumbers = (tasks = []) =>
  tasks.reduce(
    (counts, task) => {
      counts[task.status] += 1;
      return counts;
    },
    { new: 0, active: 0, complete: 0, failed: 0 },
  );

export const shapeTaskForFrontend = (task) => ({
  id: task._id?.toString?.() || task.id,
  taskTitle: task.taskTitle,
  taskDescription: task.taskDescription,
  taskDate:
    task.taskDate instanceof Date
      ? task.taskDate.toISOString().slice(0, 10)
      : task.taskDate,
  category: task.category,
  status: task.status,
  ...statusToFlags(task.status),
});

export const shapeEmployeeWithTasks = (user, tasks = []) => {
  const taskNumbers = buildTaskNumbers(tasks);

  return {
    id: user._id?.toString?.() || user.id,
    firstName: user.firstName,
    lastName: user.lastName || "",
    email: user.email,
    role: user.role,
    taskNumbers: {
      newTask: taskNumbers.new,
      active: taskNumbers.active,
      complete: taskNumbers.complete,
      failed: taskNumbers.failed,
    },
    tasks: tasks.map(shapeTaskForFrontend),
  };
};
