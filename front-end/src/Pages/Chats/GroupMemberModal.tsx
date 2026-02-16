import { useEffect, useRef } from "react";
import { FiUsers, FiX } from "react-icons/fi";
import type { Group } from "../../types/group.type";
import { useMessage } from "../../context/MessageProvider";
import { useUser } from "../../context/UserProvider";

interface GroupMemberModalProps {
    setIsGroupMemberModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
    filterGroup: Group | undefined;
}

const GroupMemberModal = ({ setIsGroupMemberModalOpen, filterGroup }: GroupMemberModalProps) => {
    const wraperRef = useRef<HTMLDivElement | null>(null);
    const { listOfAllUsers } = useMessage();

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Escape") {
                setIsGroupMemberModalOpen(false);
            }
        };

        const handleClickOutside = (event: MouseEvent) => {
            if (wraperRef.current && !wraperRef.current.contains(event.target as Node)) {
                setIsGroupMemberModalOpen(false);
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        window.addEventListener("click", handleClickOutside);

        return () => {
            window.removeEventListener("keydown", handleKeyDown);
            window.removeEventListener("click", handleClickOutside);
        };
    }, [setIsGroupMemberModalOpen]);

    const memberIds = filterGroup?.memberIds || [];
    const filteredMembers = listOfAllUsers?.filter((user) => memberIds.includes((user.id))) || [];

    const {user} = useUser();
    filteredMembers.unshift({
        id: 0,
        username: user?.username || "Unknown User",
        email: user?.email || "",
    });

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 px-3">
            <div ref={wraperRef} className="w-full max-w-xl rounded-2xl border border-slate-200 bg-white shadow-2xl">
                <div className="flex items-start justify-between border-b border-slate-200 px-6 py-5">
                    <div className="flex items-start gap-3">
                        <div className="mt-0.5 flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 text-white">
                            <FiUsers className="h-5 w-5" />
                        </div>
                        <div>
                            <h2 className="text-lg font-semibold text-slate-900">Group members</h2>
                            <p className="text-xs text-slate-500">People currently in this group.</p>
                        </div>
                    </div>
                    <button
                        type="button"
                        className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
                        aria-label="Close group members modal"
                        onClick={() => setIsGroupMemberModalOpen(false)}
                    >
                        <FiX className="h-4 w-4" />
                    </button>
                </div>

                <div className="px-6 py-5">
                    <div className="mb-3 text-xs text-slate-500">
                        {filteredMembers.length} member{filteredMembers.length === 1 ? "" : "s"}
                    </div>

                    <div className="max-h-72 space-y-2 overflow-y-auto pr-1 customScrollbar">
                        {filteredMembers.length === 0 ? (
                            <div className="rounded-lg border border-dashed border-slate-200 bg-slate-50 px-3 py-4 text-center text-xs text-slate-500">
                                No members found for this group.
                            </div>
                        ) : (
                            filteredMembers.map((member) => (
                                <div key={member.id} className="flex items-center justify-between rounded-lg border border-slate-200 bg-white px-3 py-2">
                                    <div className="flex min-w-0 items-center gap-3">
                                        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-900 text-xs font-semibold text-white">
                                            {member.username?.slice(0, 2)?.toUpperCase()}
                                        </div>
                                        <div className="min-w-0">
                                            <p className="truncate text-sm font-medium text-slate-900">{member.username}</p>
                                            {member.email && <p className="truncate text-xs text-slate-500">{member.email}</p>}
                                        </div>
                                    </div>
                                    <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] text-slate-600">{member.email === user?.email ? "You" : "Member"}</span>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GroupMemberModal;
