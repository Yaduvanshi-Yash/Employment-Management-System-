import { useContext } from "react";
import Header from "../Other/Header";
import TaskListNumber from "../Other/TaskListNumber";
import TaskList from "../TaskList/TaskList";
import { AuthContext } from "../../context/AuthProvider";
import { getStoredSession } from "../../utils/SessionStorage";

const EmployeeDashboard = (props) => {
  const [authData] = useContext(AuthContext);
  const storedSession = getStoredSession();
  const loggedInUser = storedSession ? JSON.parse(storedSession) : null;
  const currentEmployee =
    authData.find((employee) => employee.email === loggedInUser?.email) ||
    props.data;

  return (
    <div className="app-shell">
      <div className="mx-auto max-w-7xl">
        <Header changeUser={props.changeUser} data={currentEmployee} />
        <TaskListNumber data={currentEmployee} />
        <TaskList data={currentEmployee} />
      </div>
    </div>
  );
};

export default EmployeeDashboard;
