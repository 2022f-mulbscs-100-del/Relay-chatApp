import { FiUser } from "react-icons/fi";
import type { User } from "../../types/user.type";

interface UserProfileSettingProps {
    user: User | null;
    HandleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}
const UserProfileSetting = ({ user, HandleChange }: UserProfileSettingProps) => {

    return (
        <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
                <FiUser className="w-4 h-4 text-slate-500" />
                <h2 className="text-sm font-semibold text-slate-700">Account</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <label className="text-sm">
                    <span className="text-slate-500">Full name</span>
                    <input
                        className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-slate-400"
                        defaultValue="Alex Morgan"
                        type="text"
                        value={user?.username}
                        name="username"
                        onChange={HandleChange}
                    />
                </label>
                <label className="text-sm">
                    <span className="text-slate-500">Username</span>
                    <input
                        className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-slate-400"
                        defaultValue="@alexmorgan"
                        value={`@${user?.username}`}
                        name="username"
                        onChange={HandleChange}
                    />
                </label>
                <label className="text-sm">
                    <span className="text-slate-500">Email</span>
                    <input
                        className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-slate-400"
                        defaultValue="alex.morgan@email.com"
                        value={user?.email}
                        name="email"
                        onChange={HandleChange}
                    />
                </label>
                <label className="text-sm">
                    <span className="text-slate-500">Phone</span>
                    <input
                        className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-slate-400"
                        defaultValue="+1 (555) 123-4567"
                        value={user?.phone}
                        name="phone"
                        onChange={HandleChange}
                    />
                </label>
                <label className="text-sm">
                    <span className="text-slate-500">Location</span>
                    <input
                        className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-slate-400"
                        defaultValue="San Francisco, CA"
                        value={user?.location}
                        name="location"
                        onChange={HandleChange}
                    />
                </label>
            </div>
        </section>
    )
}

export default UserProfileSetting;