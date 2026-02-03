import { createBrowserRouter, Outlet } from "react-router-dom";
import ErrorBoundary from "./ErrorHandler/ErrorHandler";
import Login from "./Pages/Auth/Login";
import Signup from "./Pages/Auth/SignUp";
import ForgotPassword from "./Pages/Auth/ForgotPassword";
import MfaCode from "./Pages/Auth/MfaCode";
import LayoutWrapper from "./LayoutWrapper";
import Contacts from "./Pages/Contacts";
import Chats from "./Pages/Chats/Chat";
import Groups from "./Pages/Groups";
import Settings from "./Pages/Settings";
import SetupProfile from "./Pages/SetupProfile";
import ProfilePage from "./Pages/profile";
import ProtectedRoutes from "./ProtectedRoutes";
interface ProviderWrapperProps {
    children?: React.ReactNode;
}
const ProviderWrapper: React.FC<ProviderWrapperProps> = () => {
    return (
        <ErrorBoundary>
            <Outlet />
        </ErrorBoundary>
    );
}


const Router = createBrowserRouter([
    {
        path: "/",
        element: (
            <ProviderWrapper >
                <div />
            </ProviderWrapper >
        )
        , children: [
            {
                path: "/login",
                element: <Login />
            },
            {
                path: "/signup",
                element: <Signup />
            },
            {
                path: "/forgot-password",
                element: <ForgotPassword />
            },
            {
                path: "/mfa-code",
                element: <MfaCode />
            },
            {
                path: "/Contacts",
                element: (
                    <ProtectedRoutes>
                        <LayoutWrapper>
                            <Contacts />
                        </LayoutWrapper>
                    </ProtectedRoutes >)
            },

            {
                path: "/setup-profile",
                element:
                    <ProtectedRoutes>
                        <SetupProfile />
                    </ProtectedRoutes>
            },
            {
                path: "/",
                element:
                    <ProtectedRoutes>
                        <LayoutWrapper>
                            <Chats />
                        </LayoutWrapper>
                    </ProtectedRoutes>
            },
            {
                path: "/Groups",
                element:
                    <ProtectedRoutes>
                        <LayoutWrapper>
                            <Groups />
                        </LayoutWrapper>
                    </ProtectedRoutes>
            },
            {
                path: "/Settings",
                element:
                    <ProtectedRoutes>
                        <LayoutWrapper>
                            <Settings />
                        </LayoutWrapper>
                    </ProtectedRoutes>
            },
            {
                path: "/profile",
                element:
                    <ProtectedRoutes>
                        <LayoutWrapper>
                            <ProfilePage />
                        </LayoutWrapper>
                    </ProtectedRoutes>
            }


        ]
    }

])


export default Router;
