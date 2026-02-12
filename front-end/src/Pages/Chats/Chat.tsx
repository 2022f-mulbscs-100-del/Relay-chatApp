import ChatList from "./ChatList"
import ChatPage from "./ChatPage";
import { useEffect, useRef, useState } from "react";
import { useSocket } from "../../context/SocketProvider";
import { useUser } from "../../context/UserProvider";
import { useMessage } from "../../context/MessageProvider";
import { toast } from "react-toastify";
import type { chatUser, MessageProps } from "../../types/message.types";
import { useMessageApis } from "../../customHooks/useMessageApis";
import { AxiosClient } from "../../api/AxiosClient";
import LiveSearch from "./LiveSearch";
import { useGroup } from "../../context/GroupProvider";
import type { Group } from "../../types/group.type";
import useGroupApis from "../../customHooks/useGroupApis";



const Chats = () => {

   const url = new URL(window.location.href);


   //STATES
   const [activeUserId, setActiveUserId] = useState<string | null>(null);
   const [inputMessage, setInputMessage] = useState("");
   const [tab, setTab] = useState<"all" | "unread" | "groups">(url.searchParams.get("tab") as "all" | "unread" | "groups" || "all");
   const toastRef = useRef(false);

   //HOOKSf
   const socket = useSocket();
   const { fetchAllUsersForLiveSearch, getAsscociatedUsers, getMessages, getUnreadMessageChats } = useMessageApis();
   const { getGroupMessages } = useGroupApis();
   //CONTEXT
   const { user } = useUser();
   const { listOfgroups, setListOfgroups } = useGroup();
   const { setMessage, listOfAllUsers, listOfChatUsers, setListOfChatUsers, ShowToastOfUnreadMessage, message } = useMessage();


   //EFFECTS

   // REGISTER USER TO SOCKET.IO SERVER AND LISTEN FOR ONLINE USERS
   useEffect(() => {
      if (!socket || !user?.id) return;

      const handleConnect = () => {
         socket.emit("register", user.id);
      };

      const handleUserOnline = (userId: { users: number[] }) => {
         const { users } = userId;
         users?.map((id: number) => {
            setListOfChatUsers((prev) => {
               return prev.map((user: chatUser) => {
                  if (user.id === id) {
                     return {
                        ...user,
                        isOnline: true
                     }
                  }
                  return user;
               })
            })

         });
      };

      if (socket.connected) {
         handleConnect();
      }

      socket.on("connect", handleConnect);
      socket.on("online_users", handleUserOnline);

      return () => {
         socket.off("connect", handleConnect);
         socket.off("user_online", handleUserOnline);
      };
   }, [socket, user?.id]);

   //listen for incoming group messages
   useEffect(() => {
      if (!socket) return;

      const handleGroupMessage = (msg: { groupId: number; fromUserId: number; content: string; timestamp: Date }) => {
         console.log(msg, "incoming group message"); // Log the incoming message
         if (String(msg.fromUserId) === String(user?.id)) return;
         setMessage((prev: MessageProps[] | null) =>
            [...(prev || []), {
               senderId: msg.fromUserId,
               groupId: String(msg.groupId),
               content: msg.content,
               createdAt: msg.timestamp
            }])

         if (activeUserId !== String(msg.groupId)) {
            const group = listOfgroups?.find(group => String(group.id) === String(msg.groupId));
            if (group) {
               toast.info(`New message in group @${group.groupName}`);
            }
         }

         // setListOfgroups((prev: Group[]) => {
         //    return prev.map((group: Group) => {
         //       if (String(group.id) === String(msg.groupId)) {
         //          const updatedGroupMessages = [...(group.groupMessages || []), {
         //             senderId: msg.fromUserId,
         //             groupId: String(msg.groupId),
         //             content: msg.content,
         //             createdAt: msg.timestamp,
         //             isReadBy: []
         //          }];

         //          return {
         //             ...group,
         //             groupMessages: updatedGroupMessages
         //          }
         //       }
         //       return group;
         //    })
         // })
         if (activeUserId !== String(msg.groupId)) {

            setListOfgroups((prev: Group[]) => {
               return prev.map((group) => {
                  if (String(group.id) === String(msg.groupId)) {
                     const updateGroupMessages = [
                        ...(group.groupMessages || []), {
                           senderId: msg.fromUserId,
                           groupId: String(msg.groupId),
                           content: msg.content,
                           createdAt: new Date().toISOString(),
                           isReadBy: []
                        }
                     ]
                     return {
                        ...group,
                        groupMessages: updateGroupMessages
                     }
                  }
                  return group;
               })
            })
         }

      };

      socket.on("group_message", handleGroupMessage);

      return () => {
         socket.off("group_message", handleGroupMessage);
      };
   }, [socket, activeUserId, setMessage, listOfAllUsers, listOfChatUsers, setListOfChatUsers, listOfgroups, user?.id]);


   console.log(listOfgroups)
   //to listen for incoming private messages
   useEffect(() => {
      if (!socket) return;

      const handleMessageReceived = async (msg: { fromUserId: number; toUserId: number; content: string; timestamp: Date, messageId: number }) => {
         setMessage((prev: MessageProps[] | null) => [...(prev || []), {
            senderId: msg.fromUserId,
            receiverId: Number(msg.toUserId),
            content: msg.content,
            createdAt: msg.timestamp
         }]);

         if (activeUserId !== String(msg.fromUserId)) {
            toast.info(`New message from @${listOfAllUsers.find((user: chatUser) => user.id === msg.fromUserId)?.username || "Unknown User"}`);

            const newUser = listOfChatUsers.find((user: chatUser) => String(user.id) === String(msg.fromUserId));
            if (newUser) {
               setListOfChatUsers((prev) => {
                  return prev.map((user: chatUser) => {
                     if (String(user.id) === String(msg.fromUserId)) {
                        return {
                           ...user,
                           receivedMessages: [...(user.receivedMessages || []), {
                              id: msg.messageId,
                              senderId: msg.fromUserId,
                              receiverId: Number(msg.toUserId),
                              content: msg.content,
                              createdAt: msg.timestamp,
                              isRead: false
                           }]
                        }
                     }
                     return user;
                  })


               })
            }
            if (!newUser) {
               const userToAdd = listOfAllUsers.find((user: chatUser) => user.id === Number(msg.fromUserId));
               if (userToAdd) {
                  const userWithMessage: chatUser = {
                     ...userToAdd,
                     receivedMessages: [...(userToAdd?.receivedMessages || []), {
                        id: msg.messageId,
                        senderId: msg.fromUserId,
                        receiverId: Number(msg.toUserId),
                        content: msg.content,
                        createdAt: msg.timestamp,
                        isRead: false
                     }]
                  };
                  setListOfChatUsers((prev) => [...prev, userWithMessage]);
               }
            }
         }
         await AxiosClient.post("/messages/updateMessage", { messageId: msg.messageId });
      };

      socket.on("private_message", handleMessageReceived);

      return () => {
         socket.off("private_message", handleMessageReceived);
      };
   }, [socket, activeUserId, setMessage, listOfAllUsers, listOfChatUsers, setListOfChatUsers]);

   //to fetch all users for live search in chat list
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
         try {
            await getAsscociatedUsers();
         } catch (error) {
            toast.error(String(error));
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



   //Toast for unread messages
   useEffect(() => {
      if (ShowToastOfUnreadMessage && ShowToastOfUnreadMessage.length > 0 && !toastRef.current) {
         ShowToastOfUnreadMessage.forEach((user: chatUser) => {
            toast.info(`New message from @${user.username}`)
         })
         toastRef.current = true;
      }
   }, [ShowToastOfUnreadMessage]);

   //Send Private Message
   const SendMessage = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      if (!socket || activeUserId === null) return;
      if (inputMessage.trim() === "") return;
      socket.emit("private_message", {
         content: inputMessage,
         toUserId: String(activeUserId)
      });

      const isSaved = async () => {
         if (message?.length === 0) {
            await AxiosClient.post("/users/UpdateUser", { userId: activeUserId });
         }
         const FilterMessage = message?.some((msg) => {
            return (msg.senderId === Number(user?.id) && String(msg.senderId) === activeUserId && msg.isRead === false);

         })
         if (!FilterMessage) return false;
         await AxiosClient.post("/users/UpdateUser", { userId: activeUserId });
         return FilterMessage;
      }


      setMessage((prev: MessageProps[] | null) => [...(prev || []), {
         senderId: Number(user?.id),
         receiverId: Number(activeUserId),
         content: inputMessage,
         createdAt: new Date()
      }]);

      setInputMessage("");
      await isSaved();

   }

   //Send Group Message
   const SendGroupMessage = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      if (!socket || activeUserId === null) return;
      if (inputMessage.trim() === "") return;

      socket.emit("group_message", {
         content: inputMessage,
         userId: String(user?.id),
         groupId: String(activeUserId),
         timestamp: new Date()
      });
      setMessage((prev: MessageProps[] | null) => [...(prev || []), {
         groupId: String(activeUserId),
         senderId: Number(user?.id),
         content: inputMessage,
         createdAt: new Date().toISOString(),
      }]);

      setInputMessage("");

   }


   useEffect(() => {
      url.searchParams.get("tab")
      url.searchParams.set("tab", tab);
      window.history.replaceState(null, "", url);
   }, [tab])




   return (

      <div className="min-h-screen bg-slate-50">
         <div className="flex h-screen">
            <div className="w-[340px] shrink-0 border-r border-slate-200 bg-white">
               <div className="px-3 py-4 border-b border-slate-200">
                  <div className="flex items-center justify-between">
                     <div>
                        <h1 className="text-xl font-semibold text-slate-900">Chats</h1>
                        <p className="text-xs text-slate-500">Keep up with your team</p>
                     </div>
                     <span className="text-xs text-slate-400">{listOfChatUsers.length} total</span>
                  </div>

                  <LiveSearch
                     listOfAllUsers={listOfAllUsers}
                     setActiveUserId={setActiveUserId}
                     setListOfChatUsers={setListOfChatUsers}
                     listOfChatUsers={listOfChatUsers}
                  />

                  <div className="mt-3 flex items-center gap-2 text-xs">
                     <button className={`px-2.5 py-1 rounded-md cursor-pointer ${tab === "all" ? "bg-slate-900 text-white" : "border border-slate-200 text-slate-600 hover:bg-slate-50 transition"}`} onClick={() => setTab("all")}>All</button>
                     <button className={`px-2.5 py-1 rounded-md cursor-pointer ${tab === "unread" ? "bg-slate-900 text-white" : "border border-slate-200 text-slate-600 hover:bg-slate-50 transition"}`} onClick={() => setTab("unread")}>Unread</button>
                     <button className={`px-2.5 py-1 rounded-md cursor-pointer ${tab === "groups" ? "bg-slate-900 text-white" : "border border-slate-200 text-slate-600 hover:bg-slate-50 transition"}`} onClick={() => setTab("groups")}>Groups</button>
                  </div>
               </div>

               {tab === "all" &&
                  <div className="px-3 py-4 h-[calc(100vh-200px)] overflow-y-auto flex flex-col gap-2 customScrollbar pr-1">
                     {listOfChatUsers.map((user: chatUser) => {
                        const allMessages = [
                           ...(user.sentMessages || []),
                           ...(user.receivedMessages || [])
                        ];

                        return (

                           <ChatList
                              key={user.id}
                              id={String(user.id)}
                              username={user.username}
                              setActiveUserId={setActiveUserId}
                              activeUserId={activeUserId}
                              receivedMessages={allMessages}
                              isOnline={user.isOnline}
                              mode="private"
                           />
                        );
                     })}
                  </div>
               }
               {tab === "groups" &&
                  <div className="px-3 py-4 h-[calc(100vh-200px)] overflow-y-auto flex flex-col gap-2 customScrollbar pr-1">
                     {listOfgroups?.map((group: Group) => {
                        return (
                           <ChatList
                              key={group.id}
                              id={String(group.id)}
                              username={group.groupName}
                              receivedMessages={group.groupMessages}
                              setActiveUserId={setActiveUserId}
                              activeUserId={activeUserId}
                              mode="group"
                           />
                        );
                     })}
                  </div>}

            </div>
            {tab === "all" &&
               <main className="flex-1 bg-white">
                  {activeUserId ?
                     <ChatPage
                        inputMessage={inputMessage}
                        setInputMessage={setInputMessage}
                        SendMessage={SendMessage}
                        key={activeUserId}
                        listOfChatUsers={listOfChatUsers}
                        activeUserId={activeUserId} />
                     : (
                        <div className="flex items-center justify-center h-full bg-slate-50">
                           <div className="text-center rounded-xl border border-slate-200 bg-white px-8 py-6 shadow-sm">
                              <div className="text-sm font-semibold text-slate-900">No chat selected</div>
                              <div className="text-xs text-slate-500 mt-1">Choose a conversation to start messaging</div>
                           </div>
                        </div>
                     )}
               </main>
            }
            {tab === "groups" &&
               <main className="flex-1 bg-white">
                  {activeUserId ?
                     <ChatPage
                        inputMessage={inputMessage}
                        setInputMessage={setInputMessage}
                        SendGroupMessage={SendGroupMessage}
                        key={listOfgroups?.length}
                        listOfgroups={listOfgroups}
                        activeUserId={activeUserId}
                        mode="group"
                     />
                     : (
                        <div className="flex items-center justify-center h-full bg-slate-50">
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
