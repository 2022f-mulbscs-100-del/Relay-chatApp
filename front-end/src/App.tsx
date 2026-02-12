import { RouterProvider } from "react-router-dom"
import Router from "./router"
import { ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import useGroupApis from "./customHooks/useGroupApis"
import { useEffect } from "react"
import { useSocket } from "./context/SocketProvider"


function App() {
  const socket = useSocket();
  const { getGroupByUser } = useGroupApis();

  useEffect(() => {
    if (!socket) return;
    socket.on("group_created", (group) => {
      socket.emit("join_group", { groupId: group.id });
      getGroupByUser();
    });

    return () => {
      socket.off("group_created");
    };
  }, [socket]);


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

export default App
