import { TravelPlan } from "@/types/travel";
import { TravelBuddyCard } from "./TravelBuddyCard";

export function MatchedTravelGrid({ plans }: { plans: TravelPlan[] }) {
  if (!plans.length) {
    return <p className="text-center text-stone-500">No matches found</p>;
  }

  return (
    <div className="grid md:grid-cols-2 gap-6">
      {plans.map(plan => (
        <TravelBuddyCard key={plan.id} plan={plan} />
      ))}
    </div>
  );
}
