import React, { useState } from "react";

const Login = ({ handleLogin }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  const submitHandler = (e) => {
    e.preventDefault();
    handleLogin(email, password, rememberMe);
    setEmail("");
    setPassword("");
  };

  return (
    <div className="app-shell flex min-h-screen items-center justify-center">
      <div className="grid w-full max-w-6xl gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <section className="panel-strong hidden rounded-[32px] p-10 lg:flex lg:flex-col lg:justify-between">
          <div className="max-w-xl">
            <span className="status-pill bg-emerald-400/12 text-emerald-200">
              Workforce command center
            </span>
            <h1 className="mt-6 text-5xl font-semibold leading-tight text-white">
              Manage teams, tasks, and delivery without losing clarity.
            </h1>
            <p className="mt-5 max-w-lg text-base leading-7 text-slate-300">
              Your existing EMS theme is preserved, but the interface is now
              structured like a polished operations dashboard with cleaner
              spacing, stronger hierarchy, and calmer surfaces.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="panel rounded-3xl p-5">
              <p className="text-sm text-slate-400">Task visibility</p>
              <p className="mt-3 text-2xl font-semibold text-white">Live</p>
            </div>
            <div className="panel rounded-3xl p-5">
              <p className="text-sm text-slate-400">Status tracking</p>
              <p className="mt-3 text-2xl font-semibold text-white">Clear</p>
            </div>
            <div className="panel rounded-3xl p-5">
              <p className="text-sm text-slate-400">Team workflow</p>
              <p className="mt-3 text-2xl font-semibold text-white">Simple</p>
            </div>
          </div>
        </section>

        <div className="panel-strong mx-auto flex w-full max-w-md items-center justify-center rounded-[32px] p-4 sm:p-6">
        <form
          onSubmit={submitHandler}
          className="w-full rounded-[28px] border border-white/8 bg-black/20 p-6 sm:p-8"
        >
          <div className="mb-8">
            <p className="text-sm uppercase tracking-[0.32em] text-emerald-300/80">
              Employee Management System
            </p>
            <h2 className="mt-3 text-3xl font-semibold text-white">Sign in</h2>
            <p className="mt-2 text-sm leading-6 text-slate-400">
              Access your dashboard with the same credentials and workflow.
            </p>
          </div>

          <div className="space-y-5">
            <div>
              <label className="field-label" htmlFor="email">
                Email address
              </label>
          <input
                id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
                className="field-input"
            type="email"
                placeholder="Enter your email"
          />
            </div>

            <div>
              <label className="field-label" htmlFor="password">
                Password
              </label>
          <input
                id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
                className="field-input"
            type="password"
                placeholder="Enter your password"
          />
            </div>

            <label
              className="mt-1 flex items-center gap-3 text-sm text-emerald-100/90"
              htmlFor="rememberMe"
            >
            <input
                className="h-4 w-4 rounded accent-emerald-400"
              type="checkbox"
              id="rememberMe"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
            />
              <span>Remember me</span>
            </label>
          </div>

          <button
            type="submit"
            className="btn-primary mt-7 w-full"
          >
            Enter Dashboard
          </button>

          <p className="mt-5 text-center text-xs leading-5 text-slate-500">
            Admin and employee login flow stays unchanged. Only the interface is
            refined.
          </p>
        </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
