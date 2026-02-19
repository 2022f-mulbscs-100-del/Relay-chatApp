import { FiFilter, FiSearch } from "react-icons/fi"

interface FilterBarProps {
  setSearchInput: React.Dispatch<React.SetStateAction<string>>;
  searchInput: string;
}
const FilterBar = ({ setSearchInput, searchInput }: FilterBarProps) => {
    return(
           <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
              <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-600">
                  <FiSearch className="w-4 h-4 text-slate-400" />
                  <input className="w-full outline-none"
                   placeholder="Search groups"
                   value={searchInput}
                   onChange={(e) => setSearchInput(e.target.value)}
                   />
                </div>
                <div className="flex items-center gap-2">
                  <button className="px-3 py-2 rounded-lg border border-slate-200 text-sm text-slate-700 hover:bg-slate-50 transition">
                    <FiFilter className="w-4 h-4 inline-block mr-2" />
                    Filters
                  </button>
                </div>
              </div>
            </div>
    )
}

export default FilterBar;