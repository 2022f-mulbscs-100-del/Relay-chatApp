import { FiPlus, FiSearch, FiUsers, FiX } from "react-icons/fi";
import { useMessage } from "../../context/MessageProvider";
import { useEffect, useState } from "react";
import { useMessageApis } from "../../customHooks/useMessageApis";
import { toast } from "react-toastify";
import { useUser } from "../../context/UserProvider";
import type { chatUser } from "../../types/message.types";
import { useSocket } from "../../context/SocketProvider";

interface CreateGroupModalProps {
    setIsCreateOpen: (isOpen: boolean) => void;
}

const CreateGroupModal = ({
    setIsCreateOpen,

}: CreateGroupModalProps) => {

    //Context
    const { listOfAllUsers } = useMessage();
    const { user } = useUser();
    const socket = useSocket();
    //Hooks
    const { fetchAllUsersForLiveSearch } = useMessageApis();

    //states
    const [searchInput, setSearchInput] = useState("");
    const [selectedUsers, setSelectedUsers] = useState<chatUser[]>([]);
    const [groupName, setGroupName] = useState("");


    //filtering
    const filterUser = listOfAllUsers.filter((user) => {
        return user?.username?.toLowerCase().includes(searchInput.toLowerCase());
    });

    const someFilterUser = filterUser.slice(0, 10);
    const usersToShow = searchInput.trim().length > 0 ? filterUser : someFilterUser;



    useEffect(() => {
        if (!user?.id) return;
        const fetcheLiveSearchData = async () => {
            try {
                await fetchAllUsersForLiveSearch();

            } catch (error) {
                toast.error(String(error));
            }
        }
        fetcheLiveSearchData();
    }, [user?.id]);



    const handleCreateGroup = () => {
        if (selectedUsers.length < 2) {
            toast.error("Please select at least 2 users to create a group.");
            return;
        }

        if (!socket) {
            toast.error("Connection lost");
            return;
        }

        socket.emit("create_group", {
            groupName: groupName || "New Group",
            memberIds: selectedUsers.map((user) => user.id),
            userId: user?.id,
        });
        
        setIsCreateOpen(false);
        toast.success("Group created successfully!");
    }


    return (
        <>
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 px-3">
                <div className="w-full max-w-2xl rounded-2xl border border-slate-200 bg-white shadow-2xl">
                    <div className="flex items-start justify-between border-b border-slate-200 px-6 py-5">
                        <div className="flex items-start gap-3">
                            <div className="mt-0.5 flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 text-white">
                                <FiUsers className="h-5 w-5" />
                            </div>
                            <div>
                                <h2 className="text-lg font-semibold text-slate-900">Create group</h2>
                                <p className="text-xs text-slate-500">Pick people, name the group, and continue.</p>
                            </div>
                        </div>
                        <button
                            className="p-2 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition"
                            onClick={() => setIsCreateOpen(false)}
                            aria-label="Close create group modal"
                        >
                            <FiX className="w-4 h-4" />
                        </button>
                    </div>
                    <div className="grid gap-5 px-6 py-5 md:grid-cols-[1.1fr_1fr]">
                        <div>
                            <div className="mb-4">
                                <div className="flex items-center justify-between">
                                    <div className="text-xs font-medium text-slate-600">Selected users</div>
                                    <span className="text-[11px] text-slate-400">{selectedUsers.length} selected</span>
                                </div>
                                {selectedUsers.length === 0 ? (
                                    <div className="mt-2 rounded-lg border border-dashed border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-500">
                                        No users selected yet.
                                    </div>
                                ) : (
                                    <div className="mt-2 flex flex-wrap gap-2">
                                        {selectedUsers.map((user) => (
                                            <span
                                                key={user.id}
                                                className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1 text-xs text-slate-700 shadow-sm"
                                            >
                                                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-slate-900 text-[10px] text-white">
                                                    {user.username?.slice(0, 1)?.toUpperCase() || "U"}
                                                </span>
                                                {user.username}
                                                <button
                                                    className="text-slate-400 hover:text-slate-600"
                                                    onClick={() =>
                                                        setSelectedUsers((prev) => prev.filter((u) => u.id !== user.id))
                                                    }
                                                    aria-label={`Remove ${user.username}`}
                                                >
                                                    <FiX className="w-3 h-3" />
                                                </button>
                                            </span>
                                        ))}
                                    </div>
                                )}
                            </div>
                            <div className="mb-4">
                                <label className="text-xs font-medium text-slate-600">Group name</label>
                                <input
                                    className="mt-2 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
                                    placeholder="Enter group name"
                                    value={groupName}
                                    onChange={(e) => setGroupName(e.target.value)}
                                />
                            </div>
                            <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs text-slate-500">
                                Tip: Start with a clear name like “Design Review” or “Q1 Launch”.
                            </div>
                        </div>
                        <div>
                            <label className="text-xs font-medium text-slate-600">Search users</label>
                            <div className="mt-2 flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-600 focus-within:border-slate-400 focus-within:ring-2 focus-within:ring-slate-200">
                                <FiSearch className="w-4 h-4 text-slate-400" />
                                <input
                                    className="w-full outline-none"
                                    placeholder="Type a name or email"
                                    value={searchInput}
                                    onChange={(e) => setSearchInput(e.target.value)}
                                />
                            </div>
                            <div className="mt-3 max-h-64 overflow-y-auto space-y-2 pr-1 customScrollbar">
                                {filterUser.length === 0 ? (
                                    <div className="text-xs text-slate-500">No users found.</div>
                                ) : (
                                    usersToShow.map((user) => {
                                        const isSelected = selectedUsers.some((u) => u.id === user.id);
                                        return (
                                            <div
                                                key={user.id}
                                                className="flex items-center justify-between rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 hover:border-slate-300 hover:shadow-sm transition"
                                            >
                                                <div className="flex items-center gap-3 min-w-0">
                                                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-900 text-xs font-semibold text-white">
                                                        {user.username?.slice(0, 2)?.toUpperCase() || "US"}
                                                    </div>
                                                    <div className="min-w-0">
                                                        <div className="font-medium text-slate-900 truncate">{user.username}</div>
                                                        {user.email && <div className="text-xs text-slate-500 truncate">{user.email}</div>}
                                                    </div>
                                                </div>
                                                <button
                                                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md border text-xs transition ${isSelected
                                                            ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                                                            : "border-slate-200 text-slate-600 hover:bg-slate-100"
                                                        }`}
                                                    onClick={() => {
                                                        if (isSelected) return;
                                                        setSelectedUsers((prev) => [...prev, user]);
                                                    }}
                                                    disabled={isSelected}
                                                >
                                                    <FiPlus className="h-3.5 w-3.5" />
                                                    {isSelected ? "Added" : "Add"}
                                                </button>
                                            </div>
                                        );
                                    })
                                )}
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center justify-end gap-2 border-t border-slate-200 px-6 py-4">
                        <button
                            className="px-3 py-2 rounded-lg border border-slate-200 text-sm text-slate-700 hover:bg-slate-50 transition"
                            onClick={() => setIsCreateOpen(false)}
                        >
                            Cancel
                        </button>
                        <button className="px-3 py-2 rounded-lg bg-slate-900 text-white text-sm hover:bg-slate-800 transition"
                            onClick={handleCreateGroup}
                        >
                            Create
                        </button>
                    </div>
                </div>
            </div>
        </>
    )
}

export default CreateGroupModal;
