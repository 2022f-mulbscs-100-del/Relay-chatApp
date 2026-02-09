import { IoSearchOutline } from "react-icons/io5";
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


const Chats = () => {



   const [activeUserId, setActiveUserId] = useState<number | null>(null);
   const socket = useSocket();
   const { user } = useUser();
   const { setMessage, listOfAllUsers, listOfChatUsers, setListOfChatUsers, ShowToastOfUnreadMessage, message } = useMessage();
   const [userList, setUserList] = useState<string>("");
   const { fetchAllUsersForLiveSearch, getAsscociatedUsers, getMessages, getUnreadMessageChats } = useMessageApis();

   // const connectedUsers: { [key: string]: boolean } = {};

   useEffect(() => {
      if (!socket || !user?.id) return;

      const handleConnect = () => {
         socket.emit("register", user.id);
      };


      if (socket.connected) {
         handleConnect();
      }

      socket.on("connect", handleConnect);

      socket.on("user_online", (userId) => {
         // connectedUsers[userId] = true;
         // connectedUsers.set(userId, true);
         console.log(`User ${userId} is online`);
      });

      return () => {
         socket.off("connect", handleConnect);
      };
   }, [socket, user?.id]);




   useEffect(() => {
      if (!socket) return;

      const handleMessageReceived = async (msg: { fromUserId: number; toUserId: number; content: string; timestamp: Date, messageId: number }) => {
         setMessage((prev: MessageProps[] | null) => [...(prev || []), {
            senderId: msg.fromUserId,
            receiverId: Number(msg.toUserId),
            content: msg.content,
            createdAt: msg.timestamp
         }]);

         if(activeUserId !== msg.fromUserId){
            toast.info(`New message from @${listOfChatUsers.find((user: chatUser) => user.id === msg.fromUserId)?.username || "Unknown User"}`);
         }
         await AxiosClient.post("/messages/updateMessage", { messageId: msg.messageId });
      };

      socket.on("private_message", handleMessageReceived);

      return () => {
         socket.off("private_message", handleMessageReceived);
      };
   }, [socket, activeUserId, setMessage]);

   const [inputMessage, setInputMessage] = useState("");


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
      const getUsers = async () => {
         try {
            await getAsscociatedUsers();
         } catch (error) {
            toast.error(String(error));
         }

      }
      getUsers();
   }, []);

   useEffect(() => {
      const getMessagesForActiveUser = async () => {
         if (activeUserId === null) return;
         try {
            await getMessages(activeUserId);
         } catch (error) {
            toast.error(String(error));
         }
      }
      getMessagesForActiveUser();
   }, [activeUserId, setMessage]);



   useEffect(() => {
      const fetchUnreadChats = async () => {
         try {
            await getUnreadMessageChats();
         } catch (error) {
            toast.error(String(error));
         }
      }
      fetchUnreadChats();
   }, []);

   const toastRef = useRef(false);

   useEffect(() => {
      if (ShowToastOfUnreadMessage && ShowToastOfUnreadMessage.length > 0 && !toastRef.current) {
         ShowToastOfUnreadMessage.forEach((user: chatUser) => {
            toast.info(`New message from @${user.username}`)
         })
         toastRef.current = true;
      }
   }, [ShowToastOfUnreadMessage]);

   const filterUser = listOfAllUsers.filter((user) => {
      return user.username.toLowerCase().includes(userList.toLowerCase());
   })



   return (

      <div className="min-h-screen bg-slate-50">
         <div className="flex h-screen">
            <aside className="w-[340px] shrink-0 border-r border-slate-200 bg-white">
               <div className="px-3 py-4 border-b border-slate-200">
                  <div className="flex items-center justify-between">
                     <div>
                        <h1 className="text-xl font-semibold text-slate-900">Chats</h1>
                        <p className="text-xs text-slate-500">Keep up with your team</p>
                     </div>
                     <span className="text-xs text-slate-400">{listOfChatUsers.length} total</span>
                  </div>
                  <div className="mt-3 relative">
                     <div className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 flex items-center gap-2 text-slate-500">
                        <IoSearchOutline className="text-slate-400" />
                        <input
                           className="outline-none bg-transparent w-full text-sm"
                           type="text"
                           placeholder="Search users"
                           value={userList}
                           onChange={(e) => setUserList(e.target.value)}
                        />
                        {filterUser.length !== 0 && userList.length > 1 &&
                           <div>
                              <div className="absolute left-0 top-10 bg-white/95 border border-slate-200 rounded-xl mt-2 w-[315px] shadow-lg z-10 overflow-hidden">
                                 {filterUser.map((user: chatUser) => (
                                    <div
                                       key={user.id}
                                       className="px-3 py-2.5 cursor-pointer hover:bg-slate-50 transition"
                                       onClick={() => {
                                          if (listOfChatUsers.find((chatUser) => chatUser.id === user.id)) {
                                             setActiveUserId(user.id);
                                             setUserList("");
                                             return;
                                          }
                                          setListOfChatUsers((prev) => [...prev, user]);
                                          setActiveUserId(user.id);
                                          setUserList("");
                                       }}
                                    >
                                       <div className="flex items-center gap-3">
                                          <div className="w-9 h-9 rounded-full bg-slate-200 flex items-center justify-center text-xs font-semibold text-slate-700">
                                             {user.username.slice(0, 2).toUpperCase()}
                                          </div>
                                          <div className="min-w-0">
                                             <h1 className="text-slate-900 font-semibold truncate">@{user.username}</h1>
                                             <p className="text-slate-500 text-xs truncate">{user?.email}</p>
                                          </div>
                                       </div>
                                    </div>
                                 ))}
                              </div>
                           </div>
                        }
                        {filterUser.length === 0 && userList.length > 1 &&
                           <div>
                              <div className="absolute bg-white border border-slate-200 rounded-md mt-1 w-[calc(340px-24px)] shadow-sm z-10">
                                 <div className="px-3 py-2 text-slate-500">
                                    No users found
                                 </div>
                              </div>
                           </div>
                        }
                     </div>
                  </div>
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
                        />
                     );
                  })}
               </div>
            </aside>


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
