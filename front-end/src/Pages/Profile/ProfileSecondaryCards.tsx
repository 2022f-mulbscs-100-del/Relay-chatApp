import { FiMessageCircle, FiUsers } from "react-icons/fi";

import { useMessage } from "../../context/MessageProvider";
import { useEffect } from "react";
import { useMessageApis } from "../../customHooks/useMessageApis";

const ProfileSecondaryCards = () => {
    const { listOfChatUsers } = useMessage();
    const { getAsscociatedUsers } = useMessageApis();
    // useEffect(() => {
    //      getAsscociatedUsers();
    // },[])

    useEffect(() => {
        try {
            getAsscociatedUsers();
        } catch (error) {
            console.error("Error fetching associated users:", error);
        }
    }, [])


 
    const stats = [
        { icon: FiMessageCircle, label: 'Messages', value: '2,847', color: 'from-purple-500 to-pink-500' },
        { icon: FiUsers, label: 'Contacts', value: listOfChatUsers.length, color: 'from-blue-500 to-cyan-500' },
    ];


    return (
        <div className="flex gap-4 mt-6">
            {stats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                    <div
                        key={index}
                        className="rounded-xl w-full border border-slate-200 bg-white px-4 py-4 shadow-sm"
                    >
                        <div className="flex w-full items-center gap-3">
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
    )
}

export default ProfileSecondaryCards;