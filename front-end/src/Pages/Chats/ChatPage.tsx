import { FaPaperPlane } from "react-icons/fa";
import ChatMessage from "./ChatMessage";
import { useEffect, useMemo, useRef, useState } from "react";
import { useMessage } from "../../context/MessageProvider";
import { useMessageApis } from "../../customHooks/useMessageApis";
import { useUser } from "../../context/UserProvider";
import type { Group } from "../../types/group.type";
import useGroupApis from "../../customHooks/useGroupApis";
import ChatProfileModal from "./ChatProfileModal";
import { useSocket } from "../../context/SocketProvider";
import AddMemberModal from "./AddMemberModal";
import GroupMemberModal from "./GroupMemberModal";
import LeaveGroupModal from "./LeaveGroupModal";
import { toast } from "react-toastify";
import ChatPageHeader from "./ChatPageHeader";


type ChatPageProps = {
    activeUserId: string | null;
    SendMessage?: (e: React.FormEvent<HTMLFormElement>) => void;
    SendGroupMessage?: (e: React.FormEvent<HTMLFormElement>) => void;
    inputMessage: string;
    setInputMessage: React.Dispatch<React.SetStateAction<string>>;
    mode?: "private" | "group";
    listOfgroups?: Group[];
    onBack?: () => void;
}
const ChatPage = ({
    activeUserId,
    SendMessage,
    SendGroupMessage,
    inputMessage,
    setInputMessage,
    listOfgroups,
    mode = "private",
    onBack
}: ChatPageProps) => {


    //states
    const InputRef = useRef<HTMLInputElement | null>(null);
    const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
    const [isAddMemberModalOpen, setIsAddMemberModalOpen] = useState(false);
    const [isGroupMemberModalOpen, setIsGroupMemberModalOpen] = useState(false);
    const [isLeaveGroupModalOpen, setIsLeaveGroupModalOpen] = useState(false);

    //context
    const { message, onlineUserIds } = useMessage();
    const { user } = useUser();
    const socket = useSocket();

    //hooks
    const { MarkMessageAsRead, handleMessageMuteToggle } = useMessageApis();
    const { MarkGroupMessageAsRead } = useGroupApis();
    const { associatedUser, setAssociatedUser } = useMessage();


    //filter user from list of chat users to show the name of the user
    const foundUser = associatedUser?.find(user => String(user.associateUserId) === activeUserId);

    //memoized value to show online status  
    const filterUser = useMemo(() => {
        return foundUser ? {
            ...foundUser,
            isOnline: onlineUserIds.includes(Number(foundUser.associatedUser.id))
        } : undefined;
    }, [foundUser, onlineUserIds]);

    //effect to listen for user last seen and update the list of chat users and associated user
    useEffect(() => {
        if (!socket || !user?.id) return;
        socket.on("user_last_seen", ({ userId, lastSeen }) => {
            setAssociatedUser((prev) => {
                return prev.map((user) => {
                    if (String(user.associatedUser.id) !== String(userId)) {
                        return user;
                    }
                    return {
                        ...user,
                        associatedUser: {
                            ...user.associatedUser,
                            lastSeen
                        }
                    };
                });
            });
        });
        return () => {
            socket.off("user_last_seen");
        };
    }, [socket, user?.id, setAssociatedUser]);

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
        if (mode === "group") {
            MarkGroupMessageAsRead(activeUserId, user?.id);
        }
    }, [activeUserId, setInputMessage]);


    //effect to focus input
    useEffect(() => {
        if (InputRef.current) {
            InputRef.current.focus();
        }
    }, [activeUserId]);

    //effect for toggling mute
    const handleMuteToggle = () => {
        try {
            handleMessageMuteToggle(Number(activeUserId));
        } catch {
            toast.error("Failed to toggle mute. Please try again later.")
        }
    }


    return (
        <div className="flex flex-col w-full h-full">

            <ChatPageHeader
                filterUser={filterUser}
                mode={mode}
                setIsProfileModalOpen={setIsProfileModalOpen}
                setIsAddMemberModalOpen={setIsAddMemberModalOpen}
                setIsGroupMemberModalOpen={setIsGroupMemberModalOpen}
                setIsLeaveGroupModalOpen={setIsLeaveGroupModalOpen}
                handleMuteToggle={handleMuteToggle}
                foundUser={foundUser}
                filterGroup={filterGroup}
                onBack={onBack || (() => { })}
            />

            <div className="flex-1 overflow-auto customScrollbar bg-slate-50 px-3 py-4 sm:px-4">

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

            <form onSubmit={mode === "private" ? SendMessage : SendGroupMessage} className="border-t border-slate-200 bg-white px-3 py-3 sm:px-4">
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

            <ChatProfileModal
                open={isProfileModalOpen}
                onClose={() => setIsProfileModalOpen(false)}
                user={filterUser?.associatedUser}
                totalMessages={FilterMessage.length}
            />

            {mode === "group" && isAddMemberModalOpen && (
                <AddMemberModal
                    setIsAddMemberModalOpen={setIsAddMemberModalOpen}
                    filterGroup={filterGroup}
                />
            )}

            {mode === "group" && isGroupMemberModalOpen && (
                <GroupMemberModal
                    setIsGroupMemberModalOpen={setIsGroupMemberModalOpen}
                    filterGroup={filterGroup}
                />
            )}

            {mode === "group" && isLeaveGroupModalOpen && (
                <LeaveGroupModal
                    setIsLeaveGroupModalOpen={setIsLeaveGroupModalOpen}
                    filterGroup={filterGroup}
                />
            )}
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
