import { FiKey, FiLock, FiShield, FiSmartphone } from "react-icons/fi";
import { useUserApis } from "../../customHooks/useUserApis";
import { toast } from "react-toastify";
import { useState } from "react";
import LoadingSpinner from "../../Component/LoadingSpinner";
import { useUser } from "../../context/UserProvider";
import TotpModal from "./TotpModal";
import { AxiosClient } from "../../api/AxiosClient";
import base64ToArrayBuffer from "../../utlis/Base64ToArrayBuffer";

const arrayBufferToBase64Url = (buffer: ArrayBuffer) => {
    const bytes = new Uint8Array(buffer);
    let binary = "";
    bytes.forEach((byte) => {
        binary += String.fromCharCode(byte);
    });
    return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
};


interface SecuritySettingProps {
    setIsChangePasswordOpen: React.Dispatch<React.SetStateAction<boolean>>;
}
const SecuritySetting = ({ setIsChangePasswordOpen }: SecuritySettingProps) => {

    const { user } = useUser();
    const { UpdateAuthSettings, GnerateTOTP, loading } = useUserApis();

    const [openTOTPSetupModal, setOpenTOTPSetupModal] = useState(false);
    const [authenticatorApp, setAuthenticatorApp] = useState(user?.totpEnabled ?? false);
    const [authenticatorQR, setAuthenticatorQR] = useState("");
    const [emailTwoFactor, setEmailTwoFactor] = useState(() => user?.emailtwoFactor ?? false);
    const [passKeyEnabled, setPassKeyEnabled] = useState(() => user?.passKeyEnabled ?? false);

    const SOCIAL_LOGIN = user && user?.isSocialLogin === true
    const HandleTwoFactorChange = async () => {
        setEmailTwoFactor((prev) => !prev);
        try {
            await UpdateAuthSettings({
                emailtwoFactor: !emailTwoFactor
            });
            toast.success("Authentication settings updated successfully");
        } catch (error) {
            toast.error(error as string);
        }
    }

    const HandleAuthenticatorSetup = async () => {
        try {
            const res = await GnerateTOTP();
            if (res && res.qrCodeDataURL) {
                setAuthenticatorQR(res.qrCodeDataURL);
                setOpenTOTPSetupModal(true);
            }
        } catch (error) {
            toast.error(error as string);
        }
    }

    const handleAuthenticatorDisable = async () => {
        try {
            await UpdateAuthSettings({
                totpEnabled: false
            });
            setAuthenticatorApp(false);
            toast.success("Authenticator app disabled successfully");
        } catch (error) {
            toast.error(error as string);
        }
    }

    const handlePasskeySetup = async () => {
        try {
            const res = await AxiosClient.get("/users/passKey-registration");
            const credentialOptions = res.data.credential;

            const publicKey: PublicKeyCredentialCreationOptions = {
                ...credentialOptions,
                challenge: base64ToArrayBuffer(credentialOptions.challenge),
                user: {
                    ...credentialOptions.user,
                    id: base64ToArrayBuffer(credentialOptions.user.id ?? credentialOptions.user.userId) // Must be ArrayBuffer
                }
            };

            const credential = await navigator.credentials.create({ publicKey });
            if (!credential || !(credential instanceof PublicKeyCredential)) {
                throw new Error("Passkey creation cancelled or failed.");
            }


            const attestation = credential.response as AuthenticatorAttestationResponse;

            await AxiosClient.post("/users/passkey-verification", {
                attestationResponse: {
                    id: credential.id,
                    rawId: arrayBufferToBase64Url(credential.rawId),
                    type: credential.type,
                    response: {
                        clientDataJSON: arrayBufferToBase64Url(attestation.clientDataJSON),
                        attestationObject: arrayBufferToBase64Url(attestation.attestationObject),
                    },
                }
            }
        );
        setPassKeyEnabled(true);
        toast.success("Passkey enabled successfully");

        } catch (error) {
            toast.error(error as string);
        }
    }

    const handleDisablePasskey = async () => {
        try {
            await UpdateAuthSettings({
                passKeyEnabled: false
            });
            setPassKeyEnabled(false);
            toast.success("Passkey disabled successfully");
        } catch (error) {
            toast.error(error as string);
        }
    }

    return (
        <>
        {!SOCIAL_LOGIN &&
            <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex items-center gap-2 mb-4">
                    <FiShield className="w-4 h-4 text-slate-500" />
                    <h2 className="text-sm font-semibold text-slate-700">Security</h2>
                </div>
                <div className="space-y-4">
                    {/* two factor authentication */}
                    <div className="flex items-center justify-between rounded-lg border border-slate-200 p-4">
                        <div className="flex items-center gap-3">
                            <FiKey className="w-4 h-4 text-slate-500" />
                            <div>
                                <div className="text-sm font-medium">Two-factor authentication</div>
                                <div className="text-xs text-slate-500">Add an extra layer of security to your account</div>
                            </div>
                        </div>
                        <button className={`px-3 py-1.5 rounded-md min-w-[70px] ${emailTwoFactor ? "bg-red-500" : "bg-slate-900"} text-white text-xs font-medium cursor-pointer `}
                            onClick={HandleTwoFactorChange}
                        >

                            {loading ? <LoadingSpinner size={15} color="white" /> : (emailTwoFactor ? "Disable 2FA" : "Enable 2FA")}
                        </button>
                    </div>
                    {/*Passkey*/}
                    <div className="flex items-center justify-between rounded-lg border border-slate-200 p-4">
                        <div className="flex items-center gap-3">
                            <FiSmartphone className="w-4 h-4 text-slate-500" />
                            <div>
                                <div className="text-sm font-medium">Passkey</div>
                                <div className="text-xs text-slate-500">Use a device passkey for passwordless sign-in</div>
                            </div>
                        </div>
                        <button className={`px-3 py-1.5 rounded-md border ${passKeyEnabled ? "border-red-500 bg-red-500 text-white" : "border-slate-200 text-slate-700"} text-xs font-medium cursor-pointer`}
                            onClick={passKeyEnabled ? handleDisablePasskey : handlePasskeySetup}
                        >
                            {passKeyEnabled ? "Disable Passkey" : "Set up Passkey"}
                        </button>
                    </div>
                    {/*Authenticator app*/}
                    <div className="flex items-center justify-between rounded-lg border border-slate-200 p-4">
                        <div className="flex items-center gap-3">
                            <FiSmartphone className="w-4 h-4 text-slate-500" />
                            <div>
                                <div className="text-sm font-medium">Authenticator app</div>
                                <div className="text-xs text-slate-500">Generate one-time codes with an authenticator</div>
                            </div>
                        </div>
                        <button
                            className={`px-3 py-1.5 rounded-md border ${authenticatorApp ? "border-red-500 bg-red-500 text-white" : "border-slate-200 text-slate-700"} text-xs font-medium cursor-pointer`}
                            onClick={() => authenticatorApp ? handleAuthenticatorDisable() : HandleAuthenticatorSetup()}
                        >
                            {authenticatorApp ? "Disable" : "Set up"}
                        </button>
                    </div>
                    {/* Change Password */}
                    <div className="flex items-center justify-between rounded-lg border border-slate-200 p-4">
                        <div className="flex items-center gap-3">
                            <FiLock className="w-4 h-4 text-slate-500" />
                            <div>
                                <div className="text-sm font-medium">Change password</div>
                                <div className="text-xs text-slate-500">Update your password regularly</div>
                            </div>
                        </div>
                        <button
                            onClick={() => setIsChangePasswordOpen(true)}
                            className="px-3 py-1.5 rounded-md border border-slate-200 text-xs font-medium text-slate-700 hover:bg-slate-50 transition cursor-pointer"
                        >
                            Update
                        </button>
                    </div>

                    {/* Active sessions */}
                    <div className="flex items-center justify-between rounded-lg border border-slate-200 p-4">
                        <div className="flex items-center gap-3">
                            <FiSmartphone className="w-4 h-4 text-slate-500" />
                            <div>
                                <div className="text-sm font-medium">Active sessions</div>
                                <div className="text-xs text-slate-500">See devices logged into your account</div>
                            </div>
                        </div>
                        <button className="px-3 py-1.5 rounded-md border border-slate-200 text-xs font-medium text-slate-700 hover:bg-slate-50 transition cursor-pointer">
                            Manage
                        </button>
                    </div>
                </div>
            </section>
        }

            {openTOTPSetupModal && (
                <TotpModal
                    authenticatorQR={authenticatorQR}
                    setOpenTOTPSetupModal={setOpenTOTPSetupModal}
                    setAuthenticatorApp={setAuthenticatorApp}
                />
            )}
        </>
    )
}


export default SecuritySetting;
