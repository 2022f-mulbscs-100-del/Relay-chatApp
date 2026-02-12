import { createBrowserRouter, Outlet } from "react-router-dom";
import ErrorBoundary from "./ErrorHandler/ErrorHandler";
import Login from "./Pages/Auth/Login";
import Signup from "./Pages/Auth/SignUp";
import ForgotPassword from "./Pages/Auth/ForgotPassword";
import MfaCode from "./Pages/Auth/MfaCode";
import LayoutWrapper from "./LayoutWrapper";
import Contacts from "./Pages/Contacts/Contacts";
import Chats from "./Pages/Chats/Chat";
import Groups from "./Pages/Groups/Groups";
import Settings from "./Pages/Settings/Settings";
import SetupProfile from "./Pages/ProfileSetup/SetupProfile";
import ProfilePage from "./Pages/Profile/profile";
import ProtectedRoutes from "./ProtectedRoutes";
import NotFound from "./Pages/NotFound/NotFound";
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
                path: "/contacts",
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
                path: "/groups",
                element:
                    <ProtectedRoutes>
                        <LayoutWrapper>
                            <Groups />
                        </LayoutWrapper>
                    </ProtectedRoutes>
            },
            {
                path: "/settings",
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
            },
            {
                path: "*",
                element: <NotFound />
            }


        ]
    }

])


export default Router;
