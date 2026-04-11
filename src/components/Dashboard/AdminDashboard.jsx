import AllTask from "../Other/AllTask";
import CreateTask from "../Other/CreateTask";
import Header from "../Other/Header";

const AdminDashboard = (props) => {
  return (
    <main className="app-shell w-full" aria-label="Admin dashboard">
      <div className="mx-auto max-w-7xl">
        <Header changeUser={props.changeUser} />
        <CreateTask />
        <AllTask />
      </div>
    </main>
  );
};

export default AdminDashboard;
