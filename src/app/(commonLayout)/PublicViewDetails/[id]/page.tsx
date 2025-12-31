import PlanDetailsPage from "@/components/My-Travel-Plans/PlanDetailsPage";
import { Metadata } from "next";

export const metadata :Metadata= {
    title: "Plan Details | TravelBuddy",
    description: "View and Join your travel plans with ease!",
}
const PublicViewDetailsPage = () => {
    return (
        <div>
             <PlanDetailsPage />
        </div>
    );
};

export default PublicViewDetailsPage;