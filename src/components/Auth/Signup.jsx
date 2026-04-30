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
        <div className="panel-strong mx-auto flex w-full max-w-md items-center justify-center rounded-[32px] p-4 sm:p-6">
          <form
            onSubmit={submitHandler}
            className="w-full rounded-[28px] border border-amber-100/70 bg-white/80 p-6 sm:p-8"
          >
            <div className="mb-8">
              <p className="text-sm uppercase tracking-[0.32em] text-teal-700/80">
                Employee Management System
              </p>
              <h2 className="mt-3 text-3xl font-semibold text-slate-800">Create Account</h2>
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
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-primary mt-7 w-full"
            >
              {isSubmitting ? "Creating Account..." : "Create Account"}
            </button>
          </form>
        </div>
    </div>
  );
};

export default Signup;
