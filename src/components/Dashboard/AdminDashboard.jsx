import AllTask from "../Other/AllTask";
import CreateTask from "../Other/CreateTask";
import Header from "../Other/Header";

const AdminDashboard = (props) => {
  return (
    <div className="app-shell w-full">
      <div className="mx-auto max-w-7xl">
        <Header changeUser={props.changeUser} />
      <CreateTask />
        <AllTask />
      </div>
    </div>
  );
};

export default AdminDashboard;
