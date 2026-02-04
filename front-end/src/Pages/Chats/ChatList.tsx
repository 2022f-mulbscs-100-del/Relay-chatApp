import { useUser } from "../../context/UserProvider";

type ChatListProps = {
    id: number;
    username: string;
    setActiveUserId: (id: number) => void;
    receivedMessages?: {
        id: number;
        senderId: number;
        receiverId: number;
        content: string;
        createdAt: Date;
        isRead: boolean;
    }[];
};

const ChatList = ({
    id,
    username,
    setActiveUserId,
    receivedMessages
}: ChatListProps) => {

    //eslint-disable-next-line 
    const SortingMessage = (receivedMessages:any[]) => {
      return   receivedMessages?.sort((a, b) => {
            return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        })
    }

const lastMessage = SortingMessage(receivedMessages || [])[SortingMessage(receivedMessages || []).length-1];
    const { user } = useUser();
    const getUnreadCount = () => {
        if (!receivedMessages) return 0;
        return receivedMessages.filter((msg) => {
            return Number(msg.senderId) === Number(id)
                && Number(msg.receiverId) === Number(user?.id)
                && msg.isRead === false;
        }).length;
    };
    return (
        <div
            className="group w-full flex items-center gap-3 px-3 py-3 rounded-xl border border-slate-200 bg-white hover:border-slate-300 hover:shadow-sm cursor-pointer transition"
            onClick={() => {
                setActiveUserId(id);
            }}
        >
            <div className="relative w-11 h-11 shrink-0">
                <img className="w-full h-full rounded-full object-cover" src="/153608270.jpeg" alt="" />
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-white" />
            </div>
            <div className="flex flex-col w-full min-w-0">
                <div className="flex items-center justify-between gap-2">
                    <p className="text-sm font-semibold text-slate-900 truncate">{username}</p>
                    <span className="text-[11px] text-slate-400">{receivedMessages && receivedMessages.length > 0 ? new Date(receivedMessages[receivedMessages.length - 1].createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ""}</span>
                </div>
                <div className="flex items-center justify-between gap-2">
                    <p className="text-xs text-slate-500 truncate">{lastMessage ? lastMessage.content : "No messages yet"}</p>
                    {getUnreadCount() > 0 &&
                        <span className="min-w-[18px] h-[18px] rounded-full bg-slate-900 text-white text-[10px] flex items-center justify-center">
                            {getUnreadCount()}
                        </span>
                    }
                </div>
            </div>
        </div>
    );
};

export default ChatList;
