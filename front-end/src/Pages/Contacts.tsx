import { FiDownload, FiFilter, FiMessageCircle, FiMoreVertical, FiPhone, FiPlus, FiSearch, FiStar, FiUsers, FiVideo } from "react-icons/fi";

const Contacts = () => {
  const groups = [
    { label: "All contacts", count: 328, active: true },
    { label: "Favorites", count: 24 },
    { label: "Work", count: 96 },
    { label: "Family", count: 18 },
    { label: "Blocked", count: 5 },
  ];

  const contacts = [
    { name: "Sarah Liu", title: "Product Manager", status: "Online", tag: "Work", lastSeen: "Active now", favorite: true },
    { name: "Mike Harper", title: "UX Designer", status: "Online", tag: "Work", lastSeen: "Active now" },
    { name: "Nora Vega", title: "QA Lead", status: "Away", tag: "Work", lastSeen: "5 min ago" },
    { name: "Aiden Park", title: "Software Engineer", status: "Offline", tag: "Work", lastSeen: "1 hr ago" },
    { name: "Julia Carter", title: "Marketing", status: "Away", tag: "Family", lastSeen: "12 min ago" },
    { name: "Omar Farouk", title: "Finance", status: "Offline", tag: "Work", lastSeen: "Yesterday" },
    { name: "Elena Rossi", title: "HR", status: "Online", tag: "Work", lastSeen: "Active now" },
    { name: "Priya Singh", title: "Legal", status: "Offline", tag: "Family", lastSeen: "2 days ago" },
  ];

  const statusDot = (status: string) => {
    if (status === "Online") return "bg-emerald-500";
    if (status === "Away") return "bg-amber-500";
    return "bg-slate-300";
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <div className="w-full px-2 md:px-3 py-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-semibold">Contacts</h1>
            <p className="text-sm text-slate-500">Manage and organize people you chat with</p>
          </div>
          <div className="flex items-center gap-2">
            <button className="px-3 py-2 rounded-lg border border-slate-200 text-sm font-medium text-slate-700 hover:bg-slate-50 transition">
              <FiDownload className="w-4 h-4 inline-block mr-2" />
              Export
            </button>
            <button className="px-3 py-2 rounded-lg bg-slate-900 text-white text-sm font-medium hover:bg-slate-800 transition">
              <FiPlus className="w-4 h-4 inline-block mr-2" />
              Add contact
            </button>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 lg:grid-cols-[240px_1fr] gap-4">
          <aside className="space-y-6">
            <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-sm font-semibold text-slate-700">Groups</h2>
                <FiUsers className="w-4 h-4 text-slate-400" />
              </div>
              <div className="space-y-1 text-sm">
                {groups.map((group) => (
                  <button
                    key={group.label}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-left transition ${
                      group.active ? "bg-slate-900 text-white" : "text-slate-700 hover:bg-slate-50"
                    }`}
                  >
                    <span>{group.label}</span>
                    <span className={`text-xs ${group.active ? "text-white/80" : "text-slate-400"}`}>
                      {group.count}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
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
            </div>
          </aside>

          <section className="space-y-4">
            <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
              <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-600">
                  <FiSearch className="w-4 h-4 text-slate-400" />
                  <input className="w-full outline-none" placeholder="Search contacts" />
                </div>
                <div className="flex items-center gap-2">
                  <button className="px-3 py-2 rounded-lg border border-slate-200 text-sm text-slate-700 hover:bg-slate-50 transition">
                    Sort: Recent
                  </button>
                  <button className="px-3 py-2 rounded-lg border border-slate-200 text-sm text-slate-700 hover:bg-slate-50 transition">
                    <FiFilter className="w-4 h-4 inline-block mr-2" />
                    Filters
                  </button>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {contacts.map((contact) => (
                <div
                  key={contact.name}
                  className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm hover:border-slate-300 transition"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <div className="w-12 h-12 rounded-full bg-slate-200 flex items-center justify-center text-sm font-semibold text-slate-700">
                          {contact.name
                            .split(" ")
                            .map((part) => part[0])
                            .join("")}
                        </div>
                        <span className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white ${statusDot(contact.status)}`} />
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-slate-800 flex items-center gap-2">
                          {contact.name}
                          {contact.favorite && <FiStar className="w-3.5 h-3.5 text-amber-500" />}
                        </div>
                        <div className="text-xs text-slate-500">{contact.title}</div>
                        <div className="text-xs text-slate-400 mt-1">{contact.lastSeen}</div>
                      </div>
                    </div>
                    <button className="p-2 rounded-lg hover:bg-slate-50 text-slate-400 hover:text-slate-600 transition">
                      <FiMoreVertical className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="mt-4 flex items-center justify-between">
                    <span className="px-2 py-1 rounded-md bg-slate-100 text-xs font-medium text-slate-600">
                      {contact.tag}
                    </span>
                    <div className="flex items-center gap-2">
                      <button className="p-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 transition">
                        <FiMessageCircle className="w-4 h-4" />
                      </button>
                      <button className="p-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 transition">
                        <FiPhone className="w-4 h-4" />
                      </button>
                      <button className="p-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 transition">
                        <FiVideo className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Contacts;
