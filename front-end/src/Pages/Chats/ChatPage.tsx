import { FaPaperPlane } from "react-icons/fa";
import ChatMessage from "./ChatMessage";
import { useEffect, useMemo, useRef, useState } from "react";
import { useMessage } from "../../context/MessageProvider";
import { useMessageApis } from "../../customHooks/useMessageApis";
import { useUser } from "../../context/UserProvider";
import type { Group } from "../../types/group.type";
import useGroupApis from "../../customHooks/useGroupApis";
import ChatProfileModal from "./ChatProfileModal";
import type { chatUser } from "../../types/message.types";
import { FiChevronLeft, FiInfo } from "react-icons/fi";
import { normalizeDate } from "../../utlis/NormalizeDate";
import { useSocket } from "../../context/SocketProvider";
import AddMemberModal from "./AddMemberModal";
import GroupMemberModal from "./GroupMemberModal";
import LeaveGroupModal from "./LeaveGroupModal";
import { toast } from "react-toastify";


type ChatPageProps = {
    listOfChatUsers?: chatUser[];
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
    const { message, onlineUserIds, setListOfChatUsers, } = useMessage();
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
            setListOfChatUsers((prev) =>
                prev.map((user) =>
                    String(user.id) === String(userId)
                        ? { ...user, lastSeen }
                        : user
                )
            );
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
    }, [socket, user?.id, setListOfChatUsers, setAssociatedUser]);


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
            <div className="flex items-center justify-between gap-3 border-b border-slate-200 bg-white px-3 py-3 sm:px-4">
                <div className="flex min-w-0 items-center gap-3">
                    <button
                        type="button"
                        onClick={onBack}
                        className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-600 transition hover:bg-slate-50 md:hidden"
                        aria-label="Back to chats"
                    >
                        <FiChevronLeft className="h-4 w-4" />
                    </button>
                    <div className="relative h-11 w-11 shrink-0 rounded-full ring-2 ring-slate-200">
                        <img className="h-full w-full rounded-full object-cover" src={filterUser?.associatedUser.profilePic || "/153608270.jpeg"} alt={filterUser?.associatedUser?.username || "chat user"} />
                        {mode === "private" && (
                            <span
                                className={`absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white ${filterUser?.isOnline === true ? "bg-emerald-500" : "bg-slate-400"}`}
                            />
                        )}
                    </div>
                    <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-slate-900">
                            {mode === "private" ? (filterUser ? filterUser.associatedUser.username : "Unknown User") : (filterGroup ? filterGroup?.groupName : "Unknown Group")}
                        </p>
                        <div className="mt-0.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-slate-500">
                            <span className="rounded-full bg-slate-100 px-2 py-0.5">
                                {mode === "private" ? (filterUser?.isOnline === true ? "Online" :
                                    filterUser?.associatedUser?.lastSeen ? normalizeDate((filterUser?.associatedUser?.lastSeen || "")).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' }) : "Offline"
                                ) : "Group chat"}
                            </span>
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-1.5 sm:gap-2">
                    {mode === "private" ? (
                        <>
                            <button
                                type="button"
                                className="rounded-lg border border-slate-200 bg-white p-2 text-slate-600 transition hover:bg-slate-50"
                                onClick={() => setIsProfileModalOpen(true)}
                                disabled={!filterUser}
                                aria-label="View profile details"
                            >
                                <FiInfo className="h-4 w-4" />
                            </button>
                            <button
                                type="button"
                                className="hidden rounded-md bg-slate-900 px-3 py-1.5 text-xs text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50 sm:inline-flex"
                                onClick={() => setIsProfileModalOpen(true)}
                                disabled={!filterUser}
                            >
                                View profile
                            </button>
                            <button className="hidden cursor-pointer rounded-md border border-slate-200 px-3 py-1.5 text-xs text-slate-600 transition hover:bg-slate-50 md:inline-flex"
                                onClick={handleMuteToggle}
                            >
                                {foundUser?.isMuted ? "Unmute" : "Mute"}
                            </button>
                        </>
                    ) : (
                        <>
                            <button
                                type="button"
                                className="rounded-md border border-slate-200 px-3 py-1.5 text-xs text-slate-600 transition hover:bg-slate-50"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setIsAddMemberModalOpen(true)
                                }}
                            >
                                Add member
                            </button>
                            <button
                                type="button"
                                className="hidden rounded-md border border-slate-200 px-3 py-1.5 text-xs text-slate-600 transition hover:bg-slate-50 sm:inline-flex"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setIsGroupMemberModalOpen(true)
                                }}
                            >
                                Members ({filterGroup?.memberIds?.length || 0})
                            </button>
                            <button
                                type="button"
                                className="rounded-md bg-rose-600 px-3 py-1.5 text-xs text-white transition hover:bg-rose-700"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setIsLeaveGroupModalOpen(true);
                                }}
                            >
                                Leave group
                            </button>
                        </>
                    )}
                </div>
            </div>

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
