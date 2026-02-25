import { useState } from "react";
import { AxiosClient } from "../api/AxiosClient";
import { useUser } from "../context/UserProvider";
import type { SignUpDataType, UserDataType } from "../types/auth.types";
import { isAxiosError } from "axios";
import { useAuth } from "../context/AuthProvider";

type PasskeyAssertionPayload = {
    id: string;
    rawId: string;
    type: PublicKeyCredentialType;
    response: {
        clientDataJSON: string;
        authenticatorData: string;
        signature: string;
        userHandle: string | null;
    };
};

export const useAuthCall = () => {
    const { setUser } = useUser();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const { stage, setStage } = useAuth();
    const [passKeyCredential, setPassKeyCredential] = useState<PublicKeyCredentialDescriptor[] | null>(null);
    const [passKeyChallenge, setPassKeyChallenge] = useState<string | null>(null);
    // LOGIN API CALL
    const login = async (loginData: UserDataType) => {
        setLoading(true);
        try {
            const res = await AxiosClient.post("/auth/login", loginData);
            if (res.data.twoFactorRequired === "passkeyTwoFactor") {
                setStage("passkeyTwoFactor");
                setPassKeyCredential(res.data.allowCredentials);
                setPassKeyChallenge(res.data.challenge);
                setLoading(false);
                return;
            }
            if (res.data.twoFactorRequired) {
                setStage(res.data.twoFactorRequired);
                setLoading(false);
                return;
            }
            setUser(res.data.user);
            sessionStorage.setItem("accessToken", res.data.accessToken);
            setStage(null);
            setPassKeyChallenge(null);
            setPassKeyCredential(null);
            setLoading(false);
        } catch (error) {
            setError(isAxiosError(error) ? error.response?.data.message || "Login failed" : "Login failed");
            setStage(null);
            setPassKeyChallenge(null);
            setPassKeyCredential(null);
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

    const verifyTwoFactor = async (email: string, token?: string | null, twoFaMethod?: string, assertionResponse?: PasskeyAssertionPayload) => {
        try {
            setLoading(true);
            const res = await AxiosClient.post("/auth/check-twoFactor", {
                email,
                twoFaMethod,
                token,
                assertionResponse
            })

            setUser(res.data.user);
            sessionStorage.setItem("accessToken", res.data.accessToken);
            setStage(null);
            setPassKeyChallenge(null);
            setPassKeyCredential(null);
            setLoading(false);
        } catch {
            setLoading(false);
            setStage(null);
            setPassKeyChallenge(null);
            setPassKeyCredential(null);
            throw new Error("Two-factor verification failed");
        }

    }


    return { login, signUp, logout, loading, error, stage, verifyTwoFactor,passKeyCredential,passKeyChallenge };
}