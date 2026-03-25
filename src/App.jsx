import { useContext, useEffect, useState } from "react";
import Login from "./components/Auth/Login";
import AdminDashboard from "./components/Dashboard/AdminDashboard";
import EmployeeDashboard from "./components/Dashboard/EmployeeDashboard";
import { AuthContext } from "./context/AuthProvider";
import { getStoredSession, setStoredSession } from "./utils/SessionStorage";

const App = () => {
  const [user, setUser] = useState(null);
  const [loggedInUserData, setLoggedInUserData] = useState(null);
  const [authData] = useContext(AuthContext);

  useEffect(() => {
    const loggedInUser = getStoredSession();
    if (loggedInUser) {
      const userData = JSON.parse(loggedInUser);
      setUser(userData.role);
      setLoggedInUserData(userData.data || null);
      return;
    }

    setUser(null);
    setLoggedInUserData(null);
  }, [authData]);

  const handleLogin = (email, password, rememberMe) => {
    if (email === "admin@me.com" && password === "123") {
      setUser("admin");
      setLoggedInUserData(null);
      setStoredSession({ email, role: "admin" }, rememberMe);
    } else if (authData) {
      const employeeMatch = authData.find(
        (e) => e.email === email && e.password === password,
      );
      if (employeeMatch) {
        setUser("employee");
        setLoggedInUserData(employeeMatch);
        setStoredSession(
          { email, role: "employee", data: employeeMatch },
          rememberMe,
        );
        return;
      }
    }

    alert("Invalid credentials");
  };

  return (
    <>
      {/* If no user role is set, show login form */}
      {!user ? <Login handleLogin={handleLogin} /> : ""}

      {/*
        If user is admin, show admin dashboard; otherwise show employee dashboard.
        This decision is based on user role saved in state (`user`).
      */}
      {user === "admin" ? (
        <AdminDashboard changeUser={setUser} />
      ) : user === "employee" ? (
        <EmployeeDashboard changeUser={setUser} data={loggedInUserData} />
      ) : null}
    </>
  );
};

export default App;
