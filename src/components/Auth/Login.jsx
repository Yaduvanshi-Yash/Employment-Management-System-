import React, { useState } from "react";

const Login = ({ handleLogin, loginError, isSubmitting }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  const submitHandler = async (e) => {
    e.preventDefault();
    const loggedIn = await handleLogin(email, password, rememberMe);

    if (loggedIn) {
      setEmail("");
      setPassword("");
    }
  };

  return (
    <div className="app-shell flex min-h-screen items-center justify-center">
      <div className="panel-strong mx-auto flex w-full max-w-md items-center justify-center rounded-[32px] p-4 sm:p-6">
        <form
          onSubmit={submitHandler}
          className="w-full rounded-[28px] border border-amber-100/70 bg-white/80 p-6 sm:p-8"
        >
          <div className="mb-8">
            <p className="text-sm uppercase tracking-[0.32em] text-amber-700/80">
              Employee Management System
            </p>
            <h2 className="mt-3 text-3xl font-semibold text-slate-800">Sign in</h2>
          </div>

          {loginError ? (
            <p className="mb-5 rounded-2xl border border-rose-400/20 bg-rose-400/10 px-4 py-3 text-sm text-rose-100">
              {loginError}
            </p>
          ) : null}

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
              className="mt-1 flex items-center gap-3 text-sm text-slate-600"
              htmlFor="rememberMe"
            >
            <input
                className="h-4 w-4 rounded accent-amber-600"
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
            disabled={isSubmitting}
            className="btn-primary mt-7 w-full"
          >
            {isSubmitting ? "Signing in..." : "Enter Dashboard"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
