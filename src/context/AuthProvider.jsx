import { useCallback, useState } from "react";
import { AuthContext } from "./AuthContext";
import { apiRequest } from "../utils/api";

const AuthProvider = ({ children }) => {
  const [employees, setEmployees] = useState([]);
  const [isEmployeesLoading, setIsEmployeesLoading] = useState(false);

  const refreshEmployees = useCallback(async (token) => {
    if (!token) {
      setEmployees([]);
      return [];
    }

    setIsEmployeesLoading(true);
    try {
      const response = await apiRequest("/employees", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setEmployees(response);
      return response;
    } finally {
      setIsEmployeesLoading(false);
    }
  }, []);

  const upsertEmployee = useCallback((employee) => {
    if (!employee) {
      return;
    }

    setEmployees((currentEmployees) => {
      const existingIndex = currentEmployees.findIndex(
        (currentEmployee) => currentEmployee.id === employee.id,
      );

      if (existingIndex === -1) {
        return [...currentEmployees, employee];
      }

      return currentEmployees.map((currentEmployee) =>
        currentEmployee.id === employee.id ? employee : currentEmployee,
      );
    });
  }, []);

  const clearEmployees = useCallback(() => {
    setEmployees([]);
  }, []);

  return (
    <div>
      <AuthContext.Provider
        value={{
          employees,
          setEmployees,
          refreshEmployees,
          upsertEmployee,
          clearEmployees,
          isEmployeesLoading,
        }}
      >
        {children}
      </AuthContext.Provider>
    </div>
  );
};

export default AuthProvider;
