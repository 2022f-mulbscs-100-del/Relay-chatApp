import { useState } from "react";
import { AxiosClient } from "../api/AxiosClient";
import { useUser } from "../context/UserProvider";
import type { SignUpDataType, UserDataType } from "../types/auth.types";
import { isAxiosError } from "axios";

export const useAuthCall = () => {
    const { setUser } = useUser();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const login = async (loginData:UserDataType) => {
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

    const signUp = async (signUpData:SignUpDataType) => {
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

    const logout = () => {
        setUser(null);
        sessionStorage.removeItem("accessToken");
    }

    return { login, signUp, logout, loading, error };



}