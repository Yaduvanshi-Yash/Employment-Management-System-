import { getLocalStorage, setLocalStorage } from "../utils/LocalStorage";
import React, { createContext, useEffect, useState } from "react";

// Create a React Context for authentication data
// This allows any component in the app to access user/employee data without prop drilling
export const AuthContext = createContext();

const normalizeTask = (task) => {
  if (task.complete) {
    return { ...task, active: false, newTask: false, failed: false, complete: true };
  }

  if (task.failed) {
    return { ...task, active: false, newTask: false, complete: false, failed: true };
  }

  if (task.active) {
    return { ...task, active: true, newTask: false, complete: false, failed: false };
  }

  return { ...task, active: false, newTask: true, complete: false, failed: false };
};

const normalizeEmployees = (employees = []) =>
  employees.map((employee) => {
    const tasks = (employee.tasks || []).map(normalizeTask);

    const taskNumbers = tasks.reduce(
      (counts, task) => {
        if (task.newTask) counts.newTask += 1;
        if (task.active) counts.active += 1;
        if (task.complete) counts.complete += 1;
        if (task.failed) counts.failed += 1;
        return counts;
      },
      { active: 0, newTask: 0, complete: 0, failed: 0 },
    );

    return {
      ...employee,
      tasks,
      taskNumbers,
    };
  });

const AuthProvider = ({ children }) => {
  // State to hold the authentication data (employees and admin info)
  // Initially null, will be populated from localStorage on component mount
  const [user, setUser] = useState([]);

  useEffect(() => {
    // Initialize localStorage with default employee and admin data
    // This ensures that sample data exists for login functionality
    // setLocalStorage() creates default employees and admin if they don't exist
    setLocalStorage();

    // Retrieve the stored data from localStorage
    // getLocalStorage() returns an object with { employees: [...], admin: {...} }
    const { employees } = getLocalStorage();
    const normalizedEmployees = normalizeEmployees(employees || []);

    localStorage.setItem("employees", JSON.stringify(normalizedEmployees));

    // Update the state with the retrieved data
    // This makes the data available to all child components via AuthContext
    setUser(normalizedEmployees);
  }, []); // Empty dependency array means this runs only once on component mount

  return (
    <div>
      {/* AuthContext.Provider makes the 'user' state available to all child components */}
      {/* Any component can access this data using: const authData = useContext(AuthContext) */}
      <AuthContext.Provider value={[user, setUser]}>
        {children}
      </AuthContext.Provider>
    </div>
  );
};

export default AuthProvider;
