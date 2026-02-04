import { createContext, useContext, useState } from "react";
import type { User } from "../types/user.type";




type UserContextProps = {
    user: User | null;
    setUser: React.Dispatch<React.SetStateAction<User | null>>;
};
const UserContext = createContext<UserContextProps | null>(null);


const UserProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User | null>({
        id: "",
        username: "",
        email: "",
        createdAt: "",
        hasMessaged: false
    });

    return (
        <UserContext.Provider value={{ user, setUser }}>
            {children}
        </UserContext.Provider>
    );
};


//eslint-disable-next-line react-refresh/only-export-components
export const useUser = () => {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error("useUser must be used within a UserProvider");
    }
    return context;
}
export { UserContext, UserProvider };