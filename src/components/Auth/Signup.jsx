import React, { useState } from "react";

const Signup = ({ handleSignup, signupError, isSubmitting }) => {
  const [firstName, setFirstName] = useState("");
  const [personalEmail, setPersonalEmail] = useState("");
  const [password, setPassword] = useState("");
  const [companyCode, setCompanyCode] = useState("");

  const submitHandler = async (e) => {
    e.preventDefault();
    const signedUp = await handleSignup(firstName, personalEmail, password, companyCode);

    if (signedUp) {
      setFirstName("");
      setPersonalEmail("");
      setPassword("");
      setCompanyCode("");
    }
  };

  return (
    <div className="app-shell flex min-h-screen items-center justify-center">
      <div className="grid w-full max-w-6xl gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <section className="panel-strong hidden rounded-[32px] p-10 lg:flex lg:flex-col lg:justify-between">
          <div className="max-w-xl">
            <span className="status-pill bg-sky-400/12 text-sky-200">
              Create your account
            </span>
            <h1 className="mt-6 text-5xl font-semibold leading-tight text-white">
              Join our workforce management platform.
            </h1>
            <p className="mt-5 max-w-lg text-base leading-7 text-slate-300">
              Your role is automatically assigned based on your company code.
              We will send your generated work email to your inbox, but your password stays private and is never emailed.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="panel rounded-3xl p-5">
              <p className="text-sm text-slate-400">Auto assigned</p>
              <p className="mt-3 text-2xl font-semibold text-white">Role</p>
            </div>
            <div className="panel rounded-3xl p-5">
              <p className="text-sm text-slate-400">Email sent to</p>
              <p className="mt-3 text-2xl font-semibold text-white">Inbox</p>
            </div>
            <div className="panel rounded-3xl p-5">
              <p className="text-sm text-slate-400">Setup time</p>
              <p className="mt-3 text-2xl font-semibold text-white">Instant</p>
            </div>
          </div>
        </section>

        <div className="panel-strong mx-auto flex w-full max-w-md items-center justify-center rounded-[32px] p-4 sm:p-6">
          <form
            onSubmit={submitHandler}
            className="w-full rounded-[28px] border border-white/8 bg-black/20 p-6 sm:p-8"
          >
            <div className="mb-8">
              <p className="text-sm uppercase tracking-[0.32em] text-sky-300/80">
                Employee Management System
              </p>
              <h2 className="mt-3 text-3xl font-semibold text-white">Create Account</h2>
              <p className="mt-2 text-sm leading-6 text-slate-400">
                Register with your company code. Your role will be auto-assigned.
              </p>
            </div>

            {signupError ? (
              <p className="mb-5 rounded-2xl border border-rose-400/20 bg-rose-400/10 px-4 py-3 text-sm text-rose-100">
                {signupError}
              </p>
            ) : null}

            <div className="space-y-5">
              <div>
                <label className="field-label" htmlFor="firstName">
                  Full Name
                </label>
                <input
                  id="firstName"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                  className="field-input"
                  type="text"
                  placeholder="Enter your full name"
                />
                <p className="mt-2 text-xs text-slate-400">
                  Your work email will be: <span className="font-mono text-sky-300">{firstName.toLowerCase()}@[role].com</span>
                </p>
              </div>

              <div>
                <label className="field-label" htmlFor="personalEmail">
                  Personal Email (for credentials)
                </label>
                <input
                  id="personalEmail"
                  value={personalEmail}
                  onChange={(e) => setPersonalEmail(e.target.value)}
                  required
                  className="field-input"
                  type="email"
                  placeholder="your.email@example.com"
                />
                <p className="mt-2 text-xs text-slate-400">
                  We will send your generated work email here.
                </p>
              </div>

              <div>
                <label className="field-label" htmlFor="companyCode">
                  Company Code (4-digit)
                </label>
                <input
                  id="companyCode"
                  value={companyCode}
                  onChange={(e) => setCompanyCode(e.target.value)}
                  required
                  className="field-input"
                  type="text"
                  placeholder="Enter 4-digit code"
                  maxLength="4"
                />
                <p className="mt-2 text-xs text-slate-400">
                  Your code determines your role (Admin or Employee).
                </p>
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
                  placeholder="Use at least 8 characters"
                />
                <p className="mt-2 text-xs text-slate-400">
                  This password is stored securely and will not be sent by email.
                </p>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-primary mt-7 w-full"
            >
              {isSubmitting ? "Creating Account..." : "Create Account"}
            </button>

            <p className="mt-5 text-center text-xs leading-5 text-slate-500">
              Your work email will be auto-generated and emailed to you after signup.
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Signup;
