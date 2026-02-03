type ChatListProps = {
    id: number;
    username: string;
    setActiveUserId: (id: number) => void;
};

const ChatList = ({
    id,
    username,
    setActiveUserId,
}: ChatListProps) => {

    return (
        <div
            className="group w-full flex items-center gap-3 p-3 rounded-lg border border-transparent hover:border-slate-200 hover:bg-slate-50 cursor-pointer transition"
            onClick={() => {
                setActiveUserId(id);
            }}
        >
            <div className="relative w-10 h-10 shrink-0">
                <img className="w-full h-full rounded-full object-cover" src="/153608270.jpeg" alt="" />
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-white" />
            </div>
            <div className="flex flex-col w-full min-w-0">
                <div className="flex items-center justify-between gap-2">
                    <p className="text-sm font-semibold text-slate-900 truncate">{username}</p>
                    <span className="text-[11px] text-slate-400">2:45 PM</span>
                </div>
                <div className="flex items-center justify-between gap-2">
                    <p className="text-xs text-slate-500 truncate">Last message preview goes here…</p>
                    <span className="min-w-[18px] h-[18px] rounded-full bg-slate-900 text-white text-[10px] flex items-center justify-center">
                        2
                    </span>
                </div>
            </div>
        </div>
    );
};

export default ChatList;
