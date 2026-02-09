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


const Chats = () => {


   //STATES
   const [activeUserId, setActiveUserId] = useState<number | null>(null);
   const [inputMessage, setInputMessage] = useState("");
   const toastRef = useRef(false);

   //HOOKS
   const socket = useSocket();
   const { user } = useUser();

   //CONTEXT
   const { setMessage, listOfAllUsers, listOfChatUsers, setListOfChatUsers, ShowToastOfUnreadMessage, message } = useMessage();
   const { fetchAllUsersForLiveSearch, getAsscociatedUsers, getMessages, getUnreadMessageChats } = useMessageApis();


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


   //to listen for incoming messages
   useEffect(() => {
      if (!socket) return;

      const handleMessageReceived = async (msg: { fromUserId: number; toUserId: number; content: string; timestamp: Date, messageId: number }) => {
         setMessage((prev: MessageProps[] | null) => [...(prev || []), {
            senderId: msg.fromUserId,
            receiverId: Number(msg.toUserId),
            content: msg.content,
            createdAt: msg.timestamp
         }]);

         if (activeUserId !== msg.fromUserId) {
            toast.info(`New message from @${listOfAllUsers.find((user: chatUser) => user.id === msg.fromUserId)?.username || "Unknown User"}`);

            const newUser = listOfChatUsers.find((user: chatUser) => user.id === msg.fromUserId);
            if (newUser) {
               setListOfChatUsers((prev) => {
                  return prev.map((user: chatUser) => {
                     if (user.id === msg.fromUserId) {
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

   useEffect(() => {
      setTimeout(() => {
         getMessagesForActiveUser();
      }, 100);
      const getMessagesForActiveUser = async () => {
         if (activeUserId === null) return;
         try {
            await getMessages(activeUserId);

         } catch (error) {
            toast.error(String(error));
         }
      }
   }, [activeUserId]);

   useEffect(() => {
      if (ShowToastOfUnreadMessage && ShowToastOfUnreadMessage.length > 0 && !toastRef.current) {
         ShowToastOfUnreadMessage.forEach((user: chatUser) => {
            toast.info(`New message from @${user.username}`)
         })
         toastRef.current = true;
      }
   }, [ShowToastOfUnreadMessage]);

   //Functions
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
            return (msg.senderId === Number(user?.id) && msg.senderId === activeUserId && msg.isRead === false);

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


   console.log("list Of User", listOfChatUsers);

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
                     <button className="px-2.5 py-1 rounded-md bg-slate-900 text-white">All</button>
                     <button className="px-2.5 py-1 rounded-md border border-slate-200 text-slate-600 hover:bg-slate-50 transition">Unread</button>
                     <button className="px-2.5 py-1 rounded-md border border-slate-200 text-slate-600 hover:bg-slate-50 transition">Groups</button>
                  </div>
               </div>

               <div className="px-3 py-4 h-[calc(100vh-200px)] overflow-y-auto flex flex-col gap-2 customScrollbar pr-1">
                  {listOfChatUsers.map((user: chatUser) => {
                     const allMessages = [
                        ...(user.sentMessages || []),
                        ...(user.receivedMessages || [])
                     ];

                     return (
                        <ChatList
                           key={user.id}
                           id={user.id}
                           username={user.username}
                           setActiveUserId={setActiveUserId}
                           activeUserId={activeUserId}
                           receivedMessages={allMessages}
                           isOnline={user.isOnline}
                        />
                     );
                  })}
               </div>
            </div>


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
         </div>
      </div>
   )
};

export default Chats;   
