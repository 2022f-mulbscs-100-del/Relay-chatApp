import { useMemo, useState } from "react";
import CreateGroupModal from "./CreateGroupModal";
import SidePanel from "./SidePanel";
import FilterBar from "./FilterBar";
import GroupsList from "./GroupsList";
import GroupHeader from "./GroupHeader";
import { useGroup } from "../../context/GroupProvider";

const Groups = () => {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const { listOfgroups } = useGroup();

  const filterGroups = useMemo(() => {
    if (searchInput.trim() === "") return listOfgroups;
    const query = searchInput.trim();
    return listOfgroups.filter((group) => {
      const groupName = group.groupName.toLowerCase();
      return groupName.includes(query.toLowerCase());
    })
  },[searchInput, listOfgroups])


  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <div className="w-full px-2 md:px-3 py-6">
        <GroupHeader
          setIsCreateOpen={setIsCreateOpen}
        />
        <div className="mt-6 grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-4">
          <SidePanel />

          <section className="space-y-4">
            <FilterBar searchInput={searchInput} setSearchInput={setSearchInput} />
            <GroupsList listOfgroups={listOfgroups} filterGroups={filterGroups} searchInput={searchInput} />
          </section>
        </div>
      </div>

      {isCreateOpen && (
        <CreateGroupModal setIsCreateOpen={setIsCreateOpen} />
      )}
    </div>
  );
};

export default Groups;
