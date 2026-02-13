import { useEffect } from "react";
import { FiMail, FiMapPin, FiPhoneCall, FiSend, FiTag, FiUser, FiVideo, FiX } from "react-icons/fi";
import type { chatUser } from "../../types/message.types";

type ChatProfileModalProps = {
  open: boolean;
  onClose: () => void;
  user?: chatUser;
  totalMessages?: number;
  firstMessageAt?: string | Date;
};

const ChatProfileModal = ({
  open,
  onClose,
  user,
  totalMessages = 0,
  firstMessageAt,
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

  const joinedDate = firstMessageAt ? new Date(firstMessageAt) : null;
  const formattedJoinedDate =
    joinedDate && !Number.isNaN(joinedDate.getTime())
      ? joinedDate.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })
      : "No history yet";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="chat-profile-title"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-6xl overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative border-b border-slate-200 bg-white px-6 py-5 text-slate-900">
          <h2 id="chat-profile-title" className="text-base font-semibold tracking-wide">
            Profile preview
          </h2>
          <button
            type="button"
            className="absolute right-5 top-4 rounded-full border border-slate-200 bg-white p-2 text-slate-600 transition hover:bg-slate-100"
            onClick={onClose}
            aria-label="Close profile modal"
          >
            <FiX className="h-4 w-4" />
          </button>
        </div>

        <div className="relative grid gap-4 p-4 md:grid-cols-[1.2fr_1fr]">
          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center gap-4">
              <img
                src={user?.profilePic || "/153608270.jpeg"}
                alt={user?.username || "User profile"}
                className="h-20 w-20 rounded-2xl object-cover ring-2 ring-slate-200"
              />
              <div>
                <p className="text-xl font-semibold text-slate-900">{user?.username || "Unknown user"}</p>
                <p className={`text-sm font-medium ${user?.isOnline ? "text-emerald-600" : "text-slate-500"}`}>
                  {user?.isOnline ? "Online now" : "Away"}
                </p>
                <p className="text-xs text-slate-500">Connected since {formattedJoinedDate}</p>
              </div>
            </div>

            <div className="mt-5 grid grid-cols-1 gap-3">
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                <p className="text-xs text-slate-500">Messages</p>
                <p className="mt-1 text-lg font-semibold text-slate-900">{totalMessages}</p>
              </div>
            </div>

            <div className="mt-5 space-y-3 text-sm">
              <div className="flex items-start gap-2 text-slate-700">
                <FiMail className="mt-0.5 h-4 w-4 text-slate-500" />
                <span>{user?.email || "No email available"}</span>
              </div>
              <div className="flex items-start gap-2 text-slate-700">
                <FiMapPin className="mt-0.5 h-4 w-4 text-slate-500" />
                <span>{user?.location || "No location available"}</span>
              </div>
              <div className="flex items-start gap-2 text-slate-700">
                <FiUser className="mt-0.5 h-4 w-4 text-slate-500" />
                <span>{user?.title || "No title available"}</span>
              </div>
            </div>

            <p className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm text-slate-700">
              {user?.about || "No about information available."}
            </p>
          </section>

          <section className="space-y-4">
            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <p className="text-sm font-semibold text-slate-800">Quick actions</p>
              <div className="mt-3 grid grid-cols-3 gap-2">
                <button
                  type="button"
                  className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-slate-700 transition hover:bg-slate-100"
                >
                  <FiSend className="mx-auto h-4 w-4" />
                  <span className="mt-1 block text-[11px]">Message</span>
                </button>
                <button
                  type="button"
                  className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-slate-700 transition hover:bg-slate-100"
                >
                  <FiPhoneCall className="mx-auto h-4 w-4" />
                  <span className="mt-1 block text-[11px]">Audio</span>
                </button>
                <button
                  type="button"
                  className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-slate-700 transition hover:bg-slate-100"
                >
                  <FiVideo className="mx-auto h-4 w-4" />
                  <span className="mt-1 block text-[11px]">Video</span>
                </button>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-800">
                <FiTag className="h-4 w-4 text-slate-500" />
                Interests
              </div>
              <div className="flex flex-wrap gap-2">
                {(user?.tags || []).length > 0 ? (
                  (user?.tags || []).map((tag, index) => (
                    <span
                      key={`${tag}-${index}`}
                      className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs text-slate-700"
                    >
                      {tag}
                    </span>
                  ))
                ) : (
                  <span className="text-xs text-slate-500">No interests added</span>
                )}
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-4 text-slate-900 shadow-sm">
              <p className="text-sm font-semibold">Focus mode</p>
              <p className="mt-1 text-xs text-slate-500">Mute notifications for this chat while working.</p>
              <button
                type="button"
                className="mt-3 w-full rounded-xl bg-slate-900 px-3 py-2 text-xs font-medium text-white transition hover:bg-slate-800"
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
