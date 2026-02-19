import { FiBell } from "react-icons/fi"

const NotificationSetting = () => {

    return (
        <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
                <FiBell className="w-4 h-4 text-slate-500" />
                <h2 className="text-sm font-semibold text-slate-700">Notifications</h2>
            </div>
            <div className="space-y-3 text-sm">
                <label className="flex items-center justify-between">
                    <span>Message alerts</span>
                    <span className="w-10 h-6 rounded-full bg-slate-900 relative">
                        <span className="absolute right-1 top-1 w-4 h-4 rounded-full bg-white" />
                    </span>
                </label>
                <label className="flex items-center justify-between">
                    <span>Mentions</span>
                    <span className="w-10 h-6 rounded-full bg-slate-200 relative">
                        <span className="absolute left-1 top-1 w-4 h-4 rounded-full bg-white" />
                    </span>
                </label>
                <label className="flex items-center justify-between">
                    <span>Email summaries</span>
                    <span className="w-10 h-6 rounded-full bg-slate-200 relative">
                        <span className="absolute left-1 top-1 w-4 h-4 rounded-full bg-white" />
                    </span>
                </label>
            </div>
        </section>
    )
}

export default NotificationSetting;