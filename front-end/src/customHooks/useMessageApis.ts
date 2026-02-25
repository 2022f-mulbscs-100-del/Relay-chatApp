import { useState } from "react";
import { AxiosClient } from "../api/AxiosClient";
import { useMessage } from "../context/MessageProvider";
import { useUser } from "../context/UserProvider";
import type {  chatUser } from "../types/message.types";

export const useMessageApis = () => {
    const { setListOfAllUsers, setMessage, setShowToastOfUnreadMessage, setAssociatedUser } = useMessage();
    const [loading, setLoading] = useState(false);
    const { user } = useUser();


    const normalizeUserId = (id: unknown) => {
        const numericId = Number(id);
        return Number.isNaN(numericId) ? 0 : numericId;
    };

    // const dedupeUsersById = (users: chatUser[]) => {
    //     const map = new Map<number, chatUser>();
    //     users.forEach((user) => {
    //         const normalizedId = normalizeUserId(user.id);
    //         if (normalizedId !== null) {
    //             map.set(normalizedId, { ...user, id: normalizedId });
    //         }
    //     });
    //     return Array.from(map.values());
    // };

    // FETCH ALL USERS FOR LIVE SEARCH API CALL
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


    // GET ASSOCIATED USERS FOR CHAT LIST API CALL
    const getAsscociatedUsers = async () => {
        setLoading(true);
        AxiosClient.get("/users/getAssociatedUsers").then((response) => {
            setLoading(false);
            // const updatedListOfChatUsers = response.data.associatedUser.map((user: AssociatedUser) => {
            //     const normalizedId = normalizeUserId(user.associatedUser.id);
            //     return {
            //         ...user,
            //         id: normalizedId,
            //     };
            // });
            setAssociatedUser(response.data.associatedUser);

        }).catch(() => {
            setLoading(false);
            throw new Error("Failed to fetch users");
        });
    }


    // GET MESSAGES WITH A USER API CALL
    const getMessages = async (userId: string) => {
        setLoading(true);
        AxiosClient.get(`/messages/getMessages/${userId}`)
            .then((response) => {
                setMessage(response.data.messages);
                setLoading(false);
            })
            .catch(() => {
                setLoading(false);
                throw new Error("Failed to fetch messages for user");
            });
    }


    // MARK MESSAGES AS READ API CALL
    const MarkMessageAsRead = async (activeUserId: string | null) => {
        if (!activeUserId) return;

        try {
            setAssociatedUser((prev) => {
                return prev.map((association) => {
                    if (String(association.associateUserId) === activeUserId) {
                        const updatedReceivedMessages = association.associatedUser.receivedMessages?.map((msg) => ({
                            ...msg,
                            isRead: true
                        }));
                        return {
                            ...association,
                            associatedUser: {
                                ...association.associatedUser,
                                receivedMessages: updatedReceivedMessages
                            }
                        };
                    }
                    return association;
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
            const unreadChats = response.data.unreadChats || [];
            //eslint-disable-next-line
            const normalizedUsers = unreadChats.map((user: any) => {
                const normalizedId = normalizeUserId(user.id);
                return {
                    ...user,
                    id: normalizedId,
                    receivedMessages: user.sentMessages || user.receivedMessages || []
                } as chatUser;
            });
            setShowToastOfUnreadMessage(response.data.unreadChats);
            setAssociatedUser((prev) => {
                if (!user?.id) {
                    return prev;
                }
                const numericUserId = Number(user.id);
                if (Number.isNaN(numericUserId)) {
                    return prev;
                }
                const existingIds = new Set(prev.map((association) => Number(association.associateUserId)));
                const additions = normalizedUsers
                    .filter((chat: chatUser) => !existingIds.has(Number(chat.id)))
                    .map((chat: chatUser, index: number) => ({
                        id: Date.now() + index,
                        userId: numericUserId,
                        associateUserId: Number(chat.id),
                        associatedUser: chat,
                        category: "",
                        isMuted: false,
                        isPinned: false
                    }));
                return additions.length ? [...prev, ...additions] : prev;
            });

        } catch {
            throw new Error("Failed to fetch unread message chats");
        }
    }

    const handleMessageMuteToggle = async (contactId: number) => {

        setAssociatedUser((prev) =>
            prev.map((contact) =>
                contact.associateUserId === contactId
                    ? { ...contact, isMuted: !contact.isMuted }
                    : contact
            )
        );

        try {
            await AxiosClient.get(`/users/muteChat/${contactId}`);
        } catch {

            setAssociatedUser((prev) =>
                prev.map((contact) =>
                    contact.associateUserId === contactId
                        ? { ...contact, isMuted: !contact.isMuted }
                        : contact
                )
            );
            throw new Error("Failed to toggle mute for contact");
        }
    }


    return { fetchAllUsersForLiveSearch, loading, getAsscociatedUsers, getMessages, MarkMessageAsRead, getUnreadMessageChats, handleMessageMuteToggle };
}