import { Navigate } from "react-router-dom";
import { useUser } from "./context/UserProvider";
import { useAuthCall } from "./customHooks/useAuthCall";


const ProtectedRoutes = ({children}: {children: React.ReactNode}) => {
   const {user} = useUser();
   const {loading } = useAuthCall();
    return (
        <>
        {loading ? "Loading..." : user === null ?  <Navigate to="/login" />: children }
        
    
        </>
   )
}

export default ProtectedRoutes;