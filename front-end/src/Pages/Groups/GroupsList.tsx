import { FiBell, FiBellOff, FiClock, FiMessageCircle, FiMoreVertical, FiUsers } from "react-icons/fi"
import type { Group } from "../../types/group.type";
import { useNavigate } from "react-router-dom";
import { useMessage } from "../../context/MessageProvider";
import { useState } from "react";


interface GroupsListProps {
    listOfgroups: Group[];
    filterGroups: Group[];
    searchInput: string;
}

const GroupsList = ({ listOfgroups, filterGroups, searchInput }: GroupsListProps) => {

    const navigate = useNavigate();
    const { setActiveUserId } = useMessage();
    const [bell, setBell] = useState("");
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
                            </div>
                        </div>
                        <button className="p-2 rounded-lg hover:bg-slate-50 text-slate-400 hover:text-slate-600 transition">
                            <FiMoreVertical className="w-4 h-4" />
                        </button>
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
                                onClick={() => setBell((prev)=>(prev === group.id ? "" : String(group.id)))}
                            >
                                {bell === group.id ?
                                    <FiBell className="w-4 h-4 text-slate-600" />
                                    :
                                    <FiBellOff className="w-4 h-4 text-slate-300" />
                                }
                            </button>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    )
}

export default GroupsList;