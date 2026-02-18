import { FiBell, FiLogOut, FiSettings, FiShield } from "react-icons/fi";
import { toast } from "react-toastify";
import { useAuthCall } from "../../customHooks/useAuthCall";

const SettingCard = () => {

    const settings = [
        { id: 1, icon: FiBell, label: 'Notifications', description: 'Manage notification preferences' },
        { id: 2, icon: FiShield, label: 'Privacy & Security', description: 'Control your privacy settings' },
        { id: 3, icon: FiSettings, label: 'Account Settings', description: 'Update your account details' },
        { id: 4, icon: FiLogOut, label: 'Log Out', description: 'Sign out of your account', danger: true }
    ];

      const {logout} = useAuthCall();
    

    const Logout = async () => {
        try {
            await logout();

        } catch (error) {
            toast.error(String(error));
        }
    }
    return (
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm w-full">
            <h2 className="text-sm font-semibold text-slate-700 mb-3">Settings</h2>
            <div className="space-y-1">
                {settings.map((setting, index) => {
                    const Icon = setting.icon;
                    return (
                        <button
                            key={index}
                            className={` cursor-pointer w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition ${setting.danger
                                ? 'text-rose-600 hover:bg-rose-50'
                                : 'text-slate-700 hover:bg-slate-50'
                                }`}
                            onClick={() => {
                                if (setting.label === 'Log Out') {
                                    Logout();
                                }

                            }}
                        >
                            <Icon className="w-4 h-4" />
                            <div className="flex-1">
                                <div className="text-sm font-medium">{setting.label}</div>
                                <div className="text-xs text-slate-500">{setting.description}</div>
                            </div>
                        </button>
                    );
                })}
            </div>
        </div>
    )
}

export default SettingCard;