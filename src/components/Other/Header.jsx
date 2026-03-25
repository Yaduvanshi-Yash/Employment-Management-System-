import { clearStoredSession } from "../../utils/SessionStorage";

const Header = (props) => {
  const logOutUser = () => {
    clearStoredSession();
    props.changeUser("");
  };

  return (
    <div className="panel-strong flex flex-col gap-6 rounded-[28px] px-6 py-6 sm:flex-row sm:items-end sm:justify-between sm:px-8">
      <div>
        <p className="text-sm uppercase tracking-[0.28em] text-emerald-300/80">
          Dashboard overview
        </p>
        <h1 className="mt-3 text-3xl font-semibold text-white sm:text-4xl">
          Hello, {props.data ? props.data.firstName : "Admin"}
        </h1>
        <p className="mt-2 max-w-xl text-sm leading-6 text-slate-400 sm:text-base">
          Stay on top of assignments, progress, and delivery without changing
          your existing workflow.
        </p>
      </div>
      <button
        onClick={logOutUser}
        className="btn-danger whitespace-nowrap px-5"
      >
        Log Out
      </button>
    </div>
  );
};

export default Header;
