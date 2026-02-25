import { useState } from "react";
import { AxiosClient } from "../api/AxiosClient"
import { useUser } from "../context/UserProvider";
import { isAxiosError } from "axios";
import { useMessage } from "../context/MessageProvider";

export const useUserApis = () => {
    const { setUser } = useUser();
    const [loading, setLoading] = useState(false);
    const { setActiveUserId } = useMessage();


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
    const setupProfile = async (phone: string, title: string, about: string, imageUrl?: string) => {
        setLoading(true);
        try {
            await AxiosClient.post("/users/UserProfileSetup", {
                phone,
                title,
                about,
                imageUrl,
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

    // UPDATE USER AUTH SETTINGS API CALL
    const UpdateAuthSettings = async ({ emailtwoFactor, totpEnabled, passKeyEnabled }: { emailtwoFactor?: boolean, totpEnabled?: boolean, passKeyEnabled?: boolean }) => {
        setLoading(true);
        try {
            await AxiosClient.post("/users/updateUserProfile", {
                emailtwoFactor,
                totpEnabled,
                passKeyEnabled
            });
            setLoading(false);
        } catch (error) {
            setLoading(false);
            throw new Error(isAxiosError(error) ? error.response?.data.message : "Failed to update authentication settings");
        }
    }

    const GnerateTOTP = async () => {
        setLoading(true);
        try {
            const res = await AxiosClient.get("/users/generateTOTP");
            setLoading(false);
            return res.data;
        } catch (error) {
            setLoading(false);
            throw new Error(isAxiosError(error) ? error.response?.data.message : "Failed to generate TOTP");
        }
    }

    const VerifyTOTP = async (code: string) => {
        setLoading(true);
        try {
            const res = await AxiosClient.post("/users/verifyTOTP", {
                token: code
            });
            setLoading(false);
            return res.data;
        } catch (error) {
            setLoading(false);
            throw new Error(isAxiosError(error) ? error.response?.data.message : "Failed to verify TOTP");
        }
    }

    const messageAlertToggle = async () => {
        setLoading(true);
        try {
            const res = await AxiosClient.get("/users/updateUserMessageAlert");
            setUser(res.data.user);
            setLoading(false);
        } catch (error) {
            setLoading(false);
            throw new Error(isAxiosError(error) ? error.response?.data.message : "Failed to toggle message alerts");
        }
    }

    const categorizeChat = async (associateUserId: number, category: string) => {
        setLoading(true);
        try {
            await AxiosClient.post(`/users/categorizeChat`, {
                associateUserId,
                category
            });
            setLoading(false);
        } catch (error) {
            setLoading(false);
            throw new Error(isAxiosError(error) ? error.response?.data.message : "Failed to categorize chat");
        }
    }

    const deletePrivateChat = async (associateUserId: string) => {
        setLoading(true);
        try {
            await AxiosClient.get(`/users/deleteChat/${associateUserId}`);
            setActiveUserId(null);

            setLoading(false);
        } catch (error) {
            setLoading(false);
            throw new Error(isAxiosError(error) ? error.response?.data.message : "Failed to delete chat");
        }
    }

    // get shared media
    const getSharedMedia = async () => {
        setLoading(true);
        try {
            const response = await AxiosClient.get("/users/getSharedMedia?limit=20");
            console.log(response.data.sharedMedia);
            return response.data.sharedMedia;
        } catch (error) {
            throw new Error(isAxiosError(error) ? error.response?.data.message : "Failed to fetch shared media");
        } finally {
            setLoading(false);
        }
    }

    return { getProfile, loading, setupProfile, UpdateProfile, ChangePassword, UpdateAuthSettings, GnerateTOTP, VerifyTOTP, messageAlertToggle, categorizeChat, deletePrivateChat, getSharedMedia };

}

