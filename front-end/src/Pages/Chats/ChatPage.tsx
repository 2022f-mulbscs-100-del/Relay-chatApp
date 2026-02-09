import { FaPaperPlane } from "react-icons/fa";
import ChatMessage from "./ChatMessage";
import { useEffect, useMemo, useRef } from "react";
import { useMessage } from "../../context/MessageProvider";

import { useMessageApis } from "../../customHooks/useMessageApis";
import { useUser } from "../../context/UserProvider";
type ChatPageProps = {
    listOfChatUsers: {
        id: number;
        username: string;
        receivedMessages?: {
            id: number;
            senderId: number;
            receiverId: number;
            content: string;
            createdAt: Date;
            isRead: boolean;
        }[]
    }[];
    activeUserId: number | null;
    SendMessage: (e: React.FormEvent<HTMLFormElement>) => void;
    inputMessage: string;
    setInputMessage: React.Dispatch<React.SetStateAction<string>>;
}
const ChatPage = ({
    listOfChatUsers,
    activeUserId,
    SendMessage,
    inputMessage,
    setInputMessage
}: ChatPageProps) => {

    
    const InputRef = useRef<HTMLInputElement | null>(null);
    const { message, } = useMessage();
    const { MarkMessageAsRead } = useMessageApis();
    const { user } = useUser();

    const FilterMessage = useMemo(() => {
        return (message?.filter(msg => (msg.senderId === activeUserId && msg.receiverId === user?.id) || (msg.senderId === user?.id && msg.receiverId === activeUserId)) || []
        );
    }, [message, activeUserId, user?.id]);
    
    const filterUser = listOfChatUsers.find(user => user.id === activeUserId);

    useEffect(() => {
        if (!activeUserId) return;
        MarkMessageAsRead(activeUserId);
    }, [activeUserId,setInputMessage]);


    useEffect(() => {
        if (InputRef.current) {
            InputRef.current.focus();
        }
    }, [activeUserId]);

    return (
        <div className="flex flex-col w-full h-full">
            <div className="flex items-center justify-between gap-4 border-b border-slate-200 bg-white px-4 py-3">
                <div className="flex items-center gap-3">
                    <div className="relative w-10 h-10">
                        <img className="w-full h-full rounded-full object-cover" src="/153608270.jpeg" alt="" />
                        {/* <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-white" /> */}
                    </div>
                    <div>
                        <p className="text-sm font-semibold text-slate-900">
                            {filterUser ? filterUser.username : "Unknown User"}
                        </p>
                        <p className="text-xs text-slate-500">Active now</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <button className="px-3 py-1.5 rounded-md border border-slate-200 text-xs text-slate-600 hover:bg-slate-50 transition">
                        View profile
                    </button>
                    <button className="px-3 py-1.5 rounded-md bg-slate-900 text-white text-xs hover:bg-slate-800 transition">
                        Mute
                    </button>
                </div>
            </div>

            <div className="flex-1  overflow-auto customScrollbar bg-slate-50 px-4 py-4">

                <div className="">

                    <ChatMessage
                        messageList={(FilterMessage || []).map(msg => ({
                            key: msg.id,
                            fromUserId: msg.senderId || 0,
                            content: msg.content || '',
                            createdAt: msg.createdAt
                        }))}
                    />
                </div>

            </div>

            <form onSubmit={SendMessage} className="border-t border-slate-200 bg-white px-4 py-3">
                <div className="flex items-center gap-2">
                    <input
                        ref={InputRef}
                        className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none focus:border-slate-400"
                        type="text"
                        placeholder="Type a message…"
                        value={inputMessage}
                        onChange={(e) => setInputMessage(e.target.value)}
                    />
                    <button
                        type="submit"
                        className="px-4 py-2 rounded-lg bg-slate-900 text-white text-sm hover:bg-slate-800 transition">
                        <FaPaperPlane className="inline-block" />
                    </button>
                </div>
            </form>
        </div>
    )
}
export default ChatPage;



//every chat page is a room that recevoe only message 
//when we send them from backend by specifiying their id 
//every chat registered and have their own room indivdual room
//so when we send message to that room only that user will receive it
// the other user will not receive it cause they are in their own room
//private message is a big room in which we have multiple users/rooms
//and we are not sending the message to all the users in that room
//we just using the privatemessage as an route to send message to the specific 
//user the private message event is an route in which all the users/rooms
//exist and we send message to specific user by specifying their id using the private room event (the route)

