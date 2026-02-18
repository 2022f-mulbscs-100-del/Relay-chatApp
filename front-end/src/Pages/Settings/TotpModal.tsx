import { FiX } from "react-icons/fi";
import { useState } from "react";
import { useUserApis } from "../../customHooks/useUserApis";

interface TotpModalProps {
    authenticatorQR: string;
    setOpenTOTPSetupModal: React.Dispatch<React.SetStateAction<boolean>>;
    setAuthenticatorApp: React.Dispatch<React.SetStateAction<boolean>>;
}
const TotpModal = ({
    authenticatorQR,
    setOpenTOTPSetupModal,
    setAuthenticatorApp
}: TotpModalProps) => {
    const [totpCode, setTotpCode] = useState("");
    const isCodeValid = /^\d{6}$/.test(totpCode);
    const { VerifyTOTP } = useUserApis();

    const TOTP_SETUP_IMAGE =
        "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='240' height='240' viewBox='0 0 240 240'%3E%3Crect width='240' height='240' fill='%23ffffff'/%3E%3Crect x='16' y='16' width='208' height='208' fill='%230f172a' rx='10'/%3E%3Crect x='28' y='28' width='184' height='184' fill='%23ffffff' rx='6'/%3E%3Ctext x='120' y='98' text-anchor='middle' font-size='14' font-family='Arial' fill='%230f172a'%3EScan In Your%3C/text%3E%3Ctext x='120' y='118' text-anchor='middle' font-size='14' font-family='Arial' fill='%230f172a'%3EAuthenticator App%3C/text%3E%3Crect x='62' y='136' width='24' height='24' fill='%230f172a'/%3E%3Crect x='92' y='136' width='24' height='24' fill='%230f172a'/%3E%3Crect x='122' y='136' width='24' height='24' fill='%230f172a'/%3E%3Crect x='152' y='136' width='24' height='24' fill='%230f172a'/%3E%3C/svg%3E";


    const HandleVerify = async () => {
        if (!isCodeValid) return;
        try {
            await VerifyTOTP(totpCode);
            setAuthenticatorApp(true);
            setOpenTOTPSetupModal(false);
        } catch (error) {
            console.error("Error verifying TOTP:", error);
        }
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/55 p-4">
            <div className="w-full max-w-md rounded-xl border border-slate-200 bg-white p-5 shadow-lg">
                <div className="mb-3 flex items-center justify-between">
                    <h3 className="text-base font-semibold text-slate-900">Set up authenticator app</h3>
                    <button
                        className="rounded-md p-1 text-slate-500 hover:bg-slate-100 hover:text-slate-700 transition"
                        onClick={() => setOpenTOTPSetupModal(false)}
                        aria-label="Close TOTP setup modal"
                    >
                        <FiX className="h-4 w-4" />
                    </button>
                </div>
                <p className="mb-4 text-sm text-slate-600">
                    Scan this image in your authenticator app to finish TOTP setup.
                </p>
                <div className="flex justify-center rounded-lg border border-slate-200 bg-slate-50 p-4">
                    <img
                        src={authenticatorQR || TOTP_SETUP_IMAGE}
                        alt="TOTP setup QR code"
                        className="h-56 w-56 rounded-md bg-white object-contain"
                    />
                </div>
                <div className="mt-4">
                    <label htmlFor="totp-code" className="mb-1 block text-xs font-medium text-slate-700">
                        Enter 6-digit code
                    </label>
                    <input
                        id="totp-code"
                        type="text"
                        maxLength={6}
                        value={totpCode}
                        onChange={(e) => setTotpCode(e.target.value.replace(/\D/g, ""))}
                        placeholder="123456"
                        className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-500"
                    />
                </div>
                <div className="mt-4 flex justify-end gap-2">
                    <button
                        onClick={() => setOpenTOTPSetupModal(false)}
                        className="rounded-md border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 transition"
                    >
                        Close
                    </button>
                    <button
                        onClick={() => {
                            HandleVerify();
                        }}
                        disabled={!isCodeValid}
                        className="rounded-md bg-slate-900 px-3 py-1.5 text-xs font-medium text-white hover:bg-slate-800 transition disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        Verify and enable
                    </button>
                </div>
            </div>
        </div>
    )
}


export default TotpModal;
