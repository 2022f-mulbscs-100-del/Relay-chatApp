import { FiMail } from "react-icons/fi"

const EmailPrefrencesSetting = () => {

    return (
        <section className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-6 shadow-sm transition-colors duration-200">
            <div className="flex items-center gap-2 mb-4">
                <FiMail className="w-4 h-4 text-slate-500 dark:text-slate-400" />
                <h2 className="text-sm font-semibold text-slate-700 dark:text-slate-300">Email preferences</h2>
            </div>
            <div className="space-y-3 text-sm text-slate-600 dark:text-slate-400">
                <div className="flex items-start justify-between gap-4">
                    <div>
                        <div className="font-medium text-slate-800 dark:text-slate-200">Product updates</div>
                        <div className="text-xs text-slate-500 dark:text-slate-400">News and feature announcements</div>
                    </div>
                    <button className="px-3 py-1.5 rounded-md border border-slate-200 dark:border-slate-600 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition">
                        Subscribed
                    </button>
                </div>
                <div className="flex items-start justify-between gap-4">
                    <div>
                        <div className="font-medium text-slate-800 dark:text-slate-200">Security alerts</div>
                        <div className="text-xs text-slate-500 dark:text-slate-400">Login and account changes</div>
                    </div>
                    <button className="px-3 py-1.5 rounded-md bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-medium hover:bg-slate-800 dark:hover:bg-slate-100 transition">
                        Required
                    </button>
                </div>
            </div>
        </section>
    )
}

export default EmailPrefrencesSetting;