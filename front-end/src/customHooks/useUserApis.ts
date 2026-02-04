import { useState } from "react";
import { AxiosClient } from "../api/AxiosClient"
import { useUser } from "../context/UserProvider";

export const useUserApis = () => {
    const { setUser } = useUser();
    const [loading, setLoading] = useState(false);


    const getProfile = async () => {
        setLoading(true);
        AxiosClient.get("/users/getUser").then(res => {
            setUser({
                id: res.data.user.id,
                username: res.data.user.username,
                email: res.data.user.email,
                createdAt: res.data.user.createdAt,
                hasMessaged: res.data.user.hasMessaged
            });
            setLoading(false);
        }).catch(err => {
            console.error("Error fetching users:", err);
            setLoading(false);
        });

    }


    return { getProfile, loading };

}


