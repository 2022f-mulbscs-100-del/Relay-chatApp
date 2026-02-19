import { useAuthCall } from "../../customHooks/useAuthCall";
import { useUser } from "../../context/UserProvider";
import { toast } from "react-toastify";
import { useUserApis } from "../../customHooks/useUserApis";
import { useEffect, useState } from "react";
import ChangePasswordModal from "../../Component/ChangePasswordModal";
import UserProfileSetting from "./UserProfileSetting";
import SecuritySetting from "./SecuritySetting";
import SubscriptionSettings from "./SubcriptionSettings";
import NotificationSetting from "./NotificationSetting";
import EmailPrefrencesSetting from "./EmailPrefrencesSetting";
import LogoutCardSetting from "./LogoutCardSetting";
import SettingHeader from "./SettingHeader";

const Settings = () => {
  const { logout } = useAuthCall();
  const { user, setUser } = useUser();
  const { getProfile } = useUserApis();
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);

  const HandleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    switch (name) {
      case "username":
        setUser((prev) => prev ? { ...prev, username: value } : prev);
        break;
      case "email":
        setUser((prev) => prev ? { ...prev, email: value } : prev);
        break;
      case "phone":
        setUser((prev) => prev ? { ...prev, phone: value } : prev);
        break;
      case "location":
        setUser((prev) => prev ? { ...prev, location: value } : prev);
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    try {
      getProfile();
    } catch (error) {
      toast.error(error as string);
    }
  }, []);

  const { UpdateProfile } = useUserApis();
  const SaveChange = async () => {
    if (user) {
      try {
        await UpdateProfile(user.username, user.phone, user.location);
        toast.success("Profile updated successfully");
      } catch (error) {
        toast.error(error as string);
      }
    }
  };
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <div className="w-full px-2 md:px-3 py-6">

        <SettingHeader
          saveChange={SaveChange}
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
          <div className="lg:col-span-2 space-y-6">

            <UserProfileSetting
              HandleChange={HandleChange}
              user={user}
            />

            <SecuritySetting
              setIsChangePasswordOpen={setIsChangePasswordOpen}
            />

            <SubscriptionSettings />
          </div>

          <div className="space-y-6">

            <NotificationSetting />

            <EmailPrefrencesSetting />

            <LogoutCardSetting
              logout={logout}
            />
          </div>

        </div>
      </div>
      <ChangePasswordModal
        open={isChangePasswordOpen}
        onClose={() => setIsChangePasswordOpen(false)}
      />
    </div>
  );
};

export default Settings;
