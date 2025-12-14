
import { Map, Plus } from 'lucide-react'
import { Button } from '../ui/button'

interface EmptyPlansStateProps {
  onAddPlan: () => void
  filterType: string
}
export function EmptyPlansState({
  onAddPlan,
  filterType,
}: EmptyPlansStateProps) {
  const isFiltered = filterType !== 'all'
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center bg-white rounded-xl border border-dashed border-gray-300">
      <div className="bg-amber-50 p-4 rounded-full mb-4">
        <Map className="w-8 h-8 text-amber-500" />
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">
        {isFiltered ? `No ${filterType} plans found` : 'No travel plans yet'}
      </h3>
      <p className="text-gray-500 max-w-sm mb-6">
        {isFiltered
          ? `You don't have any ${filterType} trips at the moment. Check other categories or add a new one.`
          : 'Start planning your next adventure! Create a travel plan to organize your trips and share them with friends.'}
      </p>
      <Button variant="gradient" onClick={onAddPlan}>
        <Plus className="w-4 h-4 mr-2" />
        Create Travel Plan
      </Button>
    </div>
  )
}
