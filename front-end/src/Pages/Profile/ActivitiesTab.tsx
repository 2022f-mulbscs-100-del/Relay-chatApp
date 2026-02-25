import { useState } from "react";
import { useUser } from "../../context/UserProvider";
import GlobalImagePreviewContainer from "../../Component/GlobalImagePreviewContainer";
interface ActivitiesTabProps {
    sharedMedia: string[];
}
const ActivitiesTab = ({ sharedMedia }: ActivitiesTabProps) => {

    const [activeTab, setActiveTab] = useState('about');
    const { user } = useUser();

    const [imagePreview, setImagePreview]= useState<string | null>(null);

    const activities = [
        { text: 'Sent a message to Sarah', time: '2 hours ago', color: 'bg-purple-500' },
        { text: 'Voice call with Mike', time: '5 hours ago', color: 'bg-green-500' },
        { text: 'Joined Design Team group', time: '1 day ago', color: 'bg-blue-500' },
        { text: 'Updated profile picture', time: '3 days ago', color: 'bg-amber-500' }
    ];
    return (

        <div className="lg:col-span-2 space-y-4">
            <div className="rounded-xl border border-slate-200 bg-white p-2 shadow-sm">
                <div className="flex gap-2">
                    {['about', 'media', 'activity'].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition ${activeTab === tab
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
                    <div className="max-h-[410px] overflow-auto ">
                    <div className="grid grid-cols-4 gap-3">
                        {sharedMedia.map((url, index) => (
                            <>
                            {imagePreview === url &&
                            <GlobalImagePreviewContainer
                                key={`preview-${index}`}
                                imageUrl={url}
                                onClose={() => setImagePreview(null)}
                            />}
                            <div key={index} className="relative   rounded-lg overflow-hidden border border-slate-200" 
                            onClick={() => setImagePreview(url)}
                            >
                                <img src={url} alt={`Media ${index + 1}`} className="w-full h-full object-cover" />
                                <div className="absolute inset-0 bg-black/0 hover:bg-black/10 transition" />
                            </div>
                            </>
                        ))}
                    </div>
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
    )
}

export default ActivitiesTab;