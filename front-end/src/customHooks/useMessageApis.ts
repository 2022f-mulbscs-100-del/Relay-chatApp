import { useState } from "react";
import { AxiosClient } from "../api/AxiosClient";
import { useMessage } from "../context/MessageProvider";
import { useUser } from "../context/UserProvider";
import type { chatUser } from "../types/message.types";

export const useMessageApis = () => {
    const { setListOfAllUsers, setMessage,setShowToastOfUnreadMessage,setListOfChatUsers } = useMessage();
    const [loading, setLoading] = useState(false);
    const { user } = useUser();
    const fetchAllUsersForLiveSearch = async () => {
        setLoading(true);
        AxiosClient.get(`/users/getAllUsers`)
            .then((response) => {
                setLoading(false);
                setListOfAllUsers(response.data.users);
            })
            .catch(() => {
                setLoading(false);
                throw new Error("Failed to fetch all users");
            })
    }

    const getAsscociatedUsers = async () => {
        setLoading(true);
        AxiosClient.get("/users/getAssociatedUsers").then((response) => {
            setListOfChatUsers(response.data.AcssociatedUsers);
        }).catch(() => {
            throw new Error("Failed to fetch users");
        });
    }

    const getMessages = async (userId: number) => {
        setLoading(true);
        AxiosClient.get(`/messages/getMessages/${userId}`)
            .then((response) => {
                setMessage(response.data.messages);
            })
            .catch(() => {
                throw new Error("Failed to fetch messages for user");
            });
    }

    const MarkMessageAsRead = async (activeUserId: number | null) => {
        if (!activeUserId) return;
        
        try {
            setListOfChatUsers((prev) => {
                return prev.map((user: chatUser) => {
                    if (user.id === activeUserId) {
                       
                        const updatedSentMessages = user.sentMessages?.map((msg) => ({
                            ...msg,
                            isRead: true
                        }));
                        return {
                            ...user,
                            sentMessages: updatedSentMessages
                        };
                    }
                    return user;
                });
            })
            
            await AxiosClient.post(`/messages/UpdateMessages/${activeUserId}`, {
                userId: user?.id,
            });
                     
            await AxiosClient.post("/users/UpdateUser", { userId: activeUserId });
        } catch {
            throw new Error("Failed to mark messages as read");
        }
    }

    const getUnreadMessageChats = async () => {
        try {
            const response = await AxiosClient.get(`/messages/unreadChatList`);
            setShowToastOfUnreadMessage(response.data.unreadChats);
            setListOfChatUsers((prev) => {
                const unreadChats = response.data.unreadChats || [];
                //eslint-disable-next-line
                const normalizedUsers = unreadChats.map((user:any) => ({
                    ...user,
                    receivedMessages: user.sentMessages || user.receivedMessages || []
                }));
                const newUsers = normalizedUsers.filter(
                    (unreadUser: chatUser) => !prev.some((existingUser) => existingUser.id === unreadUser.id)
                );
                return [...prev, ...newUsers];
            });

        } catch {
            throw new Error("Failed to fetch unread message chats");
        }
    }


    return { fetchAllUsersForLiveSearch, loading, getAsscociatedUsers, getMessages, MarkMessageAsRead,getUnreadMessageChats };
}