import { FiBell } from "react-icons/fi"
import { useUserApis } from "../../customHooks/useUserApis";
import { toast } from "react-toastify";
import { useState } from "react";
import { useUser } from "../../context/UserProvider";

const NotificationSetting = () => {

    const { messageAlertToggle } = useUserApis();
    const { user } = useUser();
    const [messageAlertEnabled, setMessageAlertEnabled] = useState(user?.messageAlerts ?? false);
    // ?? checks only for null or undefined

    const HandleAlertToggle = () => {
        setMessageAlertEnabled(!messageAlertEnabled);
        try {
            messageAlertToggle();
           

        } catch {
            toast.error("Failed to toggle message alerts");
        }
    }

    return (
        <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
                <FiBell className="w-4 h-4 text-slate-500" />
                <h2 className="text-sm font-semibold text-slate-700">Notifications</h2>
            </div>
            <div className="space-y-3 text-sm">
                <label className="flex items-center justify-between">
                    <span>Message alerts</span>

                    <span className={`w-10 h-6 rounded-full cursor-pointer ${messageAlertEnabled ? "bg-slate-900" : "bg-slate-200"} relative`}
                        onClick={HandleAlertToggle}

                    >
                        <span className={`absolute ${messageAlertEnabled ? "right-1" : "left-1"} top-1 w-4 h-4 rounded-full bg-white`} />
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