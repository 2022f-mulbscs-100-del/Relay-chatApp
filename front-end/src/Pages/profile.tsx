import  { useEffect, useState } from 'react';
import { FiCamera, FiMessageCircle, FiPhone, FiMail, FiMapPin, FiCalendar, FiUsers, FiAward, FiSettings, FiBell, FiShield, FiLogOut } from 'react-icons/fi';
import { useUserApis } from '../customHooks/useUserApis';
import { useUser } from '../context/UserProvider';
import { useAuthCall } from '../customHooks/useAuthCall';
import { toast } from 'react-toastify';
import { normalizeDate } from '../utlis/NormalizeDate';

const ProfilePage = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('about');

console.log(setIsEditing)

  const stats = [
    { icon: FiMessageCircle, label: 'Messages', value: '2,847', color: 'from-purple-500 to-pink-500' },
    { icon: FiUsers, label: 'Contacts', value: '328', color: 'from-blue-500 to-cyan-500' },
    { icon: FiAward, label: 'Badges', value: '12', color: 'from-amber-500 to-orange-500' }
  ];

  const recentMedia = [
    'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=300&h=300&fit=crop',
    'https://images.unsplash.com/photo-1618005198919-d3d4b5a92ead?w=300&h=300&fit=crop',
    'https://images.unsplash.com/photo-1618556450994-a6a128ef0d9d?w=300&h=300&fit=crop',
    'https://images.unsplash.com/photo-1611162616475-46b635cb6868?w=300&h=300&fit=crop',
    'https://images.unsplash.com/photo-1618004652321-13a63e576b80?w=300&h=300&fit=crop',
    'https://images.unsplash.com/photo-1618005198946-4e1b2e0c2ebb?w=300&h=300&fit=crop'
  ];

  const activities = [
    { text: 'Sent a message to Sarah', time: '2 hours ago', color: 'bg-purple-500' },
    { text: 'Voice call with Mike', time: '5 hours ago', color: 'bg-green-500' },
    { text: 'Joined Design Team group', time: '1 day ago', color: 'bg-blue-500' },
    { text: 'Updated profile picture', time: '3 days ago', color: 'bg-amber-500' }
  ];

  const settings = [
    { id: 1, icon: FiBell, label: 'Notifications', description: 'Manage notification preferences' },
    { id: 2, icon: FiShield, label: 'Privacy & Security', description: 'Control your privacy settings' },
    { id: 3, icon: FiSettings, label: 'Account Settings', description: 'Update your account details' },
    { id: 4, icon: FiLogOut, label: 'Log Out', description: 'Sign out of your account', danger: true }
  ];


  const {getProfile} = useUserApis();
  const {logout} = useAuthCall();
  const {user} = useUser();
  useEffect(() => {
    getProfile();
  }, [])

  const Logout = async () => {
    try {
       await logout();
      
    } catch (error) {
      toast.error(String(error));
    }
  }


  return (
    <div className=" bg-slate-50 text-slate-900 px-10">
    

      <div className="w-full   md:px-3 py-6">
        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm px-4 pb-5">
          <div className="flex flex-col md:flex-row md:items-end gap-5 pt-5">
              <div className="relative">
                <img
                  src={user?.profilePic || "https://images.unsplash.com/photo-1502685104226-ee32379fefbe?w=300&h=300&fit=crop"}
                  alt={user?.username}
                  className="w-28 h-28 rounded-2xl object-cover border-4 border-white shadow-sm"
                />
                <div className="absolute bottom-1 right-1 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-white" />
                {isEditing && (
                  <button className="absolute inset-0 flex items-center justify-center bg-black/30 rounded-2xl opacity-0 hover:opacity-100 transition">
                    <FiCamera className="w-5 h-5 text-white" />
                  </button>
                )}
              </div>
              <div className="flex-1">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div>
                    <h1 className="text-2xl font-semibold">@{user?.username}</h1>
                  </div>
            
                </div>
                <p className="mt-3 text-slate-600">{user?.title}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div
                key={index}
                className="rounded-xl border border-slate-200 bg-white px-4 py-4 shadow-sm"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center">
                    <Icon className="w-5 h-5 text-slate-700" />
                  </div>
                  <div>
                    <div className="text-lg font-semibold">{stat.value}</div>
                    <div className="text-xs text-slate-500">{stat.label}</div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
          <div className="space-y-6">
            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              <h2 className="text-sm font-semibold text-slate-700 mb-4">Contact</h2>
              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-3">
                  <FiMail className="w-4 h-4 text-slate-500" />
                  <div>
                    <div className="text-slate-500">Email</div>
                    <div className="font-medium text-slate-800">{user?.email}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <FiPhone className="w-4 h-4 text-slate-500" />
                  <div>
                    <div className="text-slate-500">Phone</div>
                    <div className="font-medium text-slate-800">{user?.phone}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <FiMapPin className="w-4 h-4 text-slate-500" />
                  <div>
                    <div className="text-slate-500">Location</div>
                    <div className="font-medium text-slate-800">{user?.location}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <FiCalendar className="w-4 h-4 text-slate-500" />
                  <div>
                    <div className="text-slate-500">Joined</div>
                    <div className="font-medium text-slate-800">{normalizeDate(user?.createdAt || '').toLocaleDateString(undefined, { day: 'numeric', month: 'long', year: 'numeric'})}</div>
                  </div>
                </div>
              </div>
            </div>
        {/* settingcard */}
            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm w-full">
              <h2 className="text-sm font-semibold text-slate-700 mb-3">Settings</h2>
              <div className="space-y-1">
                {settings.map((setting, index) => {
                  const Icon = setting.icon;
                  return (
                    <button
                      key={index}
                      className={` cursor-pointer w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition ${
                        setting.danger
                          ? 'text-rose-600 hover:bg-rose-50'
                          : 'text-slate-700 hover:bg-slate-50'
                      }`}
                    onClick={() => {
                      if(setting.label === 'Log Out'){
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
          </div>

          <div className="lg:col-span-2 space-y-4">
            <div className="rounded-xl border border-slate-200 bg-white p-2 shadow-sm">
              <div className="flex gap-2">
                {['about', 'media', 'activity'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition ${
                      activeTab === tab
                        ? 'bg-slate-900 text-white'
                        : 'text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {activeTab === 'about' && (
              <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                <h3 className="text-lg font-semibold mb-3">About</h3>
                <p className="text-slate-600 leading-relaxed">
                  {user?.about || "This user hasn't added any information about themselves yet."}
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {(user?.tags ?? []).map((tag, i) => (
                    <span
                      key={i}
                      className="px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-medium"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'media' && (
              <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                <h3 className="text-lg font-semibold mb-4">Shared media</h3>
                <div className="grid grid-cols-3 gap-3">
                  {recentMedia.map((url, index) => (
                    <div key={index} className="relative aspect-square rounded-lg overflow-hidden border border-slate-200">
                      <img src={url} alt={`Media ${index + 1}`} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/0 hover:bg-black/10 transition" />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'activity' && (
              <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                <h3 className="text-lg font-semibold mb-4">Recent activity</h3>
                <div className="divide-y divide-slate-100">
                  {activities.map((activity, index) => (
                    <div key={index} className="flex items-start gap-3 py-3">
                      <div className={`w-2 h-2 mt-2 rounded-full ${activity.color}`} />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-slate-800">{activity.text}</p>
                        <p className="text-xs text-slate-500">{activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
  );
};

export default ProfilePage;
