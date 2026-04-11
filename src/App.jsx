import { useContext, useEffect, useState } from "react";
import Login from "./components/Auth/Login";
import AdminDashboard from "./components/Dashboard/AdminDashboard";
import EmployeeDashboard from "./components/Dashboard/EmployeeDashboard";
import { AuthContext } from "./context/AuthContext";
import {
  clearStoredSession,
  getStoredSession,
  getStoredToken,
  isPersistentSession,
  setStoredSession,
} from "./utils/SessionStorage";
import { apiRequest } from "./utils/api";

const getInitialSession = () => {
  const loggedInUser = getStoredSession();

  if (!loggedInUser) {
    return { role: null, data: null, token: null };
  }

  try {
    const userData = JSON.parse(loggedInUser);
    return {
      role: userData.role,
      data: userData.data || null,
      token: userData.token || null,
    };
  } catch {
    return { role: null, data: null, token: null };
  }
};

const App = () => {
  // Read the saved session once during startup instead of setting state inside an effect.
  const [session, setSession] = useState(getInitialSession);
  const [isBootstrapping, setIsBootstrapping] = useState(Boolean(getStoredToken()));
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loginError, setLoginError] = useState("");
  const { refreshEmployees, clearEmployees } = useContext(AuthContext);

  useEffect(() => {
    // Keep the browser title aligned with the active dashboard for basic SEO and UX.
    const titleByRole = {
      admin: "Admin Dashboard | Employee Management System",
      employee: "Employee Dashboard | Employee Management System",
    };

    document.title =
      titleByRole[session.role] || "Employee Management System | EMS Dashboard";
  }, [session.role]);

  useEffect(() => {
    const token = getStoredToken();

    if (!token) {
      setIsBootstrapping(false);
      return;
    }

    const hydrateSession = async () => {
      try {
        const response = await apiRequest("/auth/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const nextSession = {
          token,
          email: response.user.email,
          role: response.user.role,
          data: response.employee || null,
        };

        if (response.user.role === "admin") {
          await refreshEmployees(token);
        } else {
          clearEmployees();
        }

        setSession(nextSession);
        setStoredSession(nextSession, isPersistentSession());
      } catch {
        clearStoredSession();
        clearEmployees();
        setSession({ role: null, data: null, token: null });
      } finally {
        setIsBootstrapping(false);
      }
    };

    hydrateSession();
  }, [clearEmployees, refreshEmployees]);

  const handleLogin = async (email, password, rememberMe) => {
    setIsSubmitting(true);
    setLoginError("");

    try {
      const response = await apiRequest("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });

      const nextSession = {
        token: response.token,
        email: response.user.email,
        role: response.user.role,
        data: response.employee || null,
      };

      if (response.user.role === "admin") {
        await refreshEmployees(response.token);
      } else {
        clearEmployees();
      }

      setSession(nextSession);
      setStoredSession(nextSession, rememberMe);
      return true;
    } catch (error) {
      setLoginError(error.message || "Unable to sign in.");
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isBootstrapping) {
    return (
      <div className="app-shell flex min-h-screen items-center justify-center text-slate-300">
        Restoring your secure session...
      </div>
    );
  }

  return (
    <>
      {!session.role ? (
        <Login
          handleLogin={handleLogin}
          loginError={loginError}
          isSubmitting={isSubmitting}
        />
      ) : ""}

      {session.role === "admin" ? (
        <AdminDashboard
          changeUser={(role) => {
            clearEmployees();
            setSession({ role: role || null, data: null, token: null });
          }}
        />
      ) : session.role === "employee" ? (
        <EmployeeDashboard
          changeUser={(role) => {
            clearEmployees();
            setSession({ role: role || null, data: null, token: null });
          }}
          data={session.data}
          onEmployeeUpdate={(employee) =>
            setSession((currentSession) => ({
              ...currentSession,
              data: employee,
            }))
          }
        />
      ) : null}
    </>
  );
};

export default App;
