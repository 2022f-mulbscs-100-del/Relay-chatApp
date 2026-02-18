import { FiMail } from "react-icons/fi"

const EmailPrefrencesSetting = () => {

    return (
        <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
                <FiMail className="w-4 h-4 text-slate-500" />
                <h2 className="text-sm font-semibold text-slate-700">Email preferences</h2>
            </div>
            <div className="space-y-3 text-sm text-slate-600">
                <div className="flex items-start justify-between gap-4">
                    <div>
                        <div className="font-medium text-slate-800">Product updates</div>
                        <div className="text-xs text-slate-500">News and feature announcements</div>
                    </div>
                    <button className="px-3 py-1.5 rounded-md border border-slate-200 text-xs font-medium text-slate-700 hover:bg-slate-50 transition">
                        Subscribed
                    </button>
                </div>
                <div className="flex items-start justify-between gap-4">
                    <div>
                        <div className="font-medium text-slate-800">Security alerts</div>
                        <div className="text-xs text-slate-500">Login and account changes</div>
                    </div>
                    <button className="px-3 py-1.5 rounded-md bg-slate-900 text-white text-xs font-medium hover:bg-slate-800 transition">
                        Required
                    </button>
                </div>
            </div>
        </section>
    )
}

export default EmailPrefrencesSetting;