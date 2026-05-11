interface SettingHeaderProps {
    saveChange: () => void;
}
const SettingHeader = ({saveChange}: SettingHeaderProps) => {
    return (
        <div className="flex items-center justify-between">
            <div>
                <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">Settings</h1>
                <p className="text-sm text-slate-500 dark:text-slate-400">Manage your account and preferences</p>
            </div>
            <button onClick={saveChange} className="cursor-pointer px-4 py-2 rounded-lg bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-sm font-medium hover:bg-slate-800 dark:hover:bg-slate-100 transition">
                Save changes
            </button>
        </div>
    )
}


export default SettingHeader;