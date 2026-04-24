import { clearStoredSession } from "../../utils/SessionStorage";

const Header = (props) => {
  const logOutUser = () => {
    clearStoredSession();
    props.changeUser("");
  };

  return (
    <div className="panel-strong rounded-[28px] px-6 py-6 sm:px-8">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.28em] text-blue-300/80">
            Dashboard overview
          </p>
          <h1 className="mt-3 text-3xl font-semibold text-white sm:text-4xl">
            Hello, {props.data ? props.data.firstName : "Admin"}
          </h1>
          <p className="mt-2 max-w-xl text-sm leading-6 text-slate-400 sm:text-base">
            {props.description ||
              "Stay on top of assignments, progress, and delivery without changing your existing workflow."}
          </p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          {props.sections?.length ? (
            <div className="w-full sm:hidden">
              <label className="field-label" htmlFor="dashboard-section">
                Navigate dashboard
              </label>
              <select
                id="dashboard-section"
                value={props.activeSection}
                onChange={(event) => props.onSectionChange?.(event.target.value)}
                className="field-input"
              >
                {props.sections.map((section) => (
                  <option key={section.id} value={section.id}>
                    {section.label}
                  </option>
                ))}
              </select>
            </div>
          ) : null}
          <button
            onClick={logOutUser}
            className="btn-danger whitespace-nowrap px-5"
          >
            Log Out
          </button>
        </div>
      </div>

      {props.sections?.length ? (
        <div className="mt-6 hidden flex-wrap gap-3 sm:flex">
          {props.sections.map((section) => {
            const isActive = props.activeSection === section.id;

            return (
              <button
                key={section.id}
                type="button"
                onClick={() => props.onSectionChange?.(section.id)}
                className={isActive ? "btn-primary" : "btn-secondary"}
              >
                {section.label}
              </button>
            );
          })}
        </div>
      ) : null}

      {props.activeSectionMeta ? (
        <div className="mt-6 rounded-[22px] border border-white/8 bg-white/4 px-5 py-4">
          <p className="text-xs uppercase tracking-[0.18em] text-slate-500">
            Current section
          </p>
          <p className="mt-2 text-lg font-semibold text-white">
            {props.activeSectionMeta.label}
          </p>
          <p className="mt-1 text-sm text-slate-400">
            {props.activeSectionMeta.description}
          </p>
        </div>
      ) : null}
    </div>
  );
};

export default Header;
