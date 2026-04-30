import ActivityTimeline from "../Other/ActivityTimeline";
import EmployeeInsights from "../Other/EmployeeInsights";
import Header from "../Other/Header";
import TaskListNumber from "../Other/TaskListNumber";
import TaskList from "../TaskList/TaskList";
import { useState } from "react";

const employeeSections = [
  {
    id: "overview",
    label: "Overview",
    description: "Check your task numbers, growth score, and personal workload insights.",
  },
  {
    id: "board",
    label: "Task Board",
    description: "Work through assigned tasks without the rest of the dashboard getting in the way.",
  },
  {
    id: "activity",
    label: "Activity",
    description: "Review your latest status changes, completions, and feedback moments.",
  },
];

const EmployeeDashboard = (props) => {
  const currentEmployee = props.data;
  const [activeSection, setActiveSection] = useState("overview");

  if (!currentEmployee) {
    return (
      <main className="app-shell flex items-center justify-center" aria-label="Employee dashboard">
        <div className="panel rounded-[24px] px-6 py-5 text-slate-300">
          Loading your dashboard...
        </div>
      </main>
    );
  }

  const recentActivity = (currentEmployee.tasks || [])
    .flatMap((task) =>
      (task.activityLog || []).map((event) => ({
        ...event,
        taskTitle: task.taskTitle,
        employeeName: currentEmployee.firstName,
      })),
    )
    .sort((left, right) => new Date(right.createdAt) - new Date(left.createdAt))
    .slice(0, 8);

  const activeSectionMeta =
    employeeSections.find((section) => section.id === activeSection) || employeeSections[0];

  return (
    <main className="app-shell" aria-label="Employee dashboard">
      <div className="mx-auto max-w-7xl">
        <Header
          changeUser={props.changeUser}
          data={currentEmployee}
          sections={employeeSections}
          activeSection={activeSection}
          onSectionChange={setActiveSection}
          activeSectionMeta={activeSectionMeta}
        />

        {activeSection === "overview" ? (
          <>
            <TaskListNumber data={currentEmployee} />
            <EmployeeInsights data={currentEmployee} />
          </>
        ) : null}

        {activeSection === "board" ? (
          <TaskList
            data={currentEmployee}
            onEmployeeUpdate={props.onEmployeeUpdate}
          />
        ) : null}

        {activeSection === "activity" ? (
          <ActivityTimeline
            title="Recent activity"
            items={recentActivity}
          />
        ) : null}
      </div>
    </main>
  );
};

export default EmployeeDashboard;
