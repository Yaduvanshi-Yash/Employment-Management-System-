import { useContext } from "react";
import { AuthContext } from "../../context/AuthProvider";

const AllTask = () => {
  const [authData] = useContext(AuthContext);

  return (
    <div className="panel-strong mt-8 rounded-[28px] p-6 sm:p-8">
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.24em] text-emerald-300/80">
            Team status
          </p>
          <h2 className="mt-2 text-2xl font-semibold text-white">
            Employee task summary
          </h2>
        </div>
        <p className="text-sm text-slate-400">
          A cleaner view of workload distribution across the team.
        </p>
      </div>

      <div className="overflow-auto rounded-[24px] border border-white/8">
        <div className="grid min-w-[720px] grid-cols-5 gap-4 border-b border-white/8 bg-emerald-400/10 px-5 py-4 text-sm font-semibold uppercase tracking-[0.16em] text-emerald-100/90">
          <h2>Employee</h2>
          <h2>New</h2>
          <h2>Active</h2>
          <h2>Completed</h2>
          <h2>Failed</h2>
        </div>
        {authData.map((elem, index) => {
          return (
            <div
              className="grid min-w-[720px] grid-cols-5 gap-4 border-b border-white/6 bg-black/10 px-5 py-4 text-sm text-slate-200 last:border-b-0"
              key={index}
            >
              <h2 className="font-semibold text-white">{elem.firstName}</h2>
              <h2>{elem.taskNumbers.newTask}</h2>
              <h2>{elem.taskNumbers.active}</h2>
              <h2>{elem.taskNumbers.complete}</h2>
              <h2>{elem.taskNumbers.failed}</h2>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AllTask;
