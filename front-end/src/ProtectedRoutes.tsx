import { Navigate } from "react-router-dom";
import { useUser } from "./context/UserProvider";
import { useAuth } from "./context/AuthProvider";


const ProtectedRoutes = ({ children }: { children: React.ReactNode }) => {
   const { user } = useUser();
   const { isloading } = useAuth();

   if (isloading) {
      return null;
   }

   const hasEmail = !!user?.email;
   return hasEmail ? children : <Navigate to="/login" />;
}

export default ProtectedRoutes;