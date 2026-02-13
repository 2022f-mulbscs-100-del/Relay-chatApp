import { useRef } from "react";
import { FiAlertTriangle, FiX } from "react-icons/fi";
import type { Group } from "../../types/group.type";
import { useSocket } from "../../context/SocketProvider";
import { useUser } from "../../context/UserProvider";
import { useGroup } from "../../context/GroupProvider";
import { useMessage } from "../../context/MessageProvider";

interface LeaveGroupModalProps {
    setIsLeaveGroupModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
    filterGroup: Group | undefined;
}

const LeaveGroupModal = ({ setIsLeaveGroupModalOpen, filterGroup }: LeaveGroupModalProps) => {
    const wraperRef = useRef<HTMLDivElement | null>(null);
    const socket = useSocket();
    const { user } = useUser();
    const { setListOfgroups } = useGroup();
    const { setActiveUserId } = useMessage();


console.log("filterGroup in LeaveGroupModal", filterGroup);
    const handleLeaveGroup = () => {
        if (!socket || !user) return;
        socket.emit("leave_group", { groupId: filterGroup?.id, userId: user?.id });
        setListOfgroups((prev) => prev.filter(group => group.id !== filterGroup?.id));
        setIsLeaveGroupModalOpen(false);
        setActiveUserId(null);
    }
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 px-3">
            <div ref={wraperRef} className="w-full max-w-md rounded-2xl border border-slate-200 bg-white shadow-2xl">
                <div className="flex items-start justify-between border-b border-slate-200 px-6 py-5">
                    <div className="flex items-start gap-3">
                        <div className="mt-0.5 flex h-10 w-10 items-center justify-center rounded-xl bg-rose-100 text-rose-600">
                            <FiAlertTriangle className="h-5 w-5" />
                        </div>
                        <div>
                            <h2 className="text-lg font-semibold text-slate-900">Leave group?</h2>
                            <p className="text-xs text-slate-500">This is a confirmation step only.</p>
                        </div>
                    </div>
                    <button
                        type="button"
                        className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
                        onClick={() => setIsLeaveGroupModalOpen(false)}
                        aria-label="Close leave group modal"
                    >
                        <FiX className="h-4 w-4" />
                    </button>
                </div>

                <div className="px-6 py-5">
                    <p className="text-sm text-slate-700">
                        You are about to leave{" "}
                        <span className="font-semibold text-slate-900">
                            {filterGroup?.groupName || "this group"}
                        </span>
                        .
                    </p>
                    <p className="mt-2 text-xs text-slate-500">
                        By leaving group chat will be deleted automatically.
                    </p>
                </div>

                <div className="flex items-center justify-end gap-2 border-t border-slate-200 px-6 py-4">
                    <button
                        type="button"
                        className="rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-700 transition hover:bg-slate-50"
                        onClick={() => setIsLeaveGroupModalOpen(false)}
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        className="rounded-lg bg-rose-600 px-3 py-2 text-sm text-white transition hover:bg-rose-700"
                        onClick={() => handleLeaveGroup()}
                    >
                        Leave group
                    </button>
                </div>
            </div>
        </div>
    );
};

export default LeaveGroupModal;
