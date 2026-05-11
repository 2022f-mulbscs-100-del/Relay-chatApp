import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {  FaGoogle } from "react-icons/fa6";
import { useAuthCall } from "../../customHooks/useAuthCall";
import { toast } from "react-toastify";
import SocialLoginButton from "../../Component/SocialLoginButton";

const SignUp = () => {
    const [signUpData, setSignUpData] = useState({
        username: "",
        email: "",
        password: ""
    });
    const { signUp, loading } = useAuthCall();
    const navigate = useNavigate();
    const handleSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (signUpData.username === "" || signUpData.email === "" || signUpData.password === "") {
            toast.error("Please fill all the fields");
            return;
        }
        try {

            await signUp(signUpData);
            navigate("/setup-profile");
            //eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
            toast.error((error?.response?.data?.message) || "Signup failed");
        }

    }

    const HandleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { value, name } = e.target;
        setSignUpData(prevData => ({
            ...prevData,
            [name]: value
        }));
    }
    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 flex items-center justify-center px-4 py-10 transition-colors duration-200">
            <div className="w-full max-w-md">
                <div className="text-center mb-6">
                    <div className="text-sm uppercase tracking-[0.35em] text-slate-400 dark:text-slate-500">Relay</div>
                    <h1 className="text-2xl font-semibold mt-2">Create your account</h1>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Start chatting in minutes</p>
                </div>

                <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-6 shadow-sm transition-colors duration-200">
                    <form onSubmit={handleSignUp} className="flex flex-col gap-4">
                        <label className="text-sm">
                            <span className="text-slate-500 dark:text-slate-400">Full name</span>
                            <input
                                className="mt-1 w-full rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 px-3 py-2 text-sm outline-none focus:border-slate-400 dark:focus:border-slate-500 text-slate-900 dark:text-slate-100 transition-colors duration-200"
                                type="text"
                                value={signUpData.username}
                                name="username"
                                onChange={HandleChange}
                                placeholder="Alex Morgan"
                            />
                        </label>
                        <label className="text-sm">
                            <span className="text-slate-500 dark:text-slate-400">Email</span>
                            <input
                                className="mt-1 w-full rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 px-3 py-2 text-sm outline-none focus:border-slate-400 dark:focus:border-slate-500 text-slate-900 dark:text-slate-100 transition-colors duration-200"
                                type="text"
                                value={signUpData.email}
                                name="email"
                                onChange={HandleChange}
                                placeholder="you@email.com"
                            />
                        </label>
                        <label className="text-sm">
                            <span className="text-slate-500 dark:text-slate-400">Password</span>
                            <input
                                className="mt-1 w-full rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 px-3 py-2 text-sm outline-none focus:border-slate-400 dark:focus:border-slate-500 text-slate-900 dark:text-slate-100 transition-colors duration-200"
                                type="password"
                                value={signUpData.password}
                                name="password"
                                onChange={HandleChange}
                                placeholder="Create a password"
                            />
                        </label>
                        <button type="submit" className="w-full cursor-pointer bg-slate-900 dark:bg-white text-white dark:text-slate-900 py-2.5 rounded-lg text-sm font-medium hover:bg-slate-800 dark:hover:bg-slate-100 transition">
                            {loading ? "..." : "Create account"}
                        </button>
                    </form>

                    <div className="flex items-center gap-3 my-5">
                        <div className="h-px bg-slate-200 dark:bg-slate-700 flex-1" />
                        <span className="text-xs text-slate-400 dark:text-slate-500">or sign up with</span>
                        <div className="h-px bg-slate-200 dark:bg-slate-700 flex-1" />
                    </div>

                    <div className="flex">
                        <SocialLoginButton
                            icon={<FaGoogle className="text-[16px]" />}
                            title="Google"
                                    url="/api/auth/social-login/google"
                        />
                                    </div>
                                     </div>

            <div className="text-center text-sm text-slate-600 dark:text-slate-400 mt-4">
                Already have an account?{" "}
                <button className="text-slate-900 dark:text-slate-100 font-medium cursor-pointer" onClick={() => { navigate("/login") }}>
                    Log in
                </button>
            </div>
        </div>
        </div >
    )

}

export default SignUp;
