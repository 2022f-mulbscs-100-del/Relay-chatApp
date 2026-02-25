import { useState } from "react";
import { AxiosClient } from "../api/AxiosClient";
import { useGroup } from "../context/GroupProvider";
import { useMessage } from "../context/MessageProvider";
import type { Group } from "../types/group.type";

const useGroupApis = () => {
const {setListOfgroups} = useGroup();
const {setMessage} = useMessage();

const [loading, setLoading] = useState(false);

//-------------get Group By User----------------
    const getGroupByUser = async () => {
        setLoading(true);
        try {
            const response = await AxiosClient.get('/groups/getUserGroups');
            setListOfgroups(response.data.groups);
        } catch (error) {
            console.error("Error fetching groups:", error);
            throw error;
        } finally {
            setLoading(false);
        }
    }

    //-------------get Group Messages----------------
    const getGroupMessages = async (groupId:string)=>{
        setLoading(true)
        try {
            const response = await AxiosClient.get(`/groups/getGroupMessages/${groupId}`);
            setMessage(response.data.groupMessage)
        } catch (error) {
            console.error("Error fetching group messages:", error);
            throw error;
        } finally {
            setLoading(false);
        }
    }

//-------------mark Group Message As Read----------------
    const MarkGroupMessageAsRead = async (groupId: string | null, userId: string | undefined) => {
        if (!groupId || !userId) return;
        
        try {
            await AxiosClient.post("/groups/markGroupMessageAsRead", { groupId });
          setListOfgroups((prevGroup:Group[])=>{
            return prevGroup.map((group)=>{
                if(group.id === groupId){
                    const updatedMessages = group.groupMessages.map((msg)=>{
                        return {...msg, isReadBy:[...(msg.isReadBy || []), userId]}
                    })
                    return {...group, groupMessages: updatedMessages};
                }
                return group;
            })
          })
        } catch (error) {
            console.error("Error marking group messages as read:", error);
            throw error;
        }
    }

//-------------mark Group Pinned----------------
    const MarkGroupPinned = async (groupId: string | null) => {
        if (!groupId) return;
        try {
            await AxiosClient.post("/groups/markGroupPinned", { groupId });
        } catch (error) {
            console.error("Error marking group as pinned:", error);
            throw error;
        }
    }


//-------------mark Group Category----------------
    const addGroupCategory = async (groupId: string | null, category: string) => {
        if (!groupId) return;
        try {
            await AxiosClient.post("/groups/addCategoryToGroup", { groupId, category });
        } catch (error) {
            console.error("Error adding category to group:", error);
            throw error;
        }
    }

//-------------mark Group Mute----------------
    const muteGroup = async (groupId: string | null) => {
        if (!groupId) return;
        try {
            await AxiosClient.post("/groups/muteGroup", { groupId });
        } catch (error) {
            console.error("Error muting group:", error);
            throw error;
        }
    }



//-------------delete group-----------------

const deleteGroup = async (groupId: string | null) => {
    if (!groupId) return;
    try {
        await AxiosClient.delete(`/groups/deleteGroup/${groupId}`);
        setListOfgroups((prev) => prev.filter(group => group.id !== groupId));
    } catch (error) {
        console.error("Error deleting group:", error);
        throw error;
    }
}
    
    return { getGroupByUser, getGroupMessages, MarkGroupMessageAsRead, MarkGroupPinned, addGroupCategory, muteGroup, deleteGroup, loading };
}

export default useGroupApis;