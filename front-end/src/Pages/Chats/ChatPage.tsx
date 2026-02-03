import { FaPaperPlane } from "react-icons/fa";
import ChatMessage from "./ChatMessage";
import { useEffect, useState } from "react";
import { useSocket } from "../../context/SocketProvider";
import { useUser } from "../../context/UserProvider";
type ChatPageProps = {
    listOfChatUsers: {
        id: number;
        username: string;
    }[];
    activeUserId: number | null;
}
const ChatPage = ({
    listOfChatUsers,
    activeUserId
}: ChatPageProps) => {

    const socket = useSocket();
    const [inputMessage, setInputMessage] = useState("");
    const [messageList, setMessageList] = useState<{ fromUserId: number; content: string }[]>([]);
    const { user } = useUser();
    useEffect(() => {
        if (!socket) return;

        const handleMessageReceived = (message: { fromUserId: number; toUserId: number; content: string; timestamp: Date }) => {
            setMessageList((prev) => [...prev, {
                fromUserId: message.fromUserId,
                content: message.content
            }]);

        };

        socket.on("private_message", handleMessageReceived);

        return () => {
            socket.off("private_message", handleMessageReceived);
        };
    }, [socket, activeUserId]);

    useEffect(() => {
        console.log("Message list updated:", messageList);
    }, [messageList]);

    const SendMessage = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!socket || activeUserId === null) return;
        if (inputMessage.trim() === "") return;

        console.log("Sending message to user", activeUserId, ":", inputMessage);

        socket.emit("private_message", {
            content: inputMessage,
            toUserId: String(activeUserId)
        });

        // Add sent message to local state
        setMessageList((prev) => [...prev, {
            fromUserId: Number(user?.id) || 0, // Use 0 or current user ID for sent messages
            content: inputMessage
        }]);

        setInputMessage("");
    }
    const filterUser = listOfChatUsers.find(user => user.id === activeUserId);

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

            <div className="flex-1 overflow-auto customScrollbar bg-slate-50 px-4 py-4">
                <ChatMessage messageList={messageList} />
            </div>

            <form onSubmit={SendMessage} className="border-t border-slate-200 bg-white px-4 py-3">
                <div className="flex items-center gap-2">
                    <input
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
