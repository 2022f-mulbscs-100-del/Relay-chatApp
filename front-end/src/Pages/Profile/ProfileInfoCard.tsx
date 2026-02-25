import { useUser } from "../../context/UserProvider";

const ProfileInfoCard = () => {

    const { user } = useUser();
    return (
        <div className="w-full   md:px-3 py-6">
            <div className="rounded-2xl border border-slate-200 bg-white shadow-sm px-4 pb-5">
                <div className="flex flex-col md:flex-row md:items-end gap-5 pt-5">
                    <div className="flex gap-3">
                        <img
                            src={user?.ImageUrl || "https://images.unsplash.com/photo-1502685104226-ee32379fefbe?w=300&h=300&fit=crop"}
                            alt={user?.username}
                            className="w-28 h-28 rounded-2xl object-cover border-4 border-white shadow-sm"
                        />
                        <div className="flex-1 self-end">
                            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                                <div>
                                    <h1 className="text-2xl font-semibold">@{user?.username}</h1>
                                </div>

                            </div>
                            <p className="mt-3 text-slate-600">{user?.title}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    )
}

export default ProfileInfoCard;