import { useMemo, useState } from "react";
import { FiBell, FiBellOff, FiMessageCircle, FiMoreVertical, FiStar, FiVolumeX } from "react-icons/fi";
import type { AssociatedUser } from "../../types/message.types";
import { useMessage } from "../../context/MessageProvider";
import { useNavigate } from "react-router-dom";
import { useMessageApis } from "../../customHooks/useMessageApis";
import { toast } from "react-toastify";

interface ContactsListProps {
    associatedUser: AssociatedUser[];
}

const ContactsList = ({ associatedUser }: ContactsListProps) => {

    //state
    const [contactCategories, setContactCategories] = useState<Record<number, string>>({});
    const [openMenuId, setOpenMenuId] = useState<number | null>(null);

    //context
    const { setActiveUserId, onlineUserIds } = useMessage();

    //custom hooks
    const { handleMessageMuteToggle } = useMessageApis();


    const navigate = useNavigate();



    const handleMuteToggle = (contactId: number) => {
        try {
            handleMessageMuteToggle(contactId);

        } catch {
            toast.error("Failed to toggle mute. Please try again later.")
        }
    }

    const handleCategoryChange = (contactId: number, category: string) => {
        setContactCategories((prev) => ({
            ...prev,
            [contactId]: category
        }));
        setOpenMenuId(null);
    };

  
    const usersWithOnlineStatus = useMemo(() => {
        return associatedUser.map((user: AssociatedUser) => {

            const isOnline = onlineUserIds.includes(user.associatedUser.id);
            return {
                ...user,
                isOnline
            }
        })
    }, [onlineUserIds, associatedUser]);


    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {usersWithOnlineStatus.map((contact: AssociatedUser) => (
                <div
                    key={contact.id}
                    className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm hover:border-slate-300 transition"
                >
                    <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                            <div className="relative">
                                <div className="w-12 h-12 rounded-full bg-slate-200 flex items-center justify-center text-sm font-semibold text-slate-700">
                                    {contact.associatedUser.username
                                        .split(" ")
                                        .map((part) => part[0])
                                        .join("")}
                                </div>
                                <span className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-white  ${contact.isOnline ? "bg-emerald-500" : "bg-slate-200"}`} />
                            </div>
                            <div>
                                <div className="text-sm font-semibold text-slate-800 flex items-center gap-2">
                                    {contact.associatedUser.username}
                                    {(contactCategories[contact.id] === "Favourite" || contact.category === "Favourite") && <FiStar className="w-3.5 h-3.5 text-amber-500" />}
                                    {contact.isMuted && <FiVolumeX className="w-3.5 h-3.5 text-slate-400" title="Muted" />}
                                </div>
                                <div className="text-xs text-slate-500">{contact.associatedUser.email}</div>
                                <div className="text-xs text-slate-400 mt-1">{!contact.isOnline && contact.associatedUser?.lastSeen && (new Date(contact.associatedUser.lastSeen)).toLocaleTimeString([], {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                })}</div>
                            </div>
                        </div>
                        <div className="relative">
                            <button
                                className="p-2 rounded-lg hover:bg-slate-50 text-slate-400 hover:text-slate-600 transition"
                                onClick={() => setOpenMenuId((prev) => (prev === contact.id ? null : contact.id))}
                            >
                                <FiMoreVertical className="w-4 h-4" />
                            </button>
                            {openMenuId === contact.id && (
                                <div className="absolute right-0 mt-1 z-10 w-44 rounded-lg border border-slate-200 bg-white shadow-md">
                                    <div className="px-3 py-2 text-[11px] uppercase tracking-wide text-slate-400">Add to</div>
                                    {["Favourite", "Work", "Family"].map((category) => (
                                        <button
                                            key={category}
                                            className={`w-full px-3 py-2 text-left text-sm transition ${contactCategories[contact.id] === category ? "bg-slate-100 text-slate-900" : "text-slate-600 hover:bg-slate-50"}`}
                                            onClick={() => handleCategoryChange(contact.id, category)}
                                        >
                                            {category}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="mt-4 flex items-center">
                        <div className="flex items-center gap-2">
                            <button className="p-2 cursor-pointer rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 transition"
                                onClick={() => {
                                    navigate("/?tab=chats")
                                    setActiveUserId(String(contact.associatedUser.id))
                                }}
                            >
                                <FiMessageCircle className="w-4 h-4" />
                            </button>
                            <button
                                className="p-2 cursor-pointer rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 transition"
                                onClick={() => handleMuteToggle(contact.associateUserId)}
                            >
                                {contact.isMuted ? (
                                    <FiBellOff className="w-4 h-4 text-slate-300" />
                                ) : (
                                    <FiBell className="w-4 h-4 text-slate-600" />
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    )
}

export default ContactsList;
