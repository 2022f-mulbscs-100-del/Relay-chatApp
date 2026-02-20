import { useState } from "react";
import {  FiChevronDown } from "react-icons/fi";
import { useGroup } from "../../context/GroupProvider";
import { useUser } from "../../context/UserProvider";

interface SidePanelProps {
  category: string | null;
  setCategory: React.Dispatch<React.SetStateAction<string | null>>;
}
const SidePanel = (
  {
    category,
    setCategory
  }: SidePanelProps
) => {
  const { listOfgroups } = useGroup();
const { user } = useUser();

  const categories = [
    { label: "All groups", count: listOfgroups.length, active: category === null },
    { label: "Work", count: listOfgroups.filter(group => group?.members?.some(member => member.categoroy === "Work")).length, active: category === "Work" },
    { label: "Friends", count: listOfgroups.filter(group => group?.members?.some(member => member.categoroy === "Friends")).length, active: category === "Friends" },
    { label: "Family", count: listOfgroups.filter(group => group?.members?.some(member => member.userId === user?.id && member.categoroy === "Family")).length, active: category === "Family" },
  ];

  const [categoriesListOpen, setCategoriesListOpen] = useState(false);

  return (
    <>
      <aside className="space-y-4">
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className={`flex items-center justify-between ${categoriesListOpen ? "mb-3" : ""}`}>
            <h2 className="text-sm font-semibold text-slate-700">Categories</h2>
            <FiChevronDown className="w-4 h-4 text-slate-400 cursor-pointer"
              onClick={() => { setCategoriesListOpen(!categoriesListOpen) }}
            />
          </div>
          {categoriesListOpen && (
            <div className="space-y-1 text-sm">
              {categories.map((category) => (
                <button
                  key={category.label}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-left transition ${category.active ? "bg-slate-900 text-white" : "text-slate-700 hover:bg-slate-50"
                    }`}
                  onClick={() => {
                    if (category.label === "All groups") {
                      setCategory(null);
                      return;
                    }
                    setCategory(category.active ? null : category.label);
                  }}
                >
                  <span>{category.label}</span>
                  <span className={`text-xs ${category.active ? "text-white/80" : "text-slate-400"}`}>
                    {category.count}
                  </span>
                </button>
              ))}
            </div>)}
        </div>
{/* 
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold text-slate-700">Pinned groups</h2>
            <FiBookmark className="w-4 h-4 text-slate-400" />
          </div>

        </div> */}
      </aside>
    </>
  )
}

export default SidePanel;