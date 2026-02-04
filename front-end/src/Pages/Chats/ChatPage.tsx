import { FaPaperPlane } from "react-icons/fa";
import ChatMessage from "./ChatMessage";
import { useEffect, useRef, useState } from "react";
import { useSocket } from "../../context/SocketProvider";
import { useUser } from "../../context/UserProvider";
import { useMessage } from "../../context/MessageProvider";
import type { MessageProps } from "../../types/message.types";
import { AxiosClient } from "../../api/AxiosClient";
import { useMessageApis } from "../../customHooks/useMessageApis";
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
}
const ChatPage = ({
    listOfChatUsers,
    activeUserId
}: ChatPageProps) => {

    const InputRef = useRef<HTMLInputElement | null>(null);
    const socket = useSocket();
    const [inputMessage, setInputMessage] = useState("");
    const { message, setMessage } = useMessage();
    const { user } = useUser();
    const { MarkMessageAsRead } = useMessageApis();
 

    useEffect(() => {
        if (!socket) return;

        const handleMessageReceived = async (msg: { fromUserId: number; toUserId: number; content: string; timestamp: Date, messageId: number }) => {
            setMessage((prev: MessageProps[] | null) => [...(prev || []), {
                senderId: msg.fromUserId,
                receiverId: msg.toUserId,
                content: msg.content,
                createdAt: msg.timestamp
            }]);

            await AxiosClient.post("/messages/updateMessage", { messageId: msg.messageId });

        };

        socket.on("private_message", handleMessageReceived);

        return () => {
            socket.off("private_message", handleMessageReceived);
        };
    }, [socket, activeUserId, setMessage]);

    const isSaved = async () => {
        if (message?.length === 0) {
            await AxiosClient.post("/users/UpdateUser", { userId: activeUserId });
        }
        const FilterMessage = message?.some((msg) => {
            return (msg.senderId === Number(user?.id) && msg.senderId === activeUserId && msg.isRead === false);

        })
        if (!FilterMessage) return false;
        await AxiosClient.post("/users/UpdateUser", { userId: activeUserId });
        return FilterMessage;
    }
    const SendMessage = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!socket || activeUserId === null) return;
        if (inputMessage.trim() === "") return;
        socket.emit("private_message", {
            content: inputMessage,
            toUserId: String(activeUserId)
        });


        setMessage((prev: MessageProps[] | null) => [...(prev || []), {
            senderId: Number(user?.id),
            receiverId: activeUserId,
            content: inputMessage,
            createdAt: new Date()
        }]);
        setInputMessage("");
        await isSaved();

    }
    const filterUser = listOfChatUsers.find(user => user.id === activeUserId);

    useEffect(() => {
        if (!activeUserId) return;
        MarkMessageAsRead(activeUserId);
    }, [activeUserId]);


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
                        <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-white" />
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
                    messageList={(message || []).map(msg => ({
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

