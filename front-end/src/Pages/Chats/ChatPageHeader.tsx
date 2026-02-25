import { useEffect, useRef, useState } from "react";
import { FiChevronLeft, FiInfo, FiMoreVertical } from "react-icons/fi";
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
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const handleOutsideClick = (event: MouseEvent) => {
            if (!menuRef.current) return;
            if (!menuRef.current.contains(event.target as Node)) {
                setIsMenuOpen(false);
            }
        };

        document.addEventListener("mousedown", handleOutsideClick);
        return () => {
            document.removeEventListener("mousedown", handleOutsideClick);
        };
    }, []);

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
            <div className="flex min-w-0 flex-1 items-center gap-3">
                <button
                    type="button"
                    onClick={onBack}
                    className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-600 transition hover:bg-slate-50 md:hidden"
                    aria-label="Back to chats"
                >
                    <FiChevronLeft className="h-4 w-4" />
                </button>
                <div className="relative h-11 w-11 shrink-0 rounded-full ring-2 ring-slate-200">
                    <img className="h-full w-full rounded-full object-cover" src={filterUser?.associatedUser.ImageUrl || "/153608270.jpeg"} alt={filterUser?.associatedUser?.username || "chat user"} />
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
            <div className="relative ml-2 shrink-0" ref={menuRef}>
                <button
                    type="button"
                    className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 transition hover:bg-slate-50"
                    aria-label="Open chat actions"
                    onClick={() => setIsMenuOpen((prev) => !prev)}
                >
                    <FiMoreVertical className="h-4 w-4" />
                </button>

                {isMenuOpen && (
                    <div className="absolute right-0 top-11 z-30 w-44 rounded-lg border border-slate-200 bg-white p-1.5 shadow-lg">
                        {mode === "private" ? (
                            <>
                                <button
                                    type="button"
                                    className="flex w-full items-center gap-2 rounded-md px-2.5 py-2 text-left text-xs text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                                    onClick={() => {
                                        setIsProfileModalOpen(true);
                                        setIsMenuOpen(false);
                                    }}
                                    disabled={!filterUser}
                                >
                                    <FiInfo className="h-4 w-4" />
                                    View profile
                                </button>
                                <button
                                    type="button"
                                    className="flex w-full items-center rounded-md px-2.5 py-2 text-left text-xs text-slate-700 transition hover:bg-slate-50"
                                    onClick={() => {
                                        handleMuteToggle?.();
                                        setIsMenuOpen(false);
                                    }}
                                >
                                    {foundUser?.isMuted ? "Unmute" : "Mute"}
                                </button>
                            </>
                        ) : (
                            <>
                                <button
                                    type="button"
                                    className="flex w-full items-center rounded-md px-2.5 py-2 text-left text-xs text-slate-700 transition hover:bg-slate-50"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setIsAddMemberModalOpen(true);
                                        setIsMenuOpen(false);
                                    }}
                                >
                                    Add member
                                </button>
                                <button
                                    type="button"
                                    className="flex w-full items-center rounded-md px-2.5 py-2 text-left text-xs text-slate-700 transition hover:bg-slate-50"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setIsGroupMemberModalOpen(true);
                                        setIsMenuOpen(false);
                                    }}
                                >
                                    Members ({filterGroup?.memberIds?.length || 0})
                                </button>
                                <button
                                    type="button"
                                    className="flex w-full items-center rounded-md px-2.5 py-2 text-left text-xs text-rose-600 transition hover:bg-rose-50"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setIsLeaveGroupModalOpen(true);
                                        setIsMenuOpen(false);
                                    }}
                                >
                                    Leave group
                                </button>
                            </>
                        )}
                        <button
                            type="button"
                            className="flex w-full items-center rounded-md px-2.5 py-2 text-left text-xs text-rose-600 transition hover:bg-rose-50"
                            onClick={(e) => {
                                e.stopPropagation();
                                if (mode === "private") {
                                    handleDeleteChat();
                                } else {
                                    handleGroupChatDeletion();
                                }
                                setIsMenuOpen(false);
                            }}
                        >
                            Delete {mode === "private" ? "chat" : "group"}
                        </button>
                    </div>
                )}
            </div>
        </div>
    )
}

export default ChatPageHeader;
