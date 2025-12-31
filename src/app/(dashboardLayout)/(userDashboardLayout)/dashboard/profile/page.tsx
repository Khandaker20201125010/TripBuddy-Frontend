import UserProfilePage from '@/components/UserDashBoardComonents/UserProfile';
import { Metadata } from 'next';
export const metadata:Metadata = {
  title  : "Profile | TravelBuddy", 
  description: "View and manage your profile with ease!",
}
const ProfilePage = () => {
    return (
        <div>
            <UserProfilePage />
        </div>
    );
};

export default ProfilePage;