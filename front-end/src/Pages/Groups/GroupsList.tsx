import { FiBell, FiBellOff, FiClock, FiMessageCircle, FiMoreVertical, FiUsers } from "react-icons/fi"
import type { Group } from "../../types/group.type";
import { useNavigate } from "react-router-dom";
import { useMessage } from "../../context/MessageProvider";
import { useState } from "react";
import { useGroup } from "../../context/GroupProvider";
import { toast } from "react-toastify";
import useGroupApis from "../../customHooks/useGroupApis";
import { useUser } from "../../context/UserProvider";


interface GroupsListProps {
    listOfgroups: Group[];
    filterGroups: Group[];
    searchInput: string;
}

const GroupsList = ({ listOfgroups, filterGroups, searchInput }: GroupsListProps) => {

    const navigate = useNavigate();

    //state
    const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

    //context
    const { setActiveUserId } = useMessage();
    const { setListOfgroups } = useGroup();
    const { user } = useUser();


    //api calls
    const { MarkGroupPinned, addGroupCategory,muteGroup } = useGroupApis();

    //labels for categories
    const labels = ["Work", "Friends", "Family"];

    const togglePinGroup = (groupId?: string) => {
        try {
            MarkGroupPinned(groupId ?? null);
            setListOfgroups((prevGroups) =>
                prevGroups.map((group) => {
                    if (group.id === groupId) {
                        const isCurrentlyPinned = group.members?.find(member => member.userId === user?.id)?.isPinned;
                        const updatedMembers = group.members?.map(member => {
                            if (member.userId === user?.id) {
                                return { ...member, isPinned: !isCurrentlyPinned };
                            }
                            return member;
                        });
                        return { ...group, members: updatedMembers };
                    }
                    return group;
                })
            );
            setActiveMenuId(null);

        } catch {
            toast.error("Failed to toggle pin status. Please try again.");
        }
    }

    const addCategoryToGroup = (groupId?: string, category?: string) => {
        if (!groupId || !category) return;
        try {
            addGroupCategory(groupId, category);
            setListOfgroups((prevGroups) =>
                prevGroups.map((group) => {
                    if (group.id === groupId) {
                        const updatedMembers = group.members?.map(member => {
                            if (member.userId === user?.id) {
                                return { ...member, categoroy: category };
                            }
                            return member;
                        });
                        return { ...group, members: updatedMembers };
                    }
                    return group;
                })
            );
            setActiveMenuId(null);
        } catch {
            toast.error("Failed to add category. Please try again.");
        }
    }

    const handleMuteGroup = (groupId?: string) => {
        if (!groupId) return;
        try {
            muteGroup(groupId ?? null);
            setListOfgroups((prevGroups) =>
                prevGroups.map((group) => {
                    if (group.id === groupId) {
                        const isCurrentlyMuted = group.members?.find(member => member.userId === user?.id)?.isMuted;
                        const updatedMembers = group.members?.map(member => {
                            if (member.userId === user?.id) {
                                return { ...member, isMuted: !isCurrentlyMuted };
                            }
                            return member;
                        });
                        return { ...group, members: updatedMembers };
                    }
                    return group;
                })
            );
            setActiveMenuId(null);
        } catch {
            toast.error("Failed to toggle mute status. Please try again.");
        }
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {(searchInput.length > 0 ? filterGroups : listOfgroups).map((group) =>
            (
                <div
                    key={searchInput.length > 0 ? group.id : `${group.id}-filtered`}
                    className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm hover:border-slate-300 transition"
                >
                    <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-2xl bg-slate-900 text-white flex items-center justify-center text-sm font-semibold">
                                {group.groupName
                                    .split(" ")
                                    .map((part) => part[0])
                                    .join("")}
                            </div>
                            <div>
                                <div className="text-sm font-semibold text-slate-800">{group.groupName}</div>
                                <div className="text-xs text-slate-500">{group.memberIds.length} members</div>
                                {group.members?.find(member => member.userId === user?.id)?.categoroy && (
                                    <span className="mt-1 inline-flex rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-600">
                                        {group.members?.find(member => member.userId === user?.id)?.categoroy}
                                    </span>
                                )}
                            </div>
                        </div>
                        <div className="relative">
                            <button
                                className="p-2 rounded-lg hover:bg-slate-50 text-slate-400 hover:text-slate-600 transition"
                                onClick={() => setActiveMenuId((prev) => (prev === group.id ? null : String(group.id)))}
                            >
                                <FiMoreVertical className="w-4 h-4" />
                            </button>
                            {activeMenuId === group.id && (
                                <div className="absolute right-0 z-10 mt-1 w-44 rounded-lg border border-slate-200 bg-white p-1 shadow-lg">
                                    <button
                                        className="w-full rounded-md px-3 py-2 text-left text-sm text-slate-700 hover:bg-slate-50"
                                        onClick={() => togglePinGroup(group.id)}
                                    >
                                        {group?.members?.map((member) => {
                                            if (member.userId === user?.id) {
                                                return member.isPinned ? "Unpin group" : "Pin group"
                                            }
                                            return null;
                                        })}

                                    </button>
                                    {labels.map((label) => (
                                        <button
                                            key={`${group.id}-${label}`}
                                            className="w-full rounded-md px-3 py-2 text-left text-sm text-slate-700 hover:bg-slate-50"
                                            onClick={() => addCategoryToGroup(group.id, label)}
                                        >
                                            Add to {label}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="mt-4 flex items-center justify-between">
                        <div className="flex items-center gap-2 text-xs text-slate-500">
                            <FiClock className="w-3.5 h-3.5" />
                        </div>
                        {group.groupMessages.length <= 0 ? (
                            <span className="px-2 py-0.5 rounded-full bg-slate-900 text-white text-xs font-medium">
                                new
                            </span>
                        ) : (
                            <span className="text-xs text-slate-400">No unread</span>
                        )}
                    </div>

                    {group?.members?.map((member) => {
                        if (member.userId === user?.id && member.isPinned) {
                            return <p className="mt-2 text-xs font-medium text-slate-600">Pinned group</p>
                        }
                        return null;
                    })}

                    <div className="mt-4 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <button className="p-2 cursor-pointer rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 transition"
                                onClick={() => { setActiveUserId(String(group.id)); navigate(`/?tab=groups`) }}
                            >
                                <FiMessageCircle className="w-4 h-4"
                                />
                            </button>
                            <button className="p-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 transition">
                                <FiUsers className="w-4 h-4" />
                            </button>
                            <button className="p-2 rounded-lg border cursor-pointer border-slate-200 text-slate-600 hover:bg-slate-50 transition"
                                onClick={() => handleMuteGroup(group.id)}
                            >
                                {group?.members?.find(member => member.userId === user?.id && member.isMuted) ? (
                                    <FiBellOff className="w-4 h-4 text-slate-300" />
                                ) : (
                                    <FiBell className="w-4 h-4 text-slate-600" />
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    )
}

export default GroupsList;
