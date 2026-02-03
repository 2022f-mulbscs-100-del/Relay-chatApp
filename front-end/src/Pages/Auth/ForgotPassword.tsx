import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa6";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md">
        <div className="text-center mb-6">
          <div className="text-sm uppercase tracking-[0.35em] text-slate-400">Relay</div>
          <h1 className="text-2xl font-semibold mt-2">Reset your password</h1>
          <p className="text-sm text-slate-500 mt-1">We’ll send a reset link to your email.</p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <label className="text-sm">
            <span className="text-slate-500">Email</span>
            <input
              className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-slate-400"
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@email.com"
            />
          </label>

          <button className="mt-5 w-full bg-slate-900 text-white py-2.5 rounded-lg text-sm font-medium hover:bg-slate-800 transition">
            Send reset link
          </button>
        </div>

        <div className="text-center text-sm text-slate-600 mt-4">
          <button
            className="inline-flex items-center gap-2 text-slate-700 hover:text-slate-900"
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
