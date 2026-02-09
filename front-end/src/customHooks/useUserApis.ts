import { useState } from "react";
import { AxiosClient } from "../api/AxiosClient"
import { useUser } from "../context/UserProvider";
import { isAxiosError } from "axios";

export const useUserApis = () => {
    const { setUser } = useUser();
    const [loading, setLoading] = useState(false);


    // GET USER PROFILE API CALL
    const getProfile = async () => {
        setLoading(true);
        AxiosClient.get("/users/getUserProfile").then(res => {
            setUser(res.data.user);
            setLoading(false);
        }).catch(err => {
            console.error("Error fetching users:", err);
            setLoading(false);
        });

    }

    // UPDATE USER PROFILE API CALL
    const UpdateProfile = async (username: string, phone: string, location?: string) => {
        setLoading(true);
        try {
            await AxiosClient.post("/users/UpdateUserProfileSetup", {
                username,
                phone,
                location
            });
            setLoading(false);
        } catch (error) {
            setLoading(false);
            throw new Error(isAxiosError(error) ? error.response?.data.message : "Failed to update profile");
        }
    }



    // SETUP USER PROFILE API CALL
    const setupProfile = async (phone: string, title: string, about: string, tags: string[]) => {
        setLoading(true);
        try {
            await AxiosClient.post("/users/UserProfileSetup", {
                phone,
                title,
                about,
                tags
            });
            setLoading(false);
        } catch (error) {
            setLoading(false);
            throw new Error(isAxiosError(error) ? error.response?.data.message : "Failed to setup profile");
        }
    }


    // CHANGE PASSWORD API CALL
    const ChangePassword = async (currentPassword: string, newPassword: string) => {
        setLoading(true);
        try {
            await AxiosClient.post("/users/updateUserPassword", {
                currentPassword,
                newPassword
            });
            setLoading(false);
        } catch (error) {
            setLoading(false);
            throw new Error(isAxiosError(error) ? error.response?.data.message : "Failed to change password");
        }
    }


    return { getProfile, loading, setupProfile ,UpdateProfile,ChangePassword};

}

