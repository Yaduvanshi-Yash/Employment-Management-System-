import { useEffect, useState } from "react";
import { getStoredToken } from "../../utils/SessionStorage";
import { apiRequest } from "../../utils/api";
import AllTask from "../Other/AllTask";
import AdminAnalytics from "../Other/AdminAnalytics";
import ActivityTimeline from "../Other/ActivityTimeline";
import CreateTask from "../Other/CreateTask";
import Header from "../Other/Header";
import TaskCalendarView from "../Other/TaskCalendarView";

const ANALYTICS_REFRESH_INTERVAL_MS = 30000;

const adminSections = [
  {
    id: "overview",
    label: "Overview",
    description: "See team metrics, workload health, and overall performance snapshots.",
  },
  {
    id: "planning",
    label: "Planning",
    description: "Review the calendar and assign new work from one focused workspace.",
  },
  {
    id: "reviews",
    label: "Tasks & Reviews",
    description: "Search, filter, export, and review the team task pipeline.",
  },
  {
    id: "activity",
    label: "Activity",
    description: "Track the latest assignments, completions, and review actions.",
  },
];

const AdminDashboard = (props) => {
  const [analytics, setAnalytics] = useState(null);
  const [isAnalyticsLoading, setIsAnalyticsLoading] = useState(true);
  const [activeSection, setActiveSection] = useState("overview");

  const refreshAnalytics = async ({ silent = false } = {}) => {
    const token = getStoredToken();
    if (!token) {
      setAnalytics(null);
      setIsAnalyticsLoading(false);
      return;
    }

    if (!silent) {
      setIsAnalyticsLoading(true);
    }
    try {
      const response = await apiRequest("/analytics/admin", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setAnalytics(response);
    } catch {
      setAnalytics(null);
    } finally {
      setIsAnalyticsLoading(false);
    }
  };

  useEffect(() => {
    refreshAnalytics();
  }, []);

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      refreshAnalytics({ silent: true });
    }, ANALYTICS_REFRESH_INTERVAL_MS);

    return () => {
      window.clearInterval(intervalId);
    };
  }, []);

  const activeSectionMeta =
    adminSections.find((section) => section.id === activeSection) || adminSections[0];

  return (
    <main className="app-shell w-full" aria-label="Admin dashboard">
      <div className="mx-auto max-w-7xl">
        <Header
          changeUser={props.changeUser}
          sections={adminSections}
          activeSection={activeSection}
          onSectionChange={setActiveSection}
          activeSectionMeta={activeSectionMeta}
        />

        {activeSection === "overview" ? (
          <AdminAnalytics analytics={analytics} isLoading={isAnalyticsLoading} />
        ) : null}

        {activeSection === "planning" ? (
          <>
            <TaskCalendarView tasks={analytics?.calendarTasks || []} />
            <CreateTask onTaskCreated={refreshAnalytics} />
          </>
        ) : null}

        {activeSection === "reviews" ? (
          <AllTask onTaskReviewed={refreshAnalytics} />
        ) : null}

        {activeSection === "activity" ? (
          <ActivityTimeline
            title="Recent activity"
            items={analytics?.recentActivity || []}
          />
        ) : null}
      </div>
    </main>
  );
};

export default AdminDashboard;
