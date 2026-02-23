import { useState } from "react";
import { IoSearchOutline } from "react-icons/io5";
import type { AssociatedUser, chatUser } from "../../types/message.types";
import { useMessage } from "../../context/MessageProvider";

interface LiveSearchProps {
    listOfAllUsers: chatUser[];
    setActiveUserId: React.Dispatch<React.SetStateAction<string | null>>;
    associatedUser: AssociatedUser[];
}
const LiveSearch = ({ listOfAllUsers, setActiveUserId, associatedUser }: LiveSearchProps) => {

    const [userListSearch, setUserListSearch] = useState("");
    const {setAssociatedUser} = useMessage();
    const filterUser = listOfAllUsers.filter((user) => {
        
        return user.username.toLowerCase().includes(userListSearch.toLowerCase()) || user.email?.toLowerCase().includes(userListSearch.toLowerCase());
    })

    return (
        <div className="mt-3 relative">
            <div className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 flex items-center gap-2 text-slate-500">
                <IoSearchOutline className="text-slate-400" />
                <input
                    className="outline-none bg-transparent w-full text-sm"
                    type="text"
                    placeholder="Search users"
                    value={userListSearch}
                    onChange={(e) => setUserListSearch(e.target.value)}
                />
                {filterUser.length !== 0 && userListSearch.length > 1 &&
                    <div>
                        <div className="absolute left-0 right-0 top-10 bg-white/95 border border-slate-200 rounded-xl mt-2 w-full shadow-lg z-10 overflow-hidden">
                            {filterUser.map((user: chatUser) => (
                                <div
                                    key={user.id}
                                    className="px-3 py-2.5 cursor-pointer hover:bg-slate-50 transition"
                                    onClick={() => {
                                        if (associatedUser.find((chatUser) => chatUser.associateUserId === user.id)) {
                                            setActiveUserId(String(user.id));
                                            setUserListSearch("");
                                            return;
                                        }
                                        setAssociatedUser((prev) => [...prev, { 
                                            id: Date.now(), 
                                            userId: user.id, 
                                            associateUserId: user.id, 
                                            associatedUser: user, 
                                            isMuted: false,
                                            category: "",
                                            isPinned: false
                                        }]);
                                        setActiveUserId(String(user.id));
                                        setUserListSearch("");
                                    }}
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-9 h-9 rounded-full bg-slate-200 flex items-center justify-center text-xs font-semibold text-slate-700">
                                            {user.username.slice(0, 2).toUpperCase()}
                                        </div>
                                        <div className="min-w-0">
                                            <h1 className="text-slate-900 font-semibold truncate">@{user.username}</h1>
                                            <p className="text-slate-500 text-xs truncate">{user?.email}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                }
                {filterUser.length === 0 && userListSearch.length > 1 &&
                    <div>
                        <div className="absolute left-0 right-0 bg-white border border-slate-200 rounded-md mt-1 w-full shadow-sm z-10">
                            <div className="px-3 py-2 text-slate-500">
                                No users found
                            </div>
                        </div>
                    </div>
                }
            </div>
        </div>
    )
}

export default LiveSearch;
