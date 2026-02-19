import { useEffect } from 'react';
import { useUserApis } from '../../customHooks/useUserApis';
import ProfileInfoCard from './ProfileInfoCard';
import ProfileSecondaryCards from './ProfileSecondaryCards';
import ContactCard from './ContactCard';
import SettingCard from './SettingCard';
import ActivitiesTab from './ActivitiesTab';

const ProfilePage = () => {

  const { getProfile } = useUserApis();

  useEffect(() => {
    getProfile();
  }, [])

  return (
    <div className=" bg-slate-50 text-slate-900 px-10">
      <ProfileInfoCard />
      <ProfileSecondaryCards />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        <div className="space-y-6">
          <ContactCard />
          <SettingCard />
        </div>
        <ActivitiesTab />
      </div>
    </div>
  );
};

export default ProfilePage;
