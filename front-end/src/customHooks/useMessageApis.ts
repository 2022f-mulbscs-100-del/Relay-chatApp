import { useState } from "react";
import { AxiosClient } from "../api/AxiosClient";
import { useMessage } from "../context/MessageProvider";
import { useUser } from "../context/UserProvider";
import type { chatUser } from "../types/message.types";

export const useMessageApis = () => {
    const { setListOfAllUsers, setMessage, setShowToastOfUnreadMessage, setListOfChatUsers } = useMessage();
    const [loading, setLoading] = useState(false);
    const { user } = useUser();


    // FETCH ALL USERS FOR LIVE SEARCH API CALL
    const fetchAllUsersForLiveSearch = async () => {
        setLoading(true);
        AxiosClient.get(`/users/getAllUsers`)
            .then((response) => {
                setLoading(false);
                setListOfAllUsers(response.data.users);
                console.log("All users fetched for live search:", response.data.users);
            })
            .catch(() => {
                setLoading(false);
                throw new Error("Failed to fetch all users");
            })
    }


    // GET ASSOCIATED USERS FOR CHAT LIST API CALL
    const getAsscociatedUsers = async () => {
        setLoading(true);
        AxiosClient.get("/users/getAssociatedUsers").then((response) => {
            setListOfChatUsers(response.data.AcssociatedUsers);
        }).catch(() => {
            throw new Error("Failed to fetch users");
        });
    }


    // GET MESSAGES WITH A USER API CALL
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


    // MARK MESSAGES AS READ API CALL
    const MarkMessageAsRead = async (activeUserId: number | null) => {
        if (!activeUserId) return;
        
        try {
            setListOfChatUsers((prev) => {
                return prev.map((user: chatUser) => {
                    if (user.id === activeUserId) {

                        const updatedSentMessages = user.receivedMessages?.map((msg) => ({
                            ...msg,
                            isRead: true
                        }));
                        return {
                            ...user,
                            receivedMessages: updatedSentMessages
                        };
                    }
                    return user;
                });
            })
            
            await AxiosClient.post(`/messages/UpdateMessages/${activeUserId}`, {
                userId: user?.id,
            });

            await AxiosClient.post("/users/addAssociatedUser", { userId: activeUserId });
        } catch {
            throw new Error("Failed to mark messages as read");
        }
    }

    // GET UNREAD MESSAGE CHATS API CALL
    const getUnreadMessageChats = async () => {
        try {
            const response = await AxiosClient.get(`/messages/unreadChatList`);
            setShowToastOfUnreadMessage(response.data.unreadChats);
            setListOfChatUsers((prev) => {
                const unreadChats = response.data.unreadChats || [];
                //eslint-disable-next-line
                const normalizedUsers = unreadChats.map((user: any) => ({
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


    return { fetchAllUsersForLiveSearch, loading, getAsscociatedUsers, getMessages, MarkMessageAsRead, getUnreadMessageChats };
}