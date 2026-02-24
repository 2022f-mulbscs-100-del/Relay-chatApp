import { FiChevronLeft, FiInfo } from "react-icons/fi";
import { normalizeDate } from "../../utlis/NormalizeDate";
import type { Group } from "../../types/group.type";
import type { AssociatedUser } from "../../types/message.types";
import { useMessage } from "../../context/MessageProvider";
import { useUserApis } from "../../customHooks/useUserApis";
import { toast } from "react-toastify";
import { useGroup } from "../../context/GroupProvider";
import useGroupApis from "../../customHooks/useGroupApis";

type FilterUser = AssociatedUser & { isOnline: boolean };

interface ChatPageHeaderProps {
    onBack: () => void;
    setIsProfileModalOpen: (isOpen: boolean) => void;
    setIsAddMemberModalOpen: (isOpen: boolean) => void;
    setIsGroupMemberModalOpen: (isOpen: boolean) => void;
    setIsLeaveGroupModalOpen: (isOpen: boolean) => void;
    mode: "private" | "group";
    filterUser?: FilterUser;
    filterGroup?: Group;
    handleMuteToggle?: () => void;
    foundUser?: AssociatedUser;
}
const ChatPageHeader = ({ onBack, setIsProfileModalOpen, setIsAddMemberModalOpen, setIsGroupMemberModalOpen, setIsLeaveGroupModalOpen, mode, filterUser, filterGroup, handleMuteToggle, foundUser }: ChatPageHeaderProps) => {

    const { activeUserId, setAssociatedUser, } = useMessage();
    const {setListOfgroups} = useGroup();
    const { deletePrivateChat } = useUserApis();
    const {deleteGroup} = useGroupApis();

    //delete private chat
    const handleDeleteChat = async () => {
        try {
            await deletePrivateChat(String(activeUserId));
            setAssociatedUser((prev) => prev.filter((user) => String(user.associateUserId) !== String(activeUserId)));
            onBack();

            toast.success("Chat deleted successfully");
        } catch {
            toast.error("Failed to delete chat");
        }
    };

    //delete group chat
    const handleGroupChatDeletion = async () => { 
        try {
            await deleteGroup(String(activeUserId));
            setListOfgroups((prev) => prev.filter(group => group.id !== filterGroup?.id));
            onBack();
            toast.success("Group deleted successfully");
        } catch {
            toast.error("Failed to delete group");
        }
    }

return (
        <div className="flex items-center justify-between gap-3 border-b border-slate-200 bg-white px-3 py-3 sm:px-4">
            <div className="flex min-w-0 items-center gap-3">
                <button
                    type="button"
                    onClick={onBack}
                    className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-600 transition hover:bg-slate-50 md:hidden"
                    aria-label="Back to chats"
                >
                    <FiChevronLeft className="h-4 w-4" />
                </button>
                <div className="relative h-11 w-11 shrink-0 rounded-full ring-2 ring-slate-200">
                    <img className="h-full w-full rounded-full object-cover" src={filterUser?.associatedUser.profilePic || "/153608270.jpeg"} alt={filterUser?.associatedUser?.username || "chat user"} />
                    {mode === "private" && (
                        <span
                            className={`absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white ${filterUser?.isOnline === true ? "bg-emerald-500" : "bg-slate-400"}`}
                        />
                    )}
                </div>
                <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-slate-900">
                        {mode === "private" ? (filterUser ? filterUser.associatedUser.username : "Unknown User") : (filterGroup ? filterGroup?.groupName : "Unknown Group")}
                    </p>
                    <div className="mt-0.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-slate-500">
                        <span className="rounded-full bg-slate-100 px-2 py-0.5">
                            {mode === "private" ? (filterUser?.isOnline === true ? "Online" :
                                filterUser?.associatedUser?.lastSeen ? normalizeDate((filterUser?.associatedUser?.lastSeen || "")).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' }) : "Offline"
                            ) : "Group chat"}
                        </span>
                    </div>
                </div>
            </div>
            <div className="flex items-center gap-1.5 sm:gap-2">

                {mode === "private" ? (
                    <>
                        <button
                            type="button"
                            className="rounded-lg border border-slate-200 bg-white p-2 text-slate-600 transition hover:bg-slate-50"
                            onClick={() => setIsProfileModalOpen(true)}
                            disabled={!filterUser}
                            aria-label="View profile details"
                        >
                            <FiInfo className="h-4 w-4" />
                        </button>
                        <button
                            type="button"
                            className="hidden rounded-md bg-slate-900 px-3 py-1.5 text-xs text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50 sm:inline-flex"
                            onClick={() => setIsProfileModalOpen(true)}
                            disabled={!filterUser}
                        >
                            View profile
                        </button>
                        <button className="hidden cursor-pointer rounded-md border border-slate-200 px-3 py-1.5 text-xs text-slate-600 transition hover:bg-slate-50 md:inline-flex"
                            onClick={handleMuteToggle}
                        >
                            {foundUser?.isMuted ? "Unmute" : "Mute"}
                        </button>
                    </>
                ) : (
                    <>
                        <button
                            type="button"
                            className="rounded-md border border-slate-200 px-3 py-1.5 text-xs text-slate-600 transition hover:bg-slate-50"
                            onClick={(e) => {
                                e.stopPropagation();
                                setIsAddMemberModalOpen(true)
                            }}
                        >
                            Add member
                        </button>
                        <button
                            type="button"
                            className="hidden rounded-md border border-slate-200 px-3 py-1.5 text-xs text-slate-600 transition hover:bg-slate-50 sm:inline-flex"
                            onClick={(e) => {
                                e.stopPropagation();
                                setIsGroupMemberModalOpen(true)
                            }}
                        >
                            Members ({filterGroup?.memberIds?.length || 0})
                        </button>
                        <button
                            type="button"
                            className="rounded-md bg-rose-600 px-3 py-1.5 text-xs text-white transition hover:bg-rose-700"
                            onClick={(e) => {
                                e.stopPropagation();
                                setIsLeaveGroupModalOpen(true);
                            }}
                        >
                            Leave group
                        </button>
                    </>
                )}
                <button
                    type="button"
                    className="rounded-md border border-slate-200 px-3 py-1.5 text-xs text-slate-600 transition hover:bg-slate-50"
                    onClick={(e) => {
                        e.stopPropagation();
                        if (mode === "private") {
                            handleDeleteChat();
                        } else {
                            handleGroupChatDeletion();
                        }
                    }}
                >
                    Delete {mode === "private" ? "chat" : "group"}
                </button>
            </div>
        </div>
    )
}

export default ChatPageHeader;