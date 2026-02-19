import { FiLogOut } from "react-icons/fi"

const LogoutCardSetting = ({ logout }: { logout: () => void }) => {

    return (
        <section className="rounded-xl border border-rose-200 bg-rose-50 p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-3 "
            >
                <FiLogOut className="w-4 h-4 text-rose-600" />
                <h2 className="text-sm font-semibold text-rose-700 "
                >Log out</h2>
            </div>
            <p className="text-xs text-rose-600 mb-4">Sign out of your account on this device.</p>
            <button
                onClick={logout}
                className="w-full cursor-pointer px-3 py-2 rounded-lg bg-rose-600 text-white text-sm font-medium hover:bg-rose-700 transition">
                Log out
            </button>
        </section>

    )
}

export default LogoutCardSetting;