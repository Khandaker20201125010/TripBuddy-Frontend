import PlanDetailsPage from '@/components/modules/My-Travel-Plans/PlanDetailsPage';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: "View Plan Details | TravelBuddy",
    description: "View and Join your travel plans with ease!",
}

const DetailsPage = () => {
    return (
        <div>
            <PlanDetailsPage />
        </div>
    );
};

export default DetailsPage;