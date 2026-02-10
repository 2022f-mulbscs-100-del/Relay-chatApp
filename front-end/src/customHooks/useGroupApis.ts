import { useState } from "react";
import { AxiosClient } from "../api/AxiosClient";
import { useGroup } from "../context/GroupProvider";

const useGroupApis = () => {
const {setGroups} = useGroup();

const [loading, setLoading] = useState(false);
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


    return { getGroupByUser,loading };
}

export default useGroupApis;