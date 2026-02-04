import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaApple, FaGithub, FaGoogle } from "react-icons/fa6";
import { useAuthCall } from "../../customHooks/useAuthCall";
import { toast } from "react-toastify";

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
        <div className="min-h-screen bg-slate-50 text-slate-900 flex items-center justify-center px-4 py-10">
            <div className="w-full max-w-md">
                <div className="text-center mb-6">
                    <div className="text-sm uppercase tracking-[0.35em] text-slate-400">Relay</div>
                    <h1 className="text-2xl font-semibold mt-2">Create your account</h1>
                    <p className="text-sm text-slate-500 mt-1">Start chatting in minutes</p>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                    <form onSubmit={handleSignUp} className="flex flex-col gap-4">
                        <label className="text-sm">
                            <span className="text-slate-500">Full name</span>
                            <input
                                className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-slate-400"
                                type="text"
                                value={signUpData.username}
                                name="username"
                                onChange={HandleChange}
                                placeholder="Alex Morgan"
                            />
                        </label>
                        <label className="text-sm">
                            <span className="text-slate-500">Email</span>
                            <input
                                className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-slate-400"
                                type="text"
                                value={signUpData.email}
                                name="email"
                                onChange={HandleChange}
                                placeholder="you@email.com"
                            />
                        </label>
                        <label className="text-sm">
                            <span className="text-slate-500">Password</span>
                            <input
                                className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-slate-400"
                                type="password"
                                value={signUpData.password}
                                name="password"
                                onChange={HandleChange}
                                placeholder="Create a password"
                            />
                        </label>
                        <button type="submit" className="w-ful cursor-pointer bg-slate-900 text-white py-2.5 rounded-lg text-sm font-medium hover:bg-slate-800 transition">
                            {loading ? "..." : "Create account"}
                        </button>
                    </form>

                    <div className="flex items-center gap-3 my-5">
                        <div className="h-px bg-slate-200 flex-1" />
                        <span className="text-xs text-slate-400">or sign up with</span>
                        <div className="h-px bg-slate-200 flex-1" />
                    </div>

                    <div className="grid grid-cols-3 gap-2">
                        <button className="flex items-center cursor-pointer justify-center gap-2 rounded-lg border border-slate-200 py-2 text-sm text-slate-700 hover:bg-slate-50 transition">
                            <FaGoogle className="text-[16px]" />
                        </button>
                        <button className="flex items-center cursor-pointer justify-center gap-2 rounded-lg border border-slate-200 py-2 text-sm text-slate-700 hover:bg-slate-50 transition">
                            <FaApple className="text-[16px]" />
                        </button>
                        <button className="flex items-center cursor-pointer justify-center gap-2 rounded-lg border border-slate-200 py-2 text-sm text-slate-700 hover:bg-slate-50 transition">
                            <FaGithub className="text-[16px]" />
                        </button>
                    </div>
                </div>

                <div className="text-center text-sm text-slate-600 mt-4">
                    Already have an account?{" "}
                    <button className="text-slate-900 font-medium cursor-pointer" onClick={() => { navigate("/login") }}>
                        Log in
                    </button>
                </div>
            </div>
        </div>
    )

}

export default SignUp;
