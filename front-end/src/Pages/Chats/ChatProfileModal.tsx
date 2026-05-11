import { useEffect } from "react";
import { FiMail, FiMapPin, FiSend, FiTag, FiUser, FiX } from "react-icons/fi";

type ChatProfileModalProps = {
  open: boolean;
  onClose: () => void;
  user?: {
    id: number;
    username: string;
    email?: string;
    profilePic?: string;
    title?: string;
    about?: string;
    location?: string;
    tags?: string[];
    lastSeen?: string | null | Date;
    isOnline?: boolean;
    createdAt?: Date;
  };
  totalMessages?: number;
  firstMessageAt?: string | Date;
};

const ChatProfileModal = ({
  open,
  onClose,
  user,
  totalMessages = 0,
}: ChatProfileModalProps) => {
  useEffect(() => {
    if (!open) return;


    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [open, onClose]);

  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  if (!open) return null;



  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 dark:bg-black/60 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="chat-profile-title"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-6xl overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 shadow-2xl transition-colors duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative border-b border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-6 py-5 text-slate-900 dark:text-slate-100 transition-colors duration-200">
          <h2 id="chat-profile-title" className="text-base font-semibold tracking-wide">
            Profile preview
          </h2>
          <button
            type="button"
            className="absolute right-5 top-4 rounded-full border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 p-2 text-slate-600 dark:text-slate-300 transition hover:bg-slate-100 dark:hover:bg-slate-600"
            onClick={onClose}
            aria-label="Close profile modal"
          >
            <FiX className="h-4 w-4" />
          </button>
        </div>

        <div className="relative grid gap-4 p-4 md:grid-cols-[1.2fr_1fr]">
          <section className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-5 shadow-sm transition-colors duration-200">
            <div className="flex items-center gap-4">
              <img
                src={user?.profilePic || "/153608270.jpeg"}
                alt={user?.username || "User profile"}
                className="h-20 w-20 rounded-2xl object-cover ring-2 ring-slate-200 dark:ring-slate-600"
              />
              <div>
                <p className="text-xl font-semibold text-slate-900 dark:text-slate-100">{user?.username || "Unknown user"}</p>
                <p className={`text-sm font-medium ${user?.isOnline ? "text-emerald-600 dark:text-emerald-400" : "text-slate-500 dark:text-slate-400"}`}>
                  {user?.isOnline ? "Online now" : "Away"}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400">Connected since {user?.createdAt ? new Date(user.createdAt).toLocaleDateString(undefined, {
                  month: "short", day: "numeric",
                  year: "numeric"
                }) : "Unknown"}</p>
              </div>
            </div>

            <div className="mt-5 grid grid-cols-1 gap-3">
              <div className="rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-800/50 p-3 transition-colors duration-200">
                <p className="text-xs text-slate-500 dark:text-slate-400">Messages</p>
                <p className="mt-1 text-lg font-semibold text-slate-900 dark:text-slate-100">{totalMessages}</p>
              </div>
            </div>

            <div className="mt-5 space-y-3 text-sm">
              <div className="flex items-start gap-2 text-slate-700 dark:text-slate-300">
                <FiMail className="mt-0.5 h-4 w-4 text-slate-500 dark:text-slate-400" />
                <span>{user?.email || "No email available"}</span>
              </div>
              <div className="flex items-start gap-2 text-slate-700 dark:text-slate-300">
                <FiMapPin className="mt-0.5 h-4 w-4 text-slate-500 dark:text-slate-400" />
                <span>{user?.location || "No location available"}</span>
              </div>
              <div className="flex items-start gap-2 text-slate-700 dark:text-slate-300">
                <FiUser className="mt-0.5 h-4 w-4 text-slate-500 dark:text-slate-400" />
                <span>{user?.title || "No title available"}</span>
              </div>
            </div>

            <p className="mt-4 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-800/50 p-3 text-sm text-slate-700 dark:text-slate-300 transition-colors duration-200">
              {user?.about || "No about information available."}
            </p>
          </section>

          <section className="space-y-4">
            <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-4 shadow-sm transition-colors duration-200">
              <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">Quick actions</p>
              <div className="mt-3 ">
                <button
                  type="button"
                  className="rounded-xl w-full border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-800/50 p-3 text-slate-700 dark:text-slate-300 transition hover:bg-slate-100 dark:hover:bg-slate-700"
                  onClick={() => { onClose() }}
                >
                  <FiSend className="mx-auto h-4 w-4" />
                  <span className="mt-1 block text-[11px]">Message</span>
                </button>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-4 shadow-sm transition-colors duration-200">
              <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-800 dark:text-slate-200">
                <FiTag className="h-4 w-4 text-slate-500 dark:text-slate-400" />
                Interests
              </div>
              <div className="flex flex-wrap gap-2">
                {(user?.tags || []).length > 0 ? (
                  (user?.tags || []).map((tag, index) => (
                    <span
                      key={`${tag}-${index}`}
                      className="rounded-full border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-800/50 px-2.5 py-1 text-xs text-slate-700 dark:text-slate-300 transition-colors duration-200"
                    >
                      {tag}
                    </span>
                  ))
                ) : (
                  <span className="text-xs text-slate-500 dark:text-slate-400">No interests added</span>
                )}
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-4 text-slate-900 dark:text-slate-100 shadow-sm transition-colors duration-200">
              <p className="text-sm font-semibold">Focus mode</p>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">Mute notifications for this chat while working.</p>
              <button
                type="button"
                className="mt-3 w-full rounded-xl bg-slate-900 dark:bg-white px-3 py-2 text-xs font-medium text-white dark:text-slate-900 transition hover:bg-slate-800 dark:hover:bg-slate-100"
              >
                Enable mute
              </button>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default ChatProfileModal;
