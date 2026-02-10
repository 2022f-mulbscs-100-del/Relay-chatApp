import { useEffect, useState } from "react";
import { FiBell, FiBookmark, FiCalendar, FiChevronDown, FiClock, FiFilter, FiMessageCircle, FiMoreVertical, FiPlus, FiSearch, FiUsers } from "react-icons/fi";
import CreateGroupModal from "./CreateGroupModal";
import { useSocket } from "../../context/SocketProvider";
import { useGroup } from "../../context/GroupProvider";

const Groups = () => {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const socket = useSocket();
  const {groups} = useGroup();

  useEffect(() => {
    if (!socket) return;

    socket.on("group_created", (data) => {
      console.log("Group created:", data);
    });

    return () => {
      socket.off("group_created");
    };
  }, [socket]);



  const categories = [
    { label: "All groups", count: 18, active: true },
    { label: "Workspaces", count: 6 },
    { label: "Teams", count: 8 },
    { label: "Social", count: 4 },
  ];


  const upcoming = [
    { title: "Design review", time: "Tomorrow · 10:30 AM", group: "Design Team" },
    { title: "Sprint planning", time: "Thu · 9:00 AM", group: "Product Sync" },
    { title: "Launch checklist", time: "Fri · 2:00 PM", group: "Marketing Launch" },
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <div className="w-full px-2 md:px-3 py-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-semibold">Groups</h1>
            <p className="text-sm text-slate-500">Organize conversations by teams and topics</p>
          </div>
          <div className="flex items-center gap-2">
            <button className="px-3 py-2 rounded-lg border border-slate-200 text-sm font-medium text-slate-700 hover:bg-slate-50 transition">
              <FiFilter className="w-4 h-4 inline-block mr-2" />
              Filters
            </button>
            <button
              className="px-3 py-2 rounded-lg bg-slate-900 text-white text-sm font-medium hover:bg-slate-800 transition"
              onClick={() => setIsCreateOpen(true)}
            >
              <FiPlus className="w-4 h-4 inline-block mr-2" />
              Create group
            </button>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 lg:grid-cols-[260px_1fr_320px] gap-4">
          <aside className="space-y-4">
            <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-sm font-semibold text-slate-700">Categories</h2>
                <FiChevronDown className="w-4 h-4 text-slate-400" />
              </div>
              <div className="space-y-1 text-sm">
                {categories.map((category) => (
                  <button
                    key={category.label}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-left transition ${category.active ? "bg-slate-900 text-white" : "text-slate-700 hover:bg-slate-50"
                      }`}
                  >
                    <span>{category.label}</span>
                    <span className={`text-xs ${category.active ? "text-white/80" : "text-slate-400"}`}>
                      {category.count}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-sm font-semibold text-slate-700">Pinned groups</h2>
                <FiBookmark className="w-4 h-4 text-slate-400" />
              </div>
              {/* <div className="space-y-2 text-sm text-slate-700">
                {groups
                  .filter((group) => group.pinned)
                  .map((group) => (
                    <div key={group.groupName} className="flex items-center justify-between rounded-lg border border-slate-200 px-3 py-2">
                      <div>
                        <div className="font-medium">{group.groupName}</div>
                        <div className="text-xs text-slate-500">{group.memberIds.length} members</div>
                      </div>
                      <FiStar className="w-4 h-4 text-amber-500" />
                    </div>
                  ))}
              </div> */}
            </div>
          </aside>

          <section className="space-y-4">
            <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
              <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-600">
                  <FiSearch className="w-4 h-4 text-slate-400" />
                  <input className="w-full outline-none" placeholder="Search groups" />
                </div>
                <div className="flex items-center gap-2">
                  <button className="px-3 py-2 rounded-lg border border-slate-200 text-sm text-slate-700 hover:bg-slate-50 transition">
                    Sort: Activity
                  </button>
                  <button className="px-3 py-2 rounded-lg border border-slate-200 text-sm text-slate-700 hover:bg-slate-50 transition">
                    <FiFilter className="w-4 h-4 inline-block mr-2" />
                    Filters
                  </button>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {groups.map((group) => (
                <div
                  key={group.groupName}
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
                      {/* <span>{group.activity}</span> */}
                    </div>
                    {group.groupMessages.length > 0 ? (
                      <span className="px-2 py-0.5 rounded-full bg-slate-900 text-white text-xs font-medium">
                        {group.groupMessages} new
                      </span>
                    ) : (
                      <span className="text-xs text-slate-400">No unread</span>
                    )}
                  </div>

                  <div className="mt-4 flex items-center justify-between">
                    {/* <span className="px-2 py-1 rounded-md bg-slate-100 text-xs font-medium text-slate-600">
                      {group.tag}
                    </span> */}
                    <div className="flex items-center gap-2">
                      <button className="p-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 transition">
                        <FiMessageCircle className="w-4 h-4" />
                      </button>
                      <button className="p-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 transition">
                        <FiUsers className="w-4 h-4" />
                      </button>
                      <button className="p-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 transition">
                        <FiBell className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <aside className="space-y-4">
            <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-sm font-semibold text-slate-700">Upcoming</h2>
                <FiCalendar className="w-4 h-4 text-slate-400" />
              </div>
              <div className="space-y-3 text-sm">
                {upcoming.map((item) => (
                  <div key={item.title} className="rounded-lg border border-slate-200 px-3 py-2">
                    <div className="font-medium text-slate-800">{item.title}</div>
                    <div className="text-xs text-slate-500">{item.time}</div>
                    <div className="mt-1 text-xs text-slate-400">{item.group}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-sm font-semibold text-slate-700">Group rules</h2>
                <FiMessageCircle className="w-4 h-4 text-slate-400" />
              </div>
              <div className="space-y-2 text-xs text-slate-500">
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  Keep discussions on topic.
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  Respect quiet hours after 9 PM.
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  Share files in appropriate channels.
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>

      {isCreateOpen && (
        <CreateGroupModal setIsCreateOpen={setIsCreateOpen} />
      )}
    </div>
  );
};

export default Groups;
