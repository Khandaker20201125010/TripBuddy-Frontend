import ManageRequests from '@/components/UserDashBoardComonents/ManagerRequest';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Manage Requests | TravelBuddy",
  description: "Manage your travel plan requests with ease!",
}
const ManageRequestPage = () => {
  return (
    <div>
       <ManageRequests />
    </div>
  );
};

export default ManageRequestPage;