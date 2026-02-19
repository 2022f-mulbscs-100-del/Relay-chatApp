import { useState } from "react";
import { FiBookmark, FiChevronDown } from "react-icons/fi";
import { useGroup } from "../../context/GroupProvider";

const SidePanel = () => {
  const {listOfgroups} = useGroup();


  const categories = [
    { label: "All groups", count: listOfgroups.length, active: true },
    { label: "Work", count: 6 },
    { label: "Friends", count: 8 },
    { label: "Family", count: 4 },
  ];

  const [categoriesListOpen, setCategoriesListOpen] = useState(false);

  return (
    <>
      <aside className="space-y-4">
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold text-slate-700">Categories</h2>
            <FiChevronDown className="w-4 h-4 text-slate-400 cursor-pointer" 
            onClick={()=>{setCategoriesListOpen(!categoriesListOpen)}}
            />
          </div>
    {categoriesListOpen && (
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
          </div>)}
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold text-slate-700">Pinned groups</h2>
            <FiBookmark className="w-4 h-4 text-slate-400" />
          </div>

        </div>
      </aside>
    </>
  )
}

export default SidePanel;