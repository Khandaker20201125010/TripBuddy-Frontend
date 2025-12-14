import { TravelPlan } from '@/types/travel'
import { Calendar, DollarSign, MapPin, Edit2, Trash2 } from 'lucide-react'
import { Badge } from '../ui/badge'
import { Button } from '../ui/button'

interface Props {
  plan: TravelPlan
  onEdit: (plan: TravelPlan) => void
  onDelete: (plan: TravelPlan) => void
}

export function TravelPlanCard({ plan, onEdit, onDelete }: Props) {
  return (
    <div className="bg-white border rounded-xl p-5">
      <div className="flex justify-between">
        <h3 className="font-bold flex items-center">
          <MapPin className="w-4 h-4 mr-2" />
          {plan.destination}
        </h3>
        <Badge>{plan.status}</Badge>
      </div>

      <div className="text-sm text-gray-600 mt-3 space-y-2">
        <div className="flex items-center">
          <Calendar className="w-4 h-4 mr-2" />
          {new Date(plan.startDate).toDateString()} –{' '}
          {new Date(plan.endDate).toDateString()}
        </div>

        <div className="flex items-center">
          <DollarSign className="w-4 h-4 mr-2" />
          ${plan.budget}
        </div>
      </div>

      <div className="flex justify-end gap-2 mt-4">
        <Button variant="gradient" onClick={() => onEdit(plan)}>
          <Edit2 className="w-4 h-4 text-amber-600" />
        </Button>
        <Button variant="gradient" onClick={() => onDelete(plan)}>
          <Trash2 className="w-4 h-4 text-red-600" />
        </Button>
      </div>
    </div>
  )
}
