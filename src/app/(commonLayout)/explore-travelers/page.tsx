
import { ExploreTravelersPageContent } from '@/components/modules/ExploreTravelersContent/ExploreTravelersPageContent';
import { Metadata } from 'next';

export const metadata : Metadata = {
    title: "Explore Travelers | TravelBuddy",
    description: "Explore travelers and find your perfect match for your next adventure!",
    
}
const ExploreTravelers = () => {
    return (
        <div>
            <ExploreTravelersPageContent />
        </div>
    );
};

export default ExploreTravelers;