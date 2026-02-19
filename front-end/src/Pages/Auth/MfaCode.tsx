import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa6";
import { toast } from "react-toastify";
import { useAuthCall } from "../../customHooks/useAuthCall";
import { useAuth } from "../../context/AuthProvider";

interface MfaCodeProps {
  email: string;
  stage: string;
}
const MfaCode = ({ email, stage }: MfaCodeProps) => {
  const [code, setCode] = useState("");
  const navigate = useNavigate();
  const {setStage} = useAuth();

  const { verifyTwoFactor } = useAuthCall();







  const handleVerifyTwoFactor = async () => {
    if (!code || code.length !== 6) {
      toast.error("Please enter a valid 6-digit code.");
      return;
    }

    try {
      await verifyTwoFactor(email, code, stage);
      navigate("/");
    } catch (error) {
      toast.error(error as string || "Verification failed. Please try again.");
    }
  }


  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md">
        <div className="text-center mb-6">
          <div className="text-sm uppercase tracking-[0.35em] text-slate-400">Relay</div>
          <h1 className="text-2xl font-semibold mt-2">Enter verification code</h1>
          <p className="text-sm text-slate-500 mt-1">
            {stage === "emailTwoFactor" && "We sent a 6-digit code to your email or phone."}
            {stage === "totpTwoFactor" && "Enter the 6-digit code from your authenticator app."}
            {stage === "passkeyTwoFactor" && "Use your passkey to verify your identity."}

          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <label className="text-sm">
            <span className="text-slate-500">Verification code</span>
            <input
              className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-slate-400 tracking-[0.4em] text-center"
              type="text"
              maxLength={6}
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="••••••"
            />
          </label>

          <button className="mt-5 w-full bg-slate-900 text-white py-2.5 rounded-lg text-sm font-medium hover:bg-slate-800 transition"
            onClick={handleVerifyTwoFactor}>
            Verify
          </button>

          <div className="mt-4 text-center text-xs text-slate-500">
            Didn’t get a code?{" "}
            <button className="text-slate-700 hover:text-slate-900 font-medium">
              Resend
            </button>
          </div>
        </div>

        <div className="text-center text-sm text-slate-600 mt-4">
          <button
            className="inline-flex items-center gap-2 text-slate-700 hover:text-slate-900"
            onClick={() => {
              setStage(null);
              
            }}
          >
            <FaArrowLeft className="text-[12px]" />
            Back to login
          </button>
        </div>
      </div>
    </div>
  );
};

export default MfaCode;
