import { RouterProvider } from "react-router-dom"
import Router from "./router"
import { toast, ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import useGroupApis from "./customHooks/useGroupApis"
import { useEffect } from "react"
import { useSocket } from "./context/SocketProvider"
import { useMessage } from "./context/MessageProvider"
import { useUser } from "./context/UserProvider"
import type { chatUser, MessageProps } from "./types/message.types"
import { useGroup } from "./context/GroupProvider"
import type { Group } from "./types/group.type"
import { AxiosClient } from "./api/AxiosClient"



function App() {
  const socket = useSocket();
  const { getGroupByUser } = useGroupApis();

  //context
  const { setListOfChatUsers, listOfAllUsers, activeUserId, setMessage, listOfChatUsers, setOnlineUserIds } = useMessage();
  const { user } = useUser();
  const { listOfgroups, setListOfgroups } = useGroup();
    const { MarkGroupMessageAsRead } = useGroupApis();


  // REGISTER USER TO SOCKET.IO SERVER AND LISTEN FOR ONLINE USERS
  useEffect(() => {
    if (!socket || !user?.id) return;

    const handleConnect = () => {
      socket.emit("register", user.id);
    };

    const handleOnlineUsers = (user: { users: number[] }) => {
      const { users } = user;
      setOnlineUserIds(users || []);
    };

    const handleUserOnline = (userId: number) => {
      setOnlineUserIds((prev) => {
        if (prev.includes(userId)) return prev;
        return [...prev, userId];
      });
    };

    const handleofflineUser = (userId: number) => {
      setOnlineUserIds((prev) => {
        return prev.filter(id => id !== userId);
      });
    }


    if (socket.connected) {
      handleConnect();
    }

    socket.on("connect", handleConnect);
    socket.on("online_users", handleOnlineUsers);
    socket.on("user_online", handleUserOnline);
    socket.on("user_offline", handleofflineUser);

    return () => {
      socket.off("connect", handleConnect);
      socket.off("online_users", handleOnlineUsers);
      socket.off("user_online", handleUserOnline);
      socket.off("user_offline", handleofflineUser);
    };
  }, [socket, user?.id, setOnlineUserIds]);




  useEffect(() => {
    if (!socket) return;
    socket.on("group_created", (group) => {
      socket.emit("join_group", { groupId: group.id });
      getGroupByUser();
    });

    socket.on("group_updated", ({ groupId, newMemberIds }) => {
      if (newMemberIds.includes(Number(user?.id))) {
        socket.emit("join_group", { groupId, userId: user?.id });
        setTimeout(() => {
          getGroupByUser();
        }, 1000);
      }
    });

    return () => {
      socket.off("group_created");
      socket.off("group_updated");
    };
  }, [socket]);

  //listen for incoming group messages
  useEffect(() => {
    if (!socket) return;

    const handleGroupMessage = (msg: { groupId: number; fromUserId: number; content: string; timestamp: Date }) => {
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
          const isMuted = group.members?.some(member => member.userId === user?.id && member.isMuted);
          if (!isMuted) {
            toast.info(`New message in group @${group.groupName}`);
          }
        }
      }


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

   
      if(activeUserId === String(msg.groupId)){;

           setListOfgroups((prev: Group[]) => {
        return prev.map((group) => {
          if (String(group.id) === String(msg.groupId)) {
            const updateGroupMessages = [
              ...(group.groupMessages || []), {
                senderId: msg.fromUserId,
                groupId: String(msg.groupId),
                content: msg.content,
                createdAt: new Date().toISOString(),
                isReadBy: activeUserId === String(msg.groupId) && user?.id ? [user.id] : []
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
        MarkGroupMessageAsRead(activeUserId, user?.id);
      }

    };

    socket.on("group_message", handleGroupMessage);

    return () => {
      socket.off("group_message", handleGroupMessage);
    };
  }, [socket, activeUserId, setMessage, listOfAllUsers, listOfChatUsers, setListOfChatUsers, listOfgroups, user?.id]);


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
      


      if(activeUserId === String(msg.fromUserId)){
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
                isRead: true
              }]
            }
          }
          return user;
        })
      })
    }

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
      if(activeUserId === String(msg.fromUserId)){
        
        await AxiosClient.post("/messages/updateMessage", { messageId: msg.messageId });
      }
    };

    socket.on("private_message", handleMessageReceived);

    return () => {
      socket.off("private_message", handleMessageReceived);
    };
  }, [socket, activeUserId, setMessage, listOfAllUsers, listOfChatUsers, setListOfChatUsers]);


  return (
    <>
      <ToastContainer
        position="top-center"
        autoClose={3000}
        hideProgressBar={true}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        icon={false}
        closeButton={false}
        className="toast-island-container"
        toastClassName="toast-island"
      />
      <RouterProvider router={Router} />

    </>
  )
}

export default App;
