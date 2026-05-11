import { FiLogOut } from "react-icons/fi"

const LogoutCardSetting = ({ logout }: { logout: () => void }) => {

    return (
        <section className="rounded-xl border border-rose-200 dark:border-rose-900/50 bg-rose-50 dark:bg-rose-900/10 p-6 shadow-sm transition-colors duration-200">
            <div className="flex items-center gap-2 mb-3 "
            >
                <FiLogOut className="w-4 h-4 text-rose-600 dark:text-rose-400" />
                <h2 className="text-sm font-semibold text-rose-700 dark:text-rose-300"
                >Log out</h2>
            </div>
            <p className="text-xs text-rose-600 dark:text-rose-400 mb-4">Sign out of your account on this device.</p>
            <button
                onClick={logout}
                className="w-full cursor-pointer px-3 py-2 rounded-lg bg-rose-600 dark:bg-rose-700 text-white text-sm font-medium hover:bg-rose-700 dark:hover:bg-rose-600 transition">
                Log out
            </button>
        </section>

    )
}

export default LogoutCardSetting;