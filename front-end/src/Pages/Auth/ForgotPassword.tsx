import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa6";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 flex items-center justify-center px-4 py-10 transition-colors duration-200">
      <div className="w-full max-w-md">
        <div className="text-center mb-6">
          <div className="text-sm uppercase tracking-[0.35em] text-slate-400 dark:text-slate-500">Relay</div>
          <h1 className="text-2xl font-semibold mt-2">Reset your password</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">We’ll send a reset link to your email.</p>
        </div>

        <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-6 shadow-sm transition-colors duration-200">
          <label className="text-sm">
            <span className="text-slate-500 dark:text-slate-400">Email</span>
            <input
              className="mt-1 w-full rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 px-3 py-2 text-sm outline-none focus:border-slate-400 dark:focus:border-slate-500 text-slate-900 dark:text-slate-100 transition-colors duration-200"
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@email.com"
            />
          </label>

          <button className="mt-5 w-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 py-2.5 rounded-lg text-sm font-medium hover:bg-slate-800 dark:hover:bg-slate-100 transition">
            Send reset link
          </button>
        </div>

        <div className="text-center text-sm text-slate-600 dark:text-slate-400 mt-4">
          <button
            className="inline-flex items-center gap-2 text-slate-700 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
            onClick={() => navigate("/login")}
          >
            <FaArrowLeft className="text-[12px]" />
            Back to login
          </button>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
