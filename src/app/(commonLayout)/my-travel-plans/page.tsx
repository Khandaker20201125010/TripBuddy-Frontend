import { MyTravelPlans } from '@/components/My-Travel-Plans/MyTravelPlans';
import { Metadata } from 'next';

export const metadata :Metadata = {
    title: "My Travel Plans | TravelBuddy",
    description: "Create and share your travel plans with friends. View and manage your travel plans with ease!",
}
const MyTravelPlanPage = () => {
    return (
        <div>
            <MyTravelPlans />
        </div>
    );
};

export default MyTravelPlanPage;