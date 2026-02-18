import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaApple, FaGithub, FaGoogle } from "react-icons/fa6";
import { toast } from "react-toastify";
import { useAuthCall } from "../../customHooks/useAuthCall";
import LoadingSpinner from "../../Component/LoadingSpinner";
import MfaCode from "./MfaCode";
import { useUser } from "../../context/UserProvider";
import base64ToArrayBuffer from "../../utlis/Base64ToArrayBuffer";

const Login = () => {

    const [loginData, setLoginData] = useState({
        email: "",
        password: ""
    });
    const navigate = useNavigate();
    const { login, stage, passKeyCredential, passKeyChallenge, verifyTwoFactor } = useAuthCall();
    const [loading, setLoading] = useState(false);
    const { user } = useUser();
    const passkeyInProgressRef = useRef(false);


    const HandleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { value, name } = e.target;
        setLoginData({
            ...loginData,
            [name]: value
        });
    }
    const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (loginData.email === "" || loginData.password === "") {
            toast.error("Please fill all the fields");
            return;
        }
        setLoading(true);
        try {
            await login(loginData);
            setLoading(false);
        } catch (error) {
            toast.error(String(error));
            setLoading(false);
        }
    }

    useEffect(() => {
        if (user?.email) {
            navigate("/");
        }
    }, [user]);

    useEffect(() => {
        if (stage === "passkeyTwoFactor") {
            if (!passKeyChallenge || !passKeyCredential?.length) {
                return;
            }

            if (passkeyInProgressRef.current) {
                return;
            }
            passkeyInProgressRef.current = true;

            const publicKey: PublicKeyCredentialRequestOptions = {
                challenge: base64ToArrayBuffer(passKeyChallenge),
                allowCredentials: passKeyCredential.map((credential) => ({
                    ...credential,
                    id: base64ToArrayBuffer(String(credential.id)),
                })),
                userVerification: "preferred",
            };

            const arrayBufferToBase64Url = (buffer: ArrayBuffer) => {
                const bytes = new Uint8Array(buffer);
                let binary = "";
                bytes.forEach((byte) => {
                    binary += String.fromCharCode(byte);
                });
                return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
            };
            const passKeyLogin = async () => {
                try {
                    const assertionResponse = await navigator.credentials.get({ publicKey });
                    if (!assertionResponse || !(assertionResponse instanceof PublicKeyCredential)) {
                        throw new Error("Passkey authentication cancelled or failed.");
                    }
                    const assertion = assertionResponse as PublicKeyCredential;
                    const response = assertion.response as AuthenticatorAssertionResponse;
                    await verifyTwoFactor(
                        loginData.email,
                        null,
                        "passkeyTwoFactor",
                        {
                            id: assertion.id,
                            rawId: arrayBufferToBase64Url(assertion.rawId),
                            type: assertion.type,
                            response: {
                                clientDataJSON: arrayBufferToBase64Url(response.clientDataJSON),
                                authenticatorData: arrayBufferToBase64Url(response.authenticatorData),
                                signature: arrayBufferToBase64Url(response.signature),
                                userHandle: response.userHandle ? arrayBufferToBase64Url(response.userHandle) : null,
                            },
                        }
                    )

                } catch (error) {
                    toast.error(error as string);
                } finally {
                    passkeyInProgressRef.current = false;
                }
            }
            passKeyLogin();
        }
    }, [stage, passKeyChallenge, passKeyCredential, loginData.email, verifyTwoFactor]);
    return (
        <>
            {stage === null &&
                <div className="min-h-screen bg-slate-50 text-slate-900 flex items-center justify-center px-4 py-10">
                    <div className="w-full max-w-md">
                        <div className="text-center mb-6">
                            <div className="text-sm uppercase tracking-[0.35em] text-slate-400">Relay</div>
                            <h1 className="text-2xl font-semibold mt-2">Welcome back</h1>
                            <p className="text-sm text-slate-500 mt-1">Sign in to continue</p>
                        </div>

                        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                            <form onSubmit={handleLogin} className="flex flex-col gap-4">
                                <label className="text-sm">
                                    <span className="text-slate-500">Email</span>
                                    <input
                                        className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-slate-400"
                                        type="text"
                                        name="email"
                                        value={loginData.email}
                                        onChange={HandleChange}
                                        placeholder="you@email.com"
                                    />
                                </label>
                                <label className="text-sm">
                                    <span className="text-slate-500">Password</span>
                                    <input
                                        className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-slate-400"
                                        type="password"
                                        name="password"
                                        value={loginData.password}
                                        onChange={HandleChange}
                                        placeholder="••••••••"
                                    />
                                </label>
                                <div className="flex items-center justify-between text-xs text-slate-500">
                                    <label className="flex items-center gap-2">
                                        <input type="checkbox" className="rounded border-slate-300" />
                                        Remember me
                                    </label>
                                    <button
                                        type="button"
                                        className="text-slate-600 hover:text-slate-900"
                                        onClick={() => navigate("/forgot-password")}
                                    >
                                        Forgot password?
                                    </button>
                                </div>

                                <button type="submit" className="w-full cursor-pointer bg-slate-900 text-white py-2.5 rounded-lg text-sm font-medium hover:bg-slate-800 transition">
                                    {loading ? <LoadingSpinner size={16} thickness={2} color="#fff" /> : "Login"}
                                </button>
                            </form>

                            <div className="flex items-center gap-3 my-5">
                                <div className="h-px bg-slate-200 flex-1" />
                                <span className="text-xs text-slate-400">or continue with</span>
                                <div className="h-px bg-slate-200 flex-1" />
                            </div>

                            <div className="grid grid-cols-3 gap-2">
                                <button className="flex items-center justify-center gap-2 rounded-lg border border-slate-200 py-2 text-sm text-slate-700 hover:bg-slate-50 transition">
                                    <FaGoogle className="text-[16px]" />
                                </button>
                                <button className="flex items-center justify-center gap-2 rounded-lg border border-slate-200 py-2 text-sm text-slate-700 hover:bg-slate-50 transition">
                                    <FaApple className="text-[16px]" />
                                </button>
                                <button className="flex items-center justify-center gap-2 rounded-lg border border-slate-200 py-2 text-sm text-slate-700 hover:bg-slate-50 transition">
                                    <FaGithub className="text-[16px]" />
                                </button>
                            </div>
                        </div>

                        <div className="text-center text-sm text-slate-600 mt-4">
                            Don&apos;t have an account?{" "}
                            <button className="text-slate-900 font-medium cursor-pointer" onClick={() => navigate("/signup")}>
                                Sign up
                            </button>
                        </div>
                    </div>
                </div>
            }
            {stage==="emailTwoFactor"|| stage==="totpTwoFactor" && <MfaCode email={loginData.email} stage={stage} />}
        </>
    )

}

export default Login;
