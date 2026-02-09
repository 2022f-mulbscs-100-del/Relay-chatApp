import { useState } from "react";
import { AxiosClient } from "../api/AxiosClient";
import { useUser } from "../context/UserProvider";
import type { SignUpDataType, UserDataType } from "../types/auth.types";
import { isAxiosError } from "axios";

export const useAuthCall = () => {
    const { setUser } = useUser();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // LOGIN API CALL
    const login = async (loginData: UserDataType) => {
        setLoading(true);
        try {
            const res = await AxiosClient.post("/auth/login", loginData);
            setUser(res.data.user);
            sessionStorage.setItem("accessToken", res.data.accessToken);
            setLoading(false);
        } catch (error) {
            setError(isAxiosError(error) ? error.response?.data.message || "Login failed" : "Login failed");
            setLoading(false);
            throw error;
        }
    }



    // SIGNUP API CALL
    const signUp = async (signUpData: SignUpDataType) => {
        setLoading(true);
        try {
            const res = await AxiosClient.post("/auth/signup", signUpData);
            setUser(res.data.user);
            sessionStorage.setItem("accessToken", res.data.accessToken);
            setLoading(false);
        } catch (error) {
            setError(isAxiosError(error) ? error.response?.data.message || "Signup failed" : "Signup failed");
            setLoading(false);
            throw error;
        }
    }


    // LOGOUT API CALL
    const logout = async () => {
        try {
            await AxiosClient.post("/auth/logout").catch(err => {
                console.error("Error during logout:", err);
            });
            sessionStorage.removeItem("accessToken");
            setUser(null);

        } catch {
            throw new Error("Logout failed");
        }
    }


    return { login, signUp, logout, loading, error };



}