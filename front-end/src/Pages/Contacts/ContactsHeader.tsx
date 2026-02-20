import { FiDownload, FiPlus } from "react-icons/fi"

const ContactHeader = () => {
    return (
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
    )
}


export default ContactHeader;