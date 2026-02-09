import { FiBell, FiCreditCard, FiKey, FiLock, FiLogOut, FiMail, FiShield, FiSmartphone, FiUser } from "react-icons/fi";
import { useAuthCall } from "../customHooks/useAuthCall";
import { useUser } from "../context/UserProvider";
import { toast } from "react-toastify";
import { useUserApis } from "../customHooks/useUserApis";
import { useState } from "react";
import ChangePasswordModal from "../Component/ChangePasswordModal";

const Settings = () => {
  const {logout} = useAuthCall();
  const {user,setUser} = useUser();
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);

const HandleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const { name, value } = e.target;
  switch (name) {
    case "username":
      setUser((prev) => prev ? {...prev, username: value} : prev);
      break;
    case "email":
      setUser((prev) => prev ? {...prev, email: value} : prev);
      break;
    case "phone":
      setUser((prev) => prev ? {...prev, phone: value} : prev);
      break;
    case "location":
      setUser((prev) => prev ? {...prev, location: value} : prev);
      break;
    default:
      break;
  }
};

const {UpdateProfile} = useUserApis();
const SaveChange = async () => {
  if(user){
    try {
      await UpdateProfile(user.username, user.phone, user.location);
      toast.success("Profile updated successfully");
    } catch (error) {
      toast.error(error as string);
    }
  }
};
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <div className="w-full px-2 md:px-3 py-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold">Settings</h1>
            <p className="text-sm text-slate-500">Manage your account and preferences</p>
          </div>
          <button onClick={SaveChange} className="cursor-pointer px-4 py-2 rounded-lg bg-slate-900 text-white text-sm font-medium hover:bg-slate-800 transition">
            Save changes
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
          <div className="lg:col-span-2 space-y-6">
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

            <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <FiShield className="w-4 h-4 text-slate-500" />
                <h2 className="text-sm font-semibold text-slate-700">Security</h2>
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between rounded-lg border border-slate-200 p-4">
                  <div className="flex items-center gap-3">
                    <FiKey className="w-4 h-4 text-slate-500" />
                    <div>
                      <div className="text-sm font-medium">Two-factor authentication</div>
                      <div className="text-xs text-slate-500">Add an extra layer of security to your account</div>
                    </div>
                  </div>
                  <button className="px-3 py-1.5 rounded-md bg-slate-900 text-white text-xs font-medium hover:bg-slate-800 transition">
                    Enable 2FA
                  </button>
                </div>
                <div className="flex items-center justify-between rounded-lg border border-slate-200 p-4">
                  <div className="flex items-center gap-3">
                    <FiSmartphone className="w-4 h-4 text-slate-500" />
                    <div>
                      <div className="text-sm font-medium">Passkey</div>
                      <div className="text-xs text-slate-500">Use a device passkey for passwordless sign-in</div>
                    </div>
                  </div>
                  <button className="px-3 py-1.5 rounded-md border border-slate-200 text-xs font-medium text-slate-700 hover:bg-slate-50 transition">
                    Set up
                  </button>
                </div>
                <div className="flex items-center justify-between rounded-lg border border-slate-200 p-4">
                  <div className="flex items-center gap-3">
                    <FiSmartphone className="w-4 h-4 text-slate-500" />
                    <div>
                      <div className="text-sm font-medium">Authenticator app</div>
                      <div className="text-xs text-slate-500">Generate one-time codes with an authenticator</div>
                    </div>
                  </div>
                  <button className="px-3 py-1.5 rounded-md border border-slate-200 text-xs font-medium text-slate-700 hover:bg-slate-50 transition">
                    Set up
                  </button>
                </div>
                <div className="flex items-center justify-between rounded-lg border border-slate-200 p-4">
                  <div className="flex items-center gap-3">
                    <FiLock className="w-4 h-4 text-slate-500" />
                    <div>
                      <div className="text-sm font-medium">Change password</div>
                      <div className="text-xs text-slate-500">Update your password regularly</div>
                    </div>
                  </div>
                  <button
                    onClick={() => setIsChangePasswordOpen(true)}
                    className="px-3 py-1.5 rounded-md border border-slate-200 text-xs font-medium text-slate-700 hover:bg-slate-50 transition"
                  >
                    Update
                  </button>
                </div>
                <div className="flex items-center justify-between rounded-lg border border-slate-200 p-4">
                  <div className="flex items-center gap-3">
                    <FiSmartphone className="w-4 h-4 text-slate-500" />
                    <div>
                      <div className="text-sm font-medium">Active sessions</div>
                      <div className="text-xs text-slate-500">See devices logged into your account</div>
                    </div>
                  </div>
                  <button className="px-3 py-1.5 rounded-md border border-slate-200 text-xs font-medium text-slate-700 hover:bg-slate-50 transition">
                    Manage
                  </button>
                </div>
              </div>
            </section>

            <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <FiCreditCard className="w-4 h-4 text-slate-500" />
                <h2 className="text-sm font-semibold text-slate-700">Subscription</h2>
              </div>
              <div className="rounded-lg border border-slate-200 p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-medium">Pro plan</div>
                    <div className="text-xs text-slate-500">Renews on Mar 15</div>
                  </div>
                  <span className="px-2 py-1 rounded-md bg-emerald-50 text-emerald-700 text-xs font-medium">Active</span>
                </div>
                <div className="mt-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                  <div className="text-sm text-slate-600">
                    Manage billing and invoices with Stripe.
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="px-3 py-1.5 rounded-md border border-slate-200 text-xs font-medium text-slate-700 hover:bg-slate-50 transition">
                      View invoices
                    </button>
                    <button className="px-3 py-1.5 rounded-md bg-slate-900 text-white text-xs font-medium hover:bg-slate-800 transition">
                      Manage Stripe
                    </button>
                  </div>
                </div>
              </div>
            </section>
          </div>

          <div className="space-y-6">
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
          </div>
        </div>
      </div>
      <ChangePasswordModal
        open={isChangePasswordOpen}
        onClose={() => setIsChangePasswordOpen(false)}
      />
    </div>
  );
};

export default Settings;
