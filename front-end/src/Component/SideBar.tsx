import { FaGear } from "react-icons/fa6";
import { IoPersonSharp } from "react-icons/io5";
import { MdContacts } from "react-icons/md";
import { PiChatsCircleBold } from "react-icons/pi";
import { RiChatSmileAiFill } from "react-icons/ri";
import { useLocation, useNavigate } from "react-router-dom";
import { useMessage } from "../context/MessageProvider";
import ThemeToggle from "./ThemeToggle";


const SideBar = () => {

    const { pathname } = useLocation();
    const {setActiveUserId} = useMessage();

    const active =
        pathname === "/profile" ? 1 :
            pathname === "/chats" || pathname === "/" ? 2 :
                pathname === "/groups" ? 3 :
                    pathname === "/contacts" ? 4 :
                        pathname === "/settings" ? 5 : 0;

    const navigate = useNavigate();
    const SideBarArray = [
        {
            id: 1,
            name: "Profile",
            link: "/profile",
            icon: <IoPersonSharp />
        },
        {
            id: 2,
            name: "Chats",
            link: "/",
            icon: <RiChatSmileAiFill />

        },
        {
            id: 3,
            name: "Groups",
            link: "/groups",
            icon: <PiChatsCircleBold />
        },
        {
            id: 4,
            name: "Contacts",
            link: "/contacts",
            icon: <MdContacts />

        },
        {
            id: 5,
            name: "Settings",
            link: "/settings",
            icon: <FaGear />
        }
    ]

    return (
        <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur border-r border-slate-200 dark:border-slate-700 fixed h-screen w-[72px] px-3 py-4 flex flex-col items-center justify-between transition-colors duration-200">
            <div className="flex justify-center">
                <div
                onClick={()=>{navigate("/profile")}}
                className="w-10 h-10 rounded-xl cursor-pointer bg-slate-900 dark:bg-white text-white dark:text-slate-900 flex items-center justify-center text-sm font-semibold shadow-sm transition-colors duration-200">
                    R
                </div>
            </div>

            <div className="flex-1 flex flex-col items-center justify-start pt-50 gap-3">
                {SideBarArray.map((item) => (
                    <div key={item.id} className="relative">
                        <button
                            title={item.name}
                            className={`w-11 h-11 rounded-xl flex items-center justify-center text-xl transition relative cursor-pointer ${
                                active === item.id
                                    ? "bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-sm"
                                    : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800"
                            }`}
                            onClick={() => {
                                navigate(item.link);
                                if(item.id===2){
                                    setActiveUserId(null);
                                }
                            }}
                        >
                            {active === item.id && (
                                <span className="absolute -left-2 w-1.5 h-6 rounded-full bg-slate-900 dark:bg-white" />
                            )}
                            {item.icon}
                        </button>
                    </div>
                ))}
            </div>

            <div className="flex flex-col items-center gap-3">
                <ThemeToggle />
            </div>

        </div>
    );
};

export default SideBar;
