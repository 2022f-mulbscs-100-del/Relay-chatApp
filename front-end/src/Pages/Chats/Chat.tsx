import ChatList from "./ChatList"
import ChatPage from "./ChatPage";
import { useEffect, useMemo, useRef, useState } from "react";
import { useSocket } from "../../context/SocketProvider";
import { useUser } from "../../context/UserProvider";
import { useMessage } from "../../context/MessageProvider";
import { toast } from "react-toastify";
import type { AssociatedUser, chatUser, MessageProps } from "../../types/message.types";
import { useMessageApis } from "../../customHooks/useMessageApis";
import LiveSearch from "./LiveSearch";
import { useGroup } from "../../context/GroupProvider";
import type { Group } from "../../types/group.type";
import useGroupApis from "../../customHooks/useGroupApis";
import SkeletonBlock from "../../Component/SkeletonBlock";

const Chats = () => {
   const url = new URL(window.location.href);

   //STATES
   const [inputMessage, setInputMessage] = useState("");
   const [tab, setTab] = useState<"chats" | "unread" | "groups">(url.searchParams.get("tab") as "chats" | "unread" | "groups" || "chats");
   const toastRef = useRef(false);
   const [previewImageUrl, setPreviewImageUrl] = useState<string | null>(null);

   //loading states
   const [chatListLoading, setChatListLoading] = useState(false);

   //HOOKSf
   const socket = useSocket();
   const { fetchAllUsersForLiveSearch, getAsscociatedUsers, getMessages, getUnreadMessageChats, loading: messageLoading } = useMessageApis();
   const { getGroupMessages, MarkGroupMessageAsRead, loading: groupMessageLoading } = useGroupApis();

   //CONTEXT
   const { user } = useUser();
   const { listOfgroups, setListOfgroups, loading: groupListLoading } = useGroup();
   const { setMessage, listOfAllUsers, ShowToastOfUnreadMessage, activeUserId, setActiveUserId, associatedUser, setAssociatedUser } = useMessage();
   const { onlineUserIds } = useMessage();



   //Send Private Message
   const SendMessage = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      if (!socket || activeUserId === null) return;
      if (!previewImageUrl) {
         if (inputMessage.trim() === "") return;
      }
      const imageBuffer = await toBuffer(previewImageUrl);
      socket.emit("private_message", {
         content: inputMessage,
         toUserId: String(activeUserId),
         imageUrl: imageBuffer
      });

      // const isSaved = async () => {
      //    if (message?.length === 0) {
      //       await AxiosClient.post("/users/UpdateUser", { userId: activeUserId });
      //    }
      //    const FilterMessage = message?.some((msg) => {
      //       return (msg.senderId === Number(user?.id) && String(msg.senderId) === activeUserId && msg.isRead === false);

      //    })
      //    if (!FilterMessage) return false;
      //    await AxiosClient.post("/users/UpdateUser", { userId: activeUserId });
      //    return FilterMessage;
      // }

      setMessage((prev: MessageProps[] | null) => [...(prev || []), {
         senderId: Number(user?.id),
         receiverId: Number(activeUserId),
         content: inputMessage,
         ImageUrl: previewImageUrl || undefined,
         createdAt: new Date()
      }]);

      setAssociatedUser((prev) => {
         const existingAssociation = prev.find((association) => String(association.associateUserId) === String(activeUserId));

         if (existingAssociation) {
            return prev.map((association) => {
               if (String(association.associateUserId) === String(activeUserId)) {
                  return {
                     ...association,
                     associatedUser: {
                        ...association.associatedUser,
                        receivedMessages: [
                           ...(association.associatedUser.receivedMessages || []),
                           {
                              id: Date.now(),
                              senderId: Number(user?.id),
                              receiverId: Number(activeUserId),
                              content: inputMessage,
                              createdAt: new Date(),
                              isRead: false
                           }
                        ]
                     }
                  };
               }
               return association;
            });
         }


         const userToAdd = listOfAllUsers.find((chatUser) => String(chatUser.id) === String(activeUserId));
         if (!userToAdd || !user?.id) {
            return prev;
         }
         const numericUserId = Number(user.id);
         if (Number.isNaN(numericUserId)) {
            return prev;
         }
         return [...prev, {
            id: Date.now(),
            userId: numericUserId,
            associateUserId: userToAdd.id,
            associatedUser: {
               ...userToAdd,
               receivedMessages: [{
                  id: Date.now(),
                  senderId: Number(user?.id),
                  receiverId: Number(activeUserId),
                  content: inputMessage,
                  createdAt: new Date(),
                  isRead: false
               }]
            },
            category: "",
            isMuted: false,
            isPinned: false
         }];
      });

      setInputMessage("");
      setPreviewImageUrl(null);
      // await isSaved();

   }

   //Send Group Message
   const SendGroupMessage = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      if (!socket || activeUserId === null) return;
      if (!previewImageUrl) {
         if (inputMessage.trim() === "") return;
      }
      const imageBuffer = await toBuffer(previewImageUrl);
      console.log("---->>>>>>>", imageBuffer);
      socket.emit("group_message", {
         content: inputMessage,
         userId: String(user?.id),
         groupId: String(activeUserId),
         timestamp: new Date(),
         ImageUrl: imageBuffer
      });
      setMessage((prev: MessageProps[] | null) => [...(prev || []), {
         groupId: String(activeUserId),
         senderId: Number(user?.id),
         content: inputMessage,
         createdAt: new Date().toISOString(),
         ImageUrl: previewImageUrl || undefined
      }]);


      MarkGroupMessageAsRead(activeUserId, user?.id);
      setListOfgroups((prev: Group[]) => {
         return prev.map((group) => {
            if (String(group.id) === String(activeUserId)) {
               const updateGroupMessages = [
                  ...(group.groupMessages || []), {
                     senderId: Number(user?.id),
                     groupId: String(activeUserId),
                     content: inputMessage,
                     createdAt: new Date().toISOString(),
                     isReadBy: user?.id ? [user.id] : []
                  }
               ];
               return {
                  ...group,
                  groupMessages: updateGroupMessages
               }
            }
            return group;
         })
      })

      setInputMessage("");

   }

   //EFFECTS

   //to fetch chats users for live search in chat list
   useEffect(() => {
      if (!user?.id) return;
      const fetcheLiveSearchData = async () => {
         try {
            await fetchAllUsersForLiveSearch();

         } catch (error) {
            toast.error(String(error));
         }
      }
      fetcheLiveSearchData();
   }, [user?.id]);

   //to fetch associated users for chat list and to fetch unread message chats when user logs in
   useEffect(() => {
      if (!user?.id) return;
      const getUsers = async () => {
         setChatListLoading(true);
         try {
            await getAsscociatedUsers();
         } catch (error) {
            toast.error(String(error));
         } finally {
            setChatListLoading(false);
         }

      }
      const fetchUnreadChats = async () => {
         try {
            await getUnreadMessageChats();
         } catch (error) {
            toast.error(String(error));
         }
      }

      fetchUnreadChats();
      getUsers();
   }, [user?.id]);

   //to fetch messages for active user or group when active user or group changes
   useEffect(() => {
      const getMessagesForActiveUser = async () => {
         if (activeUserId === null) return;
         try {
            if (tab === "groups") {
               await getGroupMessages(activeUserId);
            } else {
               await getMessages(activeUserId);
            }
         } catch (error) {
            toast.error(String(error));
         }
      }
      setTimeout(() => {
         getMessagesForActiveUser();
      }, 100);
   }, [activeUserId]);

   useEffect(() => {
      return () => {
         setActiveUserId(null);
      }
   }, [tab])

   //Toast for unread messages
   useEffect(() => {
      if (ShowToastOfUnreadMessage && ShowToastOfUnreadMessage.length > 0 && !toastRef.current) {
         ShowToastOfUnreadMessage.forEach((user: chatUser) => {
            toast.info(`New message from @${user.username}`)
         })
         toastRef.current = true;
      }
   }, [ShowToastOfUnreadMessage]);

   //set tab in url
   useEffect(() => {
      url.searchParams.get("tab")
      url.searchParams.set("tab", tab);
      window.history.replaceState(null, "", url);
   }, [tab])

   //updating the list to add the online user
   const usersWithOnlineStatus = useMemo(() => {
      return associatedUser.map((user: AssociatedUser) => {

         const isOnline = onlineUserIds.includes(Number(user.associatedUser.id));
         return {
            ...user,
            isOnline
         }
      })
   }, [onlineUserIds, associatedUser]);


   const toBuffer = async (fileUrl: string | null): Promise<ArrayBuffer | null> => {
      if (!fileUrl) return null;

      const response = await fetch(fileUrl);
      const fileBlob = await response.blob();
      return fileBlob.arrayBuffer();
   }

   const renderChatListSkeleton = (keyPrefix: string) =>
      Array.from({ length: 6 }).map((_, index) => (
         <div
            key={`${keyPrefix}-skeleton-${index}`}
            className="w-full rounded-xl border border-slate-200 bg-white px-3 py-3"
         >
            <div className="flex items-center gap-3">
               <div className="relative shrink-0">
                  <SkeletonBlock width={44} height={44} radius={999} />
                  <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-white bg-slate-200" />
               </div>
               <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                     <SkeletonBlock width="42%" height={12} />
                     <SkeletonBlock width={44} height={10} />
                  </div>
                  <div className="mt-2 flex items-center justify-between gap-2">
                     <SkeletonBlock width="68%" height={10} />
                     <SkeletonBlock width={18} height={18} radius={999} />
                  </div>
               </div>
            </div>
         </div>
      ));


   return (
      <div className="h-[100dvh] bg-slate-50">
         <div className="flex h-full overflow-hidden">
            <div className={`${activeUserId ? "hidden md:flex" : "flex"} w-full md:w-[340px] md:shrink-0 md:border-r border-slate-200 bg-white flex-col`}>
               <div className="px-3 py-4 border-b border-slate-200">
                  <div className="flex items-center justify-between">
                     <div>
                        <h1 className="text-xl font-semibold text-slate-900">Chats</h1>
                        <p className="text-xs text-slate-500">Keep up with your team</p>
                     </div>
                     <span className="text-xs text-slate-400">{tab === "chats" ? associatedUser.length : listOfgroups.length} total</span>
                  </div>

                  <LiveSearch
                     listOfAllUsers={listOfAllUsers}
                     setActiveUserId={setActiveUserId}
                     associatedUser={associatedUser}
                  />

                  <div className="mt-3 flex items-center gap-2 text-xs">
                     <button className={`px-2.5 py-1 rounded-md cursor-pointer ${tab === "chats" ? "bg-slate-900 text-white" : "border border-slate-200 text-slate-600 hover:bg-slate-50 transition"}`} onClick={() => setTab("chats")}>Chats</button>
                     {/* <button className={`px-2.5 py-1 rounded-md cursor-pointer ${tab === "unread" ? "bg-slate-900 text-white" : "border border-slate-200 text-slate-600 hover:bg-slate-50 transition"}`} onClick={() => setTab("unread")}>Unread</button> */}
                     <button className={`px-2.5 py-1 rounded-md cursor-pointer ${tab === "groups" ? "bg-slate-900 text-white" : "border border-slate-200 text-slate-600 hover:bg-slate-50 transition"}`} onClick={() => setTab("groups")}>Groups</button>
                  </div>
               </div>

               {/* Chat List */}
               {tab === "chats" &&
                  <div className="px-3 py-4 h-[calc(100dvh-190px)] md:h-[calc(100dvh-200px)] overflow-y-auto flex flex-col gap-2 customScrollbar pr-1">
                     {chatListLoading ? (
                        renderChatListSkeleton("chat")
                     ) : (
                        usersWithOnlineStatus.map((user: AssociatedUser) => {
                           const allMessages = [
                              ...(user.associatedUser.sentMessages || []),
                              ...(user.associatedUser.receivedMessages || [])
                           ];

                           return (
                              <ChatList
                                 key={user.id}
                                 id={String(user.associatedUser.id)}
                                 username={user.associatedUser.username}
                                 setActiveUserId={setActiveUserId}
                                 activeUserId={activeUserId}
                                 receivedMessages={allMessages}
                                 isOnline={user.isOnline}
                                 image={user.associatedUser.ImageUrl}
                                 mode="private"
                                 privateIsMuted={associatedUser?.find((association) => Number(association.associateUserId) === Number(user.associatedUser.id))?.isMuted || false}
                              />
                           );
                        })
                     )}
                  </div>
               }

               {/* Group list */}
               {tab === "groups" &&
                  <div className="px-3 py-4 h-[calc(100dvh-190px)] md:h-[calc(100dvh-200px)] overflow-y-auto flex flex-col gap-2 customScrollbar pr-1">
                     {groupListLoading ? (
                        renderChatListSkeleton("group")
                     ) : (
                        listOfgroups?.map((group: Group) => {
                           return (
                              <ChatList
                                 key={group.id}
                                 id={String(group.id)}
                                 username={group.groupName}
                                 receivedMessages={group.groupMessages}
                                 setActiveUserId={setActiveUserId}
                                 activeUserId={activeUserId}
                                 member={group.members}
                                 mode="group"
                              />
                           );
                        })
                     )}
                  </div>}

            </div>

            {/* chat page */}
            {tab === "chats" &&
               <main className={`${activeUserId ? "flex" : "hidden md:flex"} flex-1 min-w-0 bg-white`}>
                  {activeUserId ?
                     <ChatPage
                        inputMessage={inputMessage}
                        setInputMessage={setInputMessage}
                        SendMessage={SendMessage}
                        key={activeUserId}
                        activeUserId={activeUserId}
                        onBack={() => setActiveUserId(null)}
                        previewImageUrl={previewImageUrl}
                        setPreviewImageUrl={setPreviewImageUrl}
                        isMessagesLoading={messageLoading}
                     />
                     : (
                        <div className="flex h-full w-full items-center justify-center bg-slate-50">
                           <div className="text-center rounded-xl border border-slate-200 bg-white px-8 py-6 shadow-sm">
                              <div className="text-sm font-semibold text-slate-900">No chat selected</div>
                              <div className="text-xs text-slate-500 mt-1">Choose a conversation to start messaging</div>
                           </div>
                        </div>
                     )}
               </main>
            }

            {/* group page  */}
            {tab === "groups" &&
               <main className={`${activeUserId ? "flex" : "hidden md:flex"} flex-1 min-w-0 bg-white`}>
                  {activeUserId ?
                     <ChatPage
                        inputMessage={inputMessage}
                        setInputMessage={setInputMessage}
                        SendGroupMessage={SendGroupMessage}
                        key={listOfgroups?.length}
                        listOfgroups={listOfgroups}
                        activeUserId={activeUserId}
                        mode="group"
                        onBack={() => setActiveUserId(null)}
                        previewImageUrl={previewImageUrl}
                        setPreviewImageUrl={setPreviewImageUrl}
                        isMessagesLoading={groupMessageLoading}
                     />
                     : (
                        <div className="flex items-center justify-center w-full h-full bg-slate-50">
                           <div className="text-center rounded-xl border border-slate-200 bg-white px-8 py-6 shadow-sm">
                              <div className="text-sm font-semibold text-slate-900">No chat selected</div>
                              <div className="text-xs text-slate-500 mt-1">Choose a conversation to start messaging</div>
                           </div>
                        </div>
                     )}
               </main>
            }
         </div>
      </div>
   )
};

export default Chats;   
