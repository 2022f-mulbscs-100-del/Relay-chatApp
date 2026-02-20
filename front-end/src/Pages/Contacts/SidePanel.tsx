import { useState } from "react";
import { FiUsers } from "react-icons/fi";

const SidePanel = () => {

    const groups = [
        { label: "All contacts", count: 328 },
        { label: "Favorites", count: 24 },
        { label: "Work", count: 96 },
        { label: "Family", count: 18 },
        { label: "Blocked", count: 5 },
    ];

    const [dropDownOpen, setDropdownOpen] = useState(false);
    const [selectedGroup, setSelectedGroup] = useState("All contacts");


    return (
        <aside className="space-y-6">
            <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                <div className={`flex items-center justify-between ${dropDownOpen ? "mb-3" : ""}`}>
                    <h2 className="text-sm font-semibold text-slate-700">Groups</h2>
                    <FiUsers className="w-4 h-4 text-slate-400 cursor-pointer" onClick={() => setDropdownOpen(!dropDownOpen)} />
                </div>
                {dropDownOpen &&
                    <div className="space-y-1 text-sm">
                        {groups.map((group) => (
                            <button
                                key={group.label}
                                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-left transition ${selectedGroup === group.label ? "bg-slate-900 text-white" : "text-slate-700 hover:bg-slate-50"
                                    }`}

                                onClick={() => {
                                    setSelectedGroup(group.label);
                                }}
                            >
                                <span>{group.label}</span>
                                <span className={`text-xs ${selectedGroup === group.label ? "text-white/80" : "text-slate-400"}`}>
                                    {group.count}
                                </span>
                            </button>
                        ))}
                    </div>
                }
            </div>

            {/* <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                <div className="flex items-center justify-between mb-3">
                    <h2 className="text-sm font-semibold text-slate-700">Quick filters</h2>
                    <FiFilter className="w-4 h-4 text-slate-400" />
                </div>
                <div className="space-y-2">
                    <button className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm text-slate-700 hover:bg-slate-50 transition">
                        Recently active
                    </button>
                    <button className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm text-slate-700 hover:bg-slate-50 transition">
                        Unread messages
                    </button>
                    <button className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm text-slate-700 hover:bg-slate-50 transition">
                        Needs follow-up
                    </button>
                </div>
            </div> */}
        </aside>

    );
};

export default SidePanel;