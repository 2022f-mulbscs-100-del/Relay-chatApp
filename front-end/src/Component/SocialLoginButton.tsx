import { useUser } from "../context/UserProvider";
interface SocialLoginButtonProps {
    icon: React.ReactNode;
    title: string;
    url?: string;
    provider?: string;
}
const SocialLoginButton = ({ icon, title, url, provider }: SocialLoginButtonProps) => {
    const { setUser } = useUser();

    const openPopup = () => {
        const width = 500;
        const height = 600;
        const left = window.screen.width / 2 - width / 2;
        const top = window.screen.height / 2 - height / 2;


        const popUp = window.open(url, provider, `width=${width},height=${height},left=${left},top=${top}`);



        const handleMessage = (event: MessageEvent) => {
            // Allow messages from current origin
            if (event.origin !== window.location.origin) {
                return;
            }
            const { token, user } = event.data;
         
            if (!token || !user) {
                console.error("Invalid token or user data");
                popUp?.close();
                return;
            }
            sessionStorage.setItem("accessToken", token);
            setUser(user);
            window.removeEventListener("message", handleMessage);
            popUp?.close();
            window.location.href = "/";
        };

        window.addEventListener("message", handleMessage);

    }

    return (
        <button
            type="button"
            className="w-full hover:bg-secondary dark:hover:bg-slate-700 cursor-pointer flex justify-center items-center gap-4 p-2 border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 rounded-lg disabled:cursor-not-allowed disabled:opacity-60 transition-colors duration-200"
            onClick={openPopup}
        >
            {icon}

            {title}
        </button>
    )
}

export default SocialLoginButton;