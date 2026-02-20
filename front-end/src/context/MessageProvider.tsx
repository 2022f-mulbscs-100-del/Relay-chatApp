import { createContext, useContext, useEffect, useState } from "react";
import type { AssociatedUser, chatUser, MessageProps } from "../types/message.types";


interface MessageContextType {
    message: MessageProps[] | null;
    setMessage: React.Dispatch<React.SetStateAction<MessageProps[] | null>>;
    listOfAllUsers: chatUser[];
    setListOfAllUsers: React.Dispatch<React.SetStateAction<chatUser[]>>;
    listOfChatUsers: chatUser[];
    setListOfChatUsers: React.Dispatch<React.SetStateAction<chatUser[]>>;
    ShowToastOfUnreadMessage: chatUser[];
    setShowToastOfUnreadMessage: React.Dispatch<React.SetStateAction<chatUser[]>>;
    activeUserId: string | null;
    setActiveUserId: React.Dispatch<React.SetStateAction<string | null>>;
    onlineUserIds: number[];
    setOnlineUserIds: React.Dispatch<React.SetStateAction<number[]>>;   
    associatedUser: AssociatedUser[];
    setAssociatedUser: React.Dispatch<React.SetStateAction<AssociatedUser[]>>;

}


const MessageContext = createContext<MessageContextType | null>(null);



export const MessageProvider = ({ children }: { children: React.ReactNode }) => {

    const [message, setMessage] = useState<MessageProps[] | null>([]);
    const [listOfAllUsers, setListOfAllUsers] = useState<chatUser[]>([]);
    const [listOfChatUsers, setListOfChatUsers] = useState<chatUser[]>([]);
    const [ShowToastOfUnreadMessage, setShowToastOfUnreadMessage] = useState<chatUser[]>([]);
    const [activeUserId, setActiveUserId] = useState<string | null>(null);
    const [onlineUserIds, setOnlineUserIds] = useState<number[]>([]);
    const [associatedUser, setAssociatedUser] = useState<AssociatedUser[]>([]);

useEffect(() => {


    
}, [setListOfAllUsers]);

    return (
        <MessageContext.Provider value={{ message, setMessage, listOfAllUsers, setListOfAllUsers, listOfChatUsers, setListOfChatUsers, ShowToastOfUnreadMessage, setShowToastOfUnreadMessage, activeUserId, setActiveUserId, onlineUserIds, setOnlineUserIds, associatedUser, setAssociatedUser }}>
            {children}
        </MessageContext.Provider>
    );
};



//eslint-disable-next-line 
export const useMessage = () => {
    const context = useContext(MessageContext);
    if (context === null) {
        throw new Error("useMessage must be used within a MessageProvider");
    }
    return context;
};
