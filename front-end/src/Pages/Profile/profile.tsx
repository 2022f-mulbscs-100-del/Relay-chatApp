import { useEffect, useState } from 'react';
import { useUserApis } from '../../customHooks/useUserApis';
import ProfileInfoCard from './ProfileInfoCard';
import ProfileSecondaryCards from './ProfileSecondaryCards';
import ContactCard from './ContactCard';
import SettingCard from './SettingCard';
import ActivitiesTab from './ActivitiesTab';
import { toast } from 'react-toastify';

const ProfilePage = () => {

  const { getProfile, getSharedMedia } = useUserApis();
  const [sharedMedia, setSharedMedia] = useState([]);

  useEffect(() => {
    getProfile();
  }, []);


  useEffect(() => {
    const fetchSharedMedia = async () => {
      try {
        const data = await getSharedMedia();
        setSharedMedia(data);

      } catch {
        toast.error("Failed to fetch shared media. Please try again later.");
      }
    }
    fetchSharedMedia();
  }, []);

  return (
    <div className="bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 px-10 transition-colors duration-200">
      <ProfileInfoCard />
      <ProfileSecondaryCards />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        <div className="space-y-6">
          <ContactCard />
          <SettingCard />
        </div>
        <ActivitiesTab
        sharedMedia={sharedMedia}
        />
      </div>
    </div>
  );
};

export default ProfilePage;
