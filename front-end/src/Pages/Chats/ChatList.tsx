import { FiBellOff } from "react-icons/fi";
import { useMemo } from "react";
import { useUser } from "../../context/UserProvider";

type ChatListProps = {
    id: string;
    username: string;
    setActiveUserId: (id: string) => void;
    activeUserId?: string | null;
    receivedMessages?: {
        id?: number | string;
        senderId: string | number;
        receiverId?: number;
        groupId?: string;
        content: string;
        createdAt: Date | string;
        isRead?: boolean;
        isReadBy?: (string | number)[];
    }[];
    member?: {
        id?: number | string;
        userId: string | number;
        groupId: string | number;
        isPinned?: boolean;
        isMuted?: boolean;
        categoroy?: string;
    }[];
    isOnline?: boolean;
    mode: "group" | "private";
    privateIsMuted?: boolean;
};

const ChatList = ({
    id,
    username,
    setActiveUserId,
    receivedMessages,
    activeUserId,
    isOnline = false,
    member,
    mode,
    privateIsMuted = false
}: ChatListProps) => {




    //context
    const { user } = useUser();

    const SortingMessage = (receivedMessages: ChatListProps["receivedMessages"]) => {
        return receivedMessages?.sort((a, b) => {
            return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        })
    }


    const getUnreadCountForGroup = () => {
        if (!receivedMessages || !user?.id) return 0;
        return receivedMessages.filter((msg) => !msg.isReadBy?.includes(user.id)).length;
    }


    const getUnreadCount = () => {
        if (!receivedMessages) return 0;
        return receivedMessages.filter((msg) => {
            return Number(msg.senderId) === Number(id)
                && Number(msg.receiverId) === Number(user?.id)
                && msg.isRead === false;
        }).length;
    };

    const sortedMessages = SortingMessage(receivedMessages || []);
    const lastMessage = sortedMessages && sortedMessages.length > 0 ? sortedMessages[sortedMessages.length - 1] : undefined;
    const activeChat = activeUserId === id;



    const isMuted = useMemo(() => {
        if (mode === "private") return privateIsMuted;
        return member?.find((mem) => Number(mem.userId) === Number(user?.id))?.isMuted || false;
    }, [member, mode, privateIsMuted, user?.id])

    return (
        <div
            className={`group w-full flex items-center gap-3 px-3 py-3 rounded-xl border ${activeChat ? "border-slate-300 shadow-sm" : "border-slate-200"} bg-white hover:border-slate-300 hover:shadow-sm cursor-pointer transition`}
            onClick={() => {
                setActiveUserId(String(id));
            }}
        >
            <div className="relative w-11 h-11 shrink-0">
                <img className="w-full h-full rounded-full object-cover" src="/360_F_133149161_cZzY9SYCE9FjMOwMGRJ26W8OqMZx1opU.jpg" alt="" />
                {isOnline === true &&
                    <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-white" />
                }
            </div>
            <div className="flex flex-col w-full min-w-0">
                <div className="flex items-center justify-between gap-2">
                    <p className="text-sm font-semibold text-slate-900 truncate">{username}</p>
                    <span className="text-[11px] text-slate-400">{receivedMessages && receivedMessages.length > 0 ? new Date(receivedMessages[receivedMessages.length - 1].createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ""}</span>
                </div>
                <div className="flex items-center justify-between gap-2">
                    <p className="text-xs text-slate-500 truncate">{lastMessage ? lastMessage.content : "No messages yet"}</p>
                    <div className="flex items-center gap-1.5 shrink-0">
                        {mode === "group" && isMuted && (
                            <span className="inline-flex items-center justify-center text-slate-400" title="Muted group">
                                <FiBellOff className="w-3.5 h-3.5" />
                            </span>
                        )}
                        {mode === "private" && isMuted && (
                            <span className="inline-flex items-center justify-center text-slate-400" title="Muted chat">
                                <FiBellOff className="w-3.5 h-3.5" />
                            </span>
                        )}
                        {mode === "private" && getUnreadCount() > 0 &&
                            <span className="min-w-[18px] h-[18px] rounded-full bg-slate-900 text-white text-[10px] flex items-center justify-center">
                                {getUnreadCount()}
                            </span>
                        }
                        {mode === "group" && getUnreadCountForGroup() > 0 &&
                            <span className="min-w-[18px] h-[18px] rounded-full bg-slate-900 text-white text-[10px] flex items-center justify-center">
                                {getUnreadCountForGroup()}
                            </span>
                        }
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ChatList;
