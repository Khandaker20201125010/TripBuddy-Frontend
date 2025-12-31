import ManageUsersComponent from '@/components/AdminDashBoardComponents/ManageUsersComponent';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: "Manage Users | TravelBuddy",
    description: "Manage your users with ease!",
}
const ManageUsersPage = () => {
    return (
        <div>
            <ManageUsersComponent />
        </div>
    );
};

export default ManageUsersPage;