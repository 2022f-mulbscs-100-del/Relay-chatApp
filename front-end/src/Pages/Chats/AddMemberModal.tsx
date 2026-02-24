import { useEffect, useMemo, useRef, useState } from "react";
import { FiSearch, FiUsers, FiX } from "react-icons/fi";
import { useMessage } from "../../context/MessageProvider";
import type { Group } from "../../types/group.type";
import { useSocket } from "../../context/SocketProvider";
import { useUser } from "../../context/UserProvider";
import { toast } from "react-toastify";

interface AddMemberModalProps {
    setIsAddMemberModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
    filterGroup: Group | undefined;
}

const AddMemberModal = ({ setIsAddMemberModalOpen, filterGroup }: AddMemberModalProps) => {
    const wraperRef = useRef<HTMLDivElement | null>(null);
    const [searchInput, setSearchInput] = useState("");
    const [selectedMemberIds, setSelectedMemberIds] = useState<string[]>([]);

    const { listOfAllUsers } = useMessage();
    const socket = useSocket();
    const { user } = useUser();

    const memberIds = useMemo(() => {
        return filterGroup?.memberIds || [];
    }, [filterGroup]);


    const availableUsers = useMemo(() => {
        return listOfAllUsers.filter((user) => !memberIds.includes((user.id)));
    }, [listOfAllUsers, memberIds]);

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Escape") {
                setIsAddMemberModalOpen(false);
            }
        };

        window.addEventListener("keydown", handleKeyDown);

        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [setIsAddMemberModalOpen]);

    const filteredSearch = availableUsers.filter((user) => {
        const searchTerm = searchInput.toLowerCase();
        const userName = user.username.toLowerCase();
        const userEmail = user?.email?.toLowerCase() || "";
        return userName.includes(searchTerm) || userEmail.includes(searchTerm);
    });

    const usersToRender = searchInput.trim().length === 0 ? availableUsers.slice(0, 12) : filteredSearch;

    const handleAddMembers = () => {
        if (!socket || !user) return;
        socket.emit("add_member", { groupId: filterGroup?.id, newMemberIds: selectedMemberIds });
        setIsAddMemberModalOpen(false);
        for (const memberId of selectedMemberIds) {
            socket.emit("join_group", { groupId: filterGroup?.id, userId: memberId });
            const addedUser = listOfAllUsers.find((user) => String(user.id) === memberId);
            if (addedUser) {
                toast.success(`${addedUser.username} added successfully!`);
            }
        }
    };

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 px-3"
            onMouseDown={(event) => {
                if (event.target === event.currentTarget) {
                    setIsAddMemberModalOpen(false);
                }
            }}
        >
            <div ref={wraperRef} className="w-full max-w-xl rounded-2xl border border-slate-200 bg-white p-4 shadow-2xl">
                <div className="mb-2 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                        <div className="mt-0.5 flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 text-white">
                            <FiUsers className="h-5 w-5" />
                        </div>
                        <h1 className="font-bold">Add member</h1>
                    </div>
                    <button
                        type="button"
                        className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
                        onClick={() => setIsAddMemberModalOpen(false)}
                        aria-label="Close add member modal"
                    >
                        <FiX className="h-4 w-4" />
                    </button>
                </div>

                <div className="mt-2 flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-600 focus-within:border-slate-400 focus-within:ring-2 focus-within:ring-slate-200">
                    <FiSearch className="h-4 w-4 text-slate-400" />
                    <input
                        className="w-full outline-none"
                        placeholder="Type a name or email"
                        value={searchInput}
                        onChange={(e) => setSearchInput(e.target.value)}
                    />
                </div>

                {selectedMemberIds.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-2">
                        {selectedMemberIds.map((id) => {
                            const selectedUser = listOfAllUsers.find((user) => String(user.id) === id);
                            if (!selectedUser) return null;
                            return (
                                <span
                                    key={id}
                                    className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs text-slate-700"
                                >
                                    {selectedUser.username}
                                    <button
                                        type="button"
                                        className="text-slate-400 hover:text-slate-700"
                                        onClick={() =>
                                            setSelectedMemberIds((prev) => prev.filter((memberId) => memberId !== id))
                                        }
                                    >
                                        <FiX className="h-3 w-3" />
                                    </button>
                                </span>
                            );
                        })}
                    </div>
                )}

                <div className="h-[300px] overflow-y-auto">
                    {usersToRender.map((user) => {
                        const userId = String(user.id);
                        const isSelected = selectedMemberIds.includes(userId);
                        return (
                            <button
                                type="button"
                                key={user.id}
                                className={`mt-3 flex w-full items-center justify-between rounded-lg border p-2 text-left ${isSelected
                                    ? "border-emerald-200 bg-emerald-50"
                                    : "border-slate-200 hover:bg-slate-50"
                                    }`}
                                onClick={() => {
                                    setSelectedMemberIds((prev) => {
                                        if (prev.includes(userId)) {
                                            return prev.filter((memberId) => memberId !== userId);
                                        }
                                        return [...prev, userId];
                                    });
                                }}
                            >
                                <div className="flex items-center gap-3">
                                    <div className="mt-0.5 flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 text-white">
                                        {user.username[0]?.toUpperCase()}
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium">{user.username}</p>
                                        <p className="text-xs text-slate-500">{user.email}</p>
                                    </div>
                                </div>
                                <span className={`text-xs ${isSelected ? "text-emerald-700" : "text-slate-500"}`}>
                                    {isSelected ? "Selected" : "Select"}
                                </span>
                            </button>
                        );
                    })}
                    {usersToRender.length === 0 && (
                        <div className="mt-4 rounded-lg border border-dashed border-slate-200 bg-slate-50 px-3 py-4 text-center text-xs text-slate-500">
                            No users available to add.
                        </div>
                    )}
                </div>

                <div className="mt-4 flex items-center justify-end gap-2 border-t border-slate-200 pt-4">
                    <button
                        type="button"
                        className="rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-700 transition hover:bg-slate-50"
                        onClick={() => setIsAddMemberModalOpen(false)}
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        className="rounded-lg bg-slate-900 px-3 py-2 text-sm text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
                        disabled={selectedMemberIds.length === 0}
                        onClick={handleAddMembers}
                    >
                        Add members
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AddMemberModal;
