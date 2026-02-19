import { FiFilter, FiPlus } from "react-icons/fi"

interface GroupHeaderProps {
    setIsCreateOpen: React.Dispatch<React.SetStateAction<boolean>>;
}
const GroupHeader = ({ setIsCreateOpen }: GroupHeaderProps) => {

    return (
        <>
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
        </>
    )
}

export default GroupHeader