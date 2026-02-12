import { FaPaperPlane } from "react-icons/fa";
import ChatMessage from "./ChatMessage";
import { useEffect, useMemo, useRef } from "react";
import { useMessage } from "../../context/MessageProvider";
import { useMessageApis } from "../../customHooks/useMessageApis";
import { useUser } from "../../context/UserProvider";
import type { Group } from "../../types/group.type";
import useGroupApis from "../../customHooks/useGroupApis";


type ChatPageProps = {
    listOfChatUsers?: {
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

    activeUserId: string | null;
    SendMessage?: (e: React.FormEvent<HTMLFormElement>) => void;
    SendGroupMessage?: (e: React.FormEvent<HTMLFormElement>) => void;
    inputMessage: string;
    setInputMessage: React.Dispatch<React.SetStateAction<string>>;
    mode?: "private" | "group";
    listOfgroups?: Group[];
}
const ChatPage = ({
    listOfChatUsers,
    activeUserId,
    SendMessage,
    SendGroupMessage,
    inputMessage,
    setInputMessage,
    listOfgroups,
    mode = "private"
}: ChatPageProps) => {



    //states
    const InputRef = useRef<HTMLInputElement | null>(null);
    
    //context
    const { message } = useMessage();
    const { user } = useUser();

    //hooks
    const { MarkMessageAsRead } = useMessageApis();
    const { MarkGroupMessageAsRead } = useGroupApis();

   

    //filter user from list of chat users to show the name of the user
    const filterUser = listOfChatUsers?.find(user => String(user.id) === activeUserId);

    //filter message for specific user 
    const FilterMessage = useMemo(() => {
        return (message?.filter(msg => (String(msg.senderId) === activeUserId && msg.receiverId === user?.id) || (msg.senderId === user?.id && String(msg.receiverId) === activeUserId)) || []);
    }, [message, activeUserId, user?.id]);

    
    //filter group from list of groups to show the name of the group
    const filterGroup = listOfgroups?.find((group: Group) => (String(group.id)) === activeUserId);

    //filter group messages for specific group
    const filteredGroupMessages = useMemo(() => {
        return message?.filter(msg => msg.groupId === activeUserId) || [];
    }, [message, activeUserId]);

    
    //effect to mark messages as read
    useEffect(() => {
        if (!activeUserId) return;
        if (mode === "private") {
            MarkMessageAsRead(activeUserId);
        }
        if(mode === "group") {
            MarkGroupMessageAsRead(activeUserId,user?.id);
        }
    }, [activeUserId, setInputMessage]);


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
                            {mode === "private" ? (filterUser ? filterUser.username : "Unknown User") : (filterGroup ? filterGroup?.groupName : "Unknown Group")}
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

                    {mode === "private" ?
                        <ChatMessage
                            messageList={(FilterMessage || []).map(msg => ({
                                key: msg.id,
                                fromUserId: msg.senderId || 0,
                                content: msg.content || '',
                                createdAt: msg.createdAt
                            }))}
                        />

                        :
                        <ChatMessage
                            messageList={((filteredGroupMessages || []) || []).map(msg => ({
                                key: msg.id,
                                fromUserId: Number(msg.senderId) || 0,
                                content: msg.content || '',
                                createdAt: msg.createdAt || ""
                            }))}
                        />
                    }

                </div>

            </div>

            <form onSubmit={mode === "private" ? SendMessage : SendGroupMessage} className="border-t border-slate-200 bg-white px-4 py-3">
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

