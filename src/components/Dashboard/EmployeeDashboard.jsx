import Header from "../Other/Header";
import TaskListNumber from "../Other/TaskListNumber";
import TaskList from "../TaskList/TaskList";

const EmployeeDashboard = (props) => {
  const currentEmployee = props.data;

  if (!currentEmployee) {
    return (
      <main className="app-shell flex items-center justify-center" aria-label="Employee dashboard">
        <div className="panel rounded-[24px] px-6 py-5 text-slate-300">
          Loading your dashboard...
        </div>
      </main>
    );
  }

  return (
    <main className="app-shell" aria-label="Employee dashboard">
      <div className="mx-auto max-w-7xl">
        <Header changeUser={props.changeUser} data={currentEmployee} />
        <TaskListNumber data={currentEmployee} />
        <TaskList
          data={currentEmployee}
          onEmployeeUpdate={props.onEmployeeUpdate}
        />
      </div>
    </main>
  );
};

export default EmployeeDashboard;
