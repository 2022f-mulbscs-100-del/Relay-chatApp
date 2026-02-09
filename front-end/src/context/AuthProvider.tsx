import { createContext, useContext, useEffect, useState } from "react";
import { useUser } from "./UserProvider";
import axios from "axios";


type AuthContextType = {
    isAuthenticated: boolean;
    setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>;
};
const AuthContext = createContext<AuthContextType | null>(null);

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const { setUser } = useUser();


    useEffect(() => {
        axios.get("http://localhost:2404/api/refresh", {
            withCredentials: true,
        }).then((response) => {
            setUser(response.data.user);
            sessionStorage.setItem("accessToken", response.data.accessToken);
        }).catch(() => {
            setUser(null);
        });
    }, [setUser]);


    return (
        <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated }}>
            {children}
        </AuthContext.Provider>
    );
};


//eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}
export { AuthContext, AuthProvider };