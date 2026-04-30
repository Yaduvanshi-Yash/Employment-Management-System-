import { clearStoredSession } from "../../utils/SessionStorage";

const Header = (props) => {
  const logOutUser = () => {
    clearStoredSession();
    props.changeUser("");
  };

  return (
    <div className="dashboard-hero panel-strong rounded-[28px] px-6 py-6 sm:px-8">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div className="relative z-10">
          <p className="text-sm uppercase tracking-[0.28em] text-blue-700/75">
            Dashboard overview
          </p>
          <h1 className="mt-3 text-3xl font-semibold text-slate-800 sm:text-4xl">
            Hello, {props.data ? props.data.firstName : "Admin"}
          </h1>
          <p className="mt-2 max-w-xl text-sm leading-6 text-slate-600 sm:text-base">
            {props.description ||
              "Stay on top of assignments, progress, and delivery without changing your existing workflow."}
          </p>
        </div>
        <div className="relative z-10 flex flex-col gap-3 sm:flex-row sm:items-center">
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
        <div className="relative z-10 mt-6 hidden flex-wrap gap-3 sm:flex">
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
        <div className="relative z-10 mt-6 grid gap-4 rounded-[22px] border border-blue-100 bg-white/82 px-5 py-4 lg:grid-cols-[1fr_auto] lg:items-center">
          <div>
            <p className="text-xs uppercase tracking-[0.18em] text-blue-700/70">
            Current section
            </p>
            <p className="mt-2 text-lg font-semibold text-slate-800">
              {props.activeSectionMeta.label}
            </p>
            <p className="mt-1 text-sm text-slate-600">
              {props.activeSectionMeta.description}
            </p>
          </div>
          <div className="rounded-[18px] border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
            Organized, color-coded, and easier to scan.
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default Header;
