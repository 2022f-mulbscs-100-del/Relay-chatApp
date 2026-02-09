import { RouterProvider } from "react-router-dom"
import Router from "./router"
import { ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import { UserProvider } from "./context/UserProvider"
import { SocketProvider } from "./context/SocketProvider"
import { AuthProvider } from "./context/AuthProvider"
import { MessageProvider } from "./context/MessageProvider"


function App() {



  return (
    <>

      <UserProvider>
        <SocketProvider>
          <MessageProvider>
          <AuthProvider>
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
          </AuthProvider>
          </MessageProvider>
        </SocketProvider>
      </UserProvider>
    </>
  )
}

export default App
