import { createContext, useContext, useEffect, useState } from "react";
import type { Group } from "../types/group.type";
import { useUser } from "./UserProvider";
import { AxiosClient } from "../api/AxiosClient";

type GroupContextType = {
    groups: Group[];
    setGroups: React.Dispatch<React.SetStateAction<Group[]>>;
    loading: boolean;
};

const GroupContext = createContext<GroupContextType | undefined>(undefined);

const GroupProvider = ({ children }: { children: React.ReactNode }) => {
    const [groups, setGroups] = useState<Group[]>([]);
    const { user } = useUser();
    const [loading, setLoading] = useState(false);

    useEffect(() => {

        if (!user) return;
        const getGroupByUser = () => {
            setLoading(true);
            AxiosClient.get('/groups/getUserGroups').then((response) => {
                setGroups(response.data.groups);
                setLoading(false);
            }).catch((error) => {
                console.error("Error fetching groups:", error);
                setLoading(false);
                throw error;
            });
        }
        getGroupByUser()

    }, [user]);
    return (
        <GroupContext.Provider value={{ groups, setGroups, loading }}>
            {children}
        </GroupContext.Provider>
    );
};

//eslint-disable-next-line react-refresh/only-export-components
export const useGroup = () => {
    const context = useContext(GroupContext);
    if (context === undefined) {
        throw new Error("useGroup must be used within a GroupProvider");
    }
    return context;
}
export { GroupContext, GroupProvider };