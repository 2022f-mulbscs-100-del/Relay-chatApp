import { useMemo, useState } from "react";
import CreateGroupModal from "./CreateGroupModal";
import SidePanel from "./SidePanel";
import FilterBar from "./FilterBar";
import GroupsList from "./GroupsList";
import GroupHeader from "./GroupHeader";
import { useGroup } from "../../context/GroupProvider";
import { useUser } from "../../context/UserProvider";

const Groups = () => {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const { listOfgroups, loading: groupsLoading } = useGroup();
  const { user } = useUser();


  const [category, setCategory] = useState<string | null>(null);

const handleCategoryChange = useMemo(() => {
  if (category === null) return listOfgroups;
  return listOfgroups.filter(group =>
    group?.members?.some(member =>
      member.userId === user?.id && member.categoroy === category
    )
  )
}, [category, listOfgroups, user?.id])

  const filterGroups = useMemo(() => {
    if (searchInput.trim() === "") return listOfgroups;
    const query = searchInput.trim();
    return handleCategoryChange.filter((group) => {
      const groupName = group.groupName.toLowerCase();
      return groupName.includes(query.toLowerCase());
    })
  }, [searchInput, listOfgroups,handleCategoryChange])





  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <div className="w-full px-2 md:px-3 py-6">
        <GroupHeader
          setIsCreateOpen={setIsCreateOpen}
        />
        <div className="mt-6 grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-4">
          <SidePanel
            category={category}
            setCategory={setCategory}
          />

          <section className="space-y-4">
            <FilterBar searchInput={searchInput} setSearchInput={setSearchInput} />
            <GroupsList listOfgroups={handleCategoryChange} filterGroups={filterGroups} searchInput={searchInput} isLoading={groupsLoading} />
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
