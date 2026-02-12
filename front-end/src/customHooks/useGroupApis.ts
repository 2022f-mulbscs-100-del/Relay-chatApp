import { useState } from "react";
import { AxiosClient } from "../api/AxiosClient";
import { useGroup } from "../context/GroupProvider";
import { useMessage } from "../context/MessageProvider";
import type { Group } from "../types/group.type";

const useGroupApis = () => {
const {setListOfgroups} = useGroup();
const {setMessage} = useMessage();

const [loading, setLoading] = useState(false);
    const getGroupByUser = () => {
        setLoading(true);
        AxiosClient.get('/groups/getUserGroups').then((response) => {
            setListOfgroups(response.data.groups);
            setLoading(false);
        }).catch((error) => {
            console.error("Error fetching groups:", error);
            setLoading(false);
            throw error;
        });
    }

    const getGroupMessages = async (groupId:string)=>{
        setLoading(true)
        AxiosClient.get(`/groups/getGroupMessages/${groupId}`).then((response) => {
            setMessage(response.data.groupMessage)
            setLoading(false);
        }).catch((error) => {
            console.error("Error fetching group messages:", error);
            setLoading(false);
            throw error;
        });
    }


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

    return { getGroupByUser, getGroupMessages, MarkGroupMessageAsRead, loading };
}

export default useGroupApis;