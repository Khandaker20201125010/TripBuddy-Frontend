import FindTravelBuddyComponents from "@/components/find-buddy/find-travel-buddy-components";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Find Travel Buddies | TravelBuddy",
    description: "Find your perfect travel buddy with TravelBuddy!",
}
const FindTravelBuddyPage = () => {
    return (
        <div>
            <FindTravelBuddyComponents />
        </div>
    );
};

export default FindTravelBuddyPage;