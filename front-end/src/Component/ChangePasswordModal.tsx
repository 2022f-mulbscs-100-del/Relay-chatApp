import { useState } from "react";
import { FiX } from "react-icons/fi";
import { toast } from "react-toastify";
import { useUserApis } from "../customHooks/useUserApis";

type ChangePasswordModalProps = {
  open: boolean;
  onClose: () => void;
};

const ChangePasswordModal = ({ open, onClose }: ChangePasswordModalProps) => {

  // state
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // hooks
  const { ChangePassword } = useUserApis();

  if (!open) return null;

  const handleSubmit = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error("Please fill out all password fields.");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("New passwords do not match.");
      return;
    }


    await ChangePassword(currentPassword, newPassword);


    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 dark:bg-black/60 px-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="change-password-title"
      onKeyDown={(e) => {
        if (e.key === "Escape") {
          onClose();
        }
      }}
      tabIndex={-1}
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-2xl bg-white dark:bg-slate-800 p-6 shadow-xl transition-colors duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <h2 id="change-password-title" className="text-lg font-semibold text-slate-900 dark:text-slate-100">
            Change password
          </h2>
          <button
            className="rounded-lg p-2 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 transition"
            onClick={onClose}
            aria-label="Close"
          >
            <FiX className="w-4 h-4" />
          </button>
        </div>

        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
          Use a strong password with at least 8 characters.
        </p>

        <div className="mt-5 space-y-4">
          <label className="text-sm">
            <span className="text-slate-500 dark:text-slate-400">Current password</span>
            <input
              type="password"
              className="mt-1 w-full rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 px-3 py-2 text-sm outline-none focus:border-slate-400 dark:focus:border-slate-500 text-slate-900 dark:text-slate-100 transition-colors duration-200"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="Enter current password"
            />
          </label>
          <label className="text-sm">
            <span className="text-slate-500 dark:text-slate-400">New password</span>
            <input
              type="password"
              className="mt-1 w-full rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 px-3 py-2 text-sm outline-none focus:border-slate-400 dark:focus:border-slate-500 text-slate-900 dark:text-slate-100 transition-colors duration-200"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Enter new password"
            />
          </label>
          <label className="text-sm">
            <span className="text-slate-500 dark:text-slate-400">Confirm new password</span>
            <input
              type="password"
              className="mt-1 w-full rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 px-3 py-2 text-sm outline-none focus:border-slate-400 dark:focus:border-slate-500 text-slate-900 dark:text-slate-100 transition-colors duration-200"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm new password"
            />
          </label>
        </div>

        <div className="mt-6 flex items-center justify-end gap-2">
          <button
            className="px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-600 text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 rounded-lg bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-sm hover:bg-slate-800 dark:hover:bg-slate-100 transition"
            onClick={handleSubmit}
          >
            Update password
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChangePasswordModal;
