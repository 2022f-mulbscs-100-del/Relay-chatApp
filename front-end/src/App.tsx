import { RouterProvider } from "react-router-dom"
import Router from "./router"
import { toast, ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import useGroupApis from "./customHooks/useGroupApis"
import { useEffect } from "react"
import { useSocket } from "./context/SocketProvider"
import { useMessage } from "./context/MessageProvider"
import { useUser } from "./context/UserProvider"
import type { AssociatedUser, chatUser, MessageProps } from "./types/message.types"
import { useGroup } from "./context/GroupProvider"
import type { Group } from "./types/group.type"
import { AxiosClient } from "./api/AxiosClient"



function App() {


  //apis
  const { MarkGroupMessageAsRead } = useGroupApis();
  const { getGroupByUser } = useGroupApis();

  //context
  const socket = useSocket();
  const { listOfAllUsers, activeUserId, setMessage, setOnlineUserIds, associatedUser, setAssociatedUser, setActiveUserId } = useMessage();
  const { user } = useUser();
  const { listOfgroups, setListOfgroups } = useGroup();


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

  // to listen for group creation and updates to join the group room
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
      console.log("Received group message:", msg);
      setMessage((prev: MessageProps[] | null) =>
        [...(prev || []), {
          senderId: msg.fromUserId,
          groupId: String(msg.groupId),
          content: msg.content,
          createdAt: msg.timestamp
        }])

      if (activeUserId !== String(msg.groupId)) {
        if (!user?.messageAlerts) return;
        const group = listOfgroups?.find(group => String(group.id) === String(msg.groupId));
        if (group) {
          const isMuted = group.members?.some(member => member.userId === user?.id && member.isMuted);
          if (!isMuted) {
            toast.info(
              <div
                onClick={() => {
                  window.history.pushState({}, "", "/?tab=groups");
                  setActiveUserId(String(msg.groupId))
                }}
              >
                {`New message in group @${group.groupName}`}
              </div>

            );
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


      if (activeUserId === String(msg.groupId)) {
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
  }, [socket, activeUserId, setMessage, listOfAllUsers, listOfgroups, user?.id]);

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

      if (activeUserId === String(msg.fromUserId)) {
        setAssociatedUser((prev) => {
          return prev.map((association) => {
            if (String(association.associateUserId) === String(msg.fromUserId)) {
              const updatedReceivedMessages = [...(association.associatedUser?.receivedMessages || []), {
                id: msg.messageId,
                senderId: msg.fromUserId,
                receiverId: Number(msg.toUserId),
                content: msg.content,
                createdAt: msg.timestamp,
                isRead: true
              }]
              return {
                ...association,
                associatedUser: {
                  ...association.associatedUser,
                  receivedMessages: updatedReceivedMessages
                }
              }
            }
            return association;
          })
        })
      }


      if (activeUserId !== String(msg.fromUserId)) {
        if (!user?.messageAlerts) return;
        const isMuted = associatedUser?.find((user: AssociatedUser) => String(user.associateUserId) === String(msg.fromUserId))?.isMuted;
        if (!isMuted) {
          toast.info(
            <div
              onClick={() => {
                window.history.pushState({}, "", "/?tab=chats");
                setActiveUserId(String(msg.fromUserId))
              }}
            >
              {`New message from @${listOfAllUsers.find((user: chatUser) => user.id === msg.fromUserId)?.username || "Unknown User"}`}
            </div>

          );
        }

        const newUser = associatedUser?.find((user: AssociatedUser) => String(user.associateUserId) === String(msg.fromUserId));
        if (newUser) {

          setAssociatedUser((prev) => {
            return prev.map((association) => {
              if (String(association.associateUserId) === String(msg.fromUserId)) {
                const updatedReceivedMessages = [...(association.associatedUser?.receivedMessages || []), {
                  id: msg.messageId,
                  senderId: msg.fromUserId,
                  receiverId: Number(msg.toUserId),
                  content: msg.content,
                  createdAt: msg.timestamp,
                  isRead: false
                }]
                return {
                  ...association,
                  associatedUser: {
                    ...association.associatedUser,
                    receivedMessages: updatedReceivedMessages
                  }
                }
              }
              return association;
            })
          })
        }
        if (!newUser) {
          const userToAdd = listOfAllUsers.find((user: chatUser) => user.id === Number(msg.fromUserId));
          if (userToAdd) {

            setAssociatedUser((prev) => {
              if (prev.some((association) => Number(association.associateUserId) === Number(userToAdd.id))) {
                return prev;
              }
              if (!user?.id) {
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
                associatedUser: userToAdd,
                category: "",
                isMuted: false,
                isPinned: false
              }];
            }

            );
          }
        }
      }
      if (activeUserId === String(msg.fromUserId)) {
        await AxiosClient.post("/messages/updateMessage", { messageId: msg.messageId });
      }
    };

    socket.on("private_message", handleMessageReceived);

    return () => {
      socket.off("private_message", handleMessageReceived);
    };
  }, [socket, activeUserId, setMessage, listOfAllUsers, associatedUser, setAssociatedUser, user?.messageAlerts]);


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
