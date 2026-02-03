import { useState } from "react";
import { FaGear } from "react-icons/fa6";
import { IoPersonSharp } from "react-icons/io5";
import { MdContacts } from "react-icons/md";
import { PiChatsCircleBold } from "react-icons/pi";
import { RiChatSmileAiFill } from "react-icons/ri";
import { useLocation, useNavigate } from "react-router-dom";


const SideBar = () => {

    const { pathname } = useLocation();

    const [active, setActive] = useState(
        pathname === "/profile" ? 1 :
            pathname === "/chats" ? 2 :
                pathname === "/groups" ? 3 :
                    pathname === "/contacts" ? 4 :
                        pathname === "/settings" ? 5 : 0
    );

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
        <div className="bg-white shadow-2xl fixed h-screen w-[80px] p-5">
            <div className="flex  justify-center">
                <h2 className="text-lg font-bold mb-4">CA</h2>
            </div>
            <div className="flex flex-col justify-center items-center">
                {SideBarArray.map((item) => (
                    <div key={item.id} className="  mb-6 cursor-pointer ">
                        <div className={`text-2xl mb-1 ${active === item.id ? "opacity-100" : "opacity-50"} hover:opacity-100`}
                            onClick={() => {
                                setActive(item.id);
                                navigate(item.link);
                            }}
                        >
                            {item.icon}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default SideBar;
