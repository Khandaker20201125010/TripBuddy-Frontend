import ManageTravelPlansComponents from '@/components/AdminDashBoardComponents/ManageTravelPlansComonents';
import { Metadata } from 'next';

export const metadata :Metadata = {
    title: "Manage Travel Plans | TravelBuddy",
    description: "Manage your travel plans with ease!",
}

const ManageTravelPlansPage = () => {
    return (
        <div>
            <ManageTravelPlansComponents></ManageTravelPlansComponents>
        </div>
    );
};

export default ManageTravelPlansPage;