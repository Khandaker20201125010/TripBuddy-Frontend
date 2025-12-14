import { MapPin, Calendar, User, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TravelPlan } from "@/types/travel";

export function TravelBuddyCard({ plan }: { plan: TravelPlan }) {
  return (
    <article className="group bg-white rounded-2xl p-6 shadow-sm hover:shadow-xl border border-gray-100 transition-all duration-300 transform hover:-translate-y-1 flex flex-col h-full">
      
      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-bold text-gray-900">
            {plan.destination}
          </h3>
          <div className="flex items-center text-sm text-gray-500 mt-1">
            <MapPin className="w-4 h-4 mr-1 text-orange-500" />
            Hosted by {plan.user?.name ?? "Traveler"}
          </div>
        </div>

        <Badge className="bg-orange-50 text-orange-700 border-orange-100">
          {plan.travelType}
        </Badge>
      </div>

      {/* Trip Details Box */}
      <div className="bg-gray-50 rounded-xl p-4 mb-5 border border-gray-100">
        <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
          Trip Details
        </h4>

        <div className="space-y-2 text-sm">
          <div className="flex items-center text-gray-700">
            <Calendar className="w-4 h-4 mr-2 text-gray-400" />
            {new Date(plan.startDate).toDateString()} –{" "}
            {new Date(plan.endDate).toDateString()}
          </div>

          <div className="flex items-center text-gray-700">
            <User className="w-4 h-4 mr-2 text-gray-400" />
            {plan.travelType} Trip
          </div>

          <div className="flex items-center text-gray-700 font-medium">
            <DollarSign className="w-4 h-4 mr-2 text-green-600" />
            ${plan.budget}
          </div>
        </div>
      </div>

      {/* Description */}
      <p className="text-sm text-gray-600 line-clamp-2 mb-6">
        {plan.description}
      </p>

      {/* Actions */}
      <div className="mt-auto grid grid-cols-2 gap-3">
        <Button variant="outline" size="sm">
          View Plan
        </Button>
        <Button variant="default" size="sm" className="bg-orange-600 hover:bg-orange-700">
          Request to Join
        </Button>
      </div>
    </article>
  );
}
