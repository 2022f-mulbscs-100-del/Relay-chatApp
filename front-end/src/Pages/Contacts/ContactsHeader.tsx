import { FiDownload, FiPlus } from "react-icons/fi"

const ContactHeader = () => {
    return (
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
                <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">Contacts</h1>
                <p className="text-sm text-slate-500 dark:text-slate-400">Manage and organize people you chat with</p>
            </div>
            <div className="flex items-center gap-2">
                <button className="px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-600 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition">
                    <FiDownload className="w-4 h-4 inline-block mr-2" />
                    Export
                </button>
                <button className="px-3 py-2 rounded-lg bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-sm font-medium hover:bg-slate-800 dark:hover:bg-slate-100 transition">
                    <FiPlus className="w-4 h-4 inline-block mr-2" />
                    Add contact
                </button>
            </div>
        </div>
    )
}


export default ContactHeader;