import { IoSearchOutline } from "react-icons/io5";
// import ListOfUser from "./ListOfUser";
import ChatList from "./ChatList"
import ChatPage from "./ChatPage";
import { useEffect, useState } from "react";
// import { io } from "socket.io-client";
// import { useUser } from "../../src/context/UserProvider";
import { AxiosClient } from "../../api/AxiosClient";
import { useSocket } from "../../context/SocketProvider";
import { useUser } from "../../context/UserProvider";
type chatUser = {
   id: number;
   username: string;

}

const Chats = () => {



   const [activeUserId, setActiveUserId] = useState<number | null>(null);
   const [listOfChatUsers, setListOfChatUsers] = useState<chatUser[]>([]);
   const socket = useSocket();
   const { user } = useUser();
   useEffect(() => {
      socket?.on("connect", () => {
         console.log("Connected to socket server with id:", socket.id);
      });

      socket?.emit("register",user?.id);

      return () => {
         socket?.off("connect");
      };
   }, [socket, user?.id]);

   useEffect(() => {
      AxiosClient.get("/users/getUsers").then((response) => {
         console.log("Users fetched", response.data);
         setListOfChatUsers(response.data.users);
      }).catch((error) => {
         console.log("Failed to fetch users", error);
      });
   }, []);


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
                  <div className="mt-3">
                     <div className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 flex items-center gap-2 text-slate-500">
                        <IoSearchOutline className="text-slate-400" />
                        <input
                           className="outline-none bg-transparent w-full text-sm"
                           type="text"
                           placeholder="Search users"
                        />
                     </div>
                  </div>
                  <div className="mt-3 flex items-center gap-2 text-xs">
                     <button className="px-2.5 py-1 rounded-md bg-slate-900 text-white">All</button>
                     <button className="px-2.5 py-1 rounded-md border border-slate-200 text-slate-600 hover:bg-slate-50 transition">Unread</button>
                     <button className="px-2.5 py-1 rounded-md border border-slate-200 text-slate-600 hover:bg-slate-50 transition">Groups</button>
                  </div>
               </div>
               {/* <ListOfUser/> */}
               <div className="px-3 py-4 h-[calc(100vh-200px)] overflow-y-auto flex flex-col gap-2 customScrollbar pr-1">
                  {listOfChatUsers.map((user: chatUser) => (
                     <ChatList
                        key={user.id}
                        id={user.id}
                        username={user.username}
                        setActiveUserId={setActiveUserId}
                     />
                  ))}
               </div>
            </aside>
            <main className="flex-1 bg-white">
               {activeUserId ?
                  <ChatPage listOfChatUsers={listOfChatUsers} activeUserId={activeUserId} /> : (
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
