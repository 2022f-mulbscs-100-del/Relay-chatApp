import { createContext, useContext, useEffect, useMemo } from "react";
import { io, Socket } from "socket.io-client";
import { useUser } from "./UserProvider";


const SocketContext = createContext<Socket | null>(null);

const SocketProvider = ({ children }: { children: React.ReactNode }) => {
    
    const {user} = useUser();

    const socket = useMemo(() => {
        if (!user?.id) {
            return null;
        }
        return io("http://localhost:2404", {
            withCredentials: true,
        });
    }, [user?.id]);

    useEffect(() => {
        if (!socket || !user?.id) {
            return;
        }

      
        const handleConnect = () => {
            socket.emit("register", user.id);
        };

        if (socket.connected) {
           
            handleConnect();
        } else {
            
            socket.on("connect", handleConnect);
        }

        return () => {
            socket.off("connect", handleConnect);
            if (socket) socket.disconnect();
        };
    }, [socket, user?.id]);

    return (
        <SocketContext.Provider value={socket}>
            {children}
        </SocketContext.Provider>
    );
};

//eslint-disable-next-line react-refresh/only-export-components
export const useSocket = () => {
    const context = useContext(SocketContext);
    if (context === undefined) {
        throw new Error("useSocket must be used within a SocketProvider");
    }
    return context;
}

export { SocketContext, SocketProvider };