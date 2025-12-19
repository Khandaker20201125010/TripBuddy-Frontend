'use client'

import { useMemo, useState } from 'react'
import { Plus, Plane } from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'
import { useSession } from 'next-auth/react'
import { TravelPlan, TravelPlanFormData, TravelStatus } from '@/types/travel'
import { useMyTravelPlans } from '@/hooks/travelshooks/useMyTravelPlans'
import { getPlanStatus } from '../shared/getPlanStatus'
import { TravelPlanCard } from './TravelPlanCard'
import { PlanFilters } from './PlanFilters'
import { Button } from '../ui/button'
import { Modal } from '../ui/Modal'
import { TravelPlanForm } from './TravelPlanForm'
import { DeleteConfirmDialog } from './DeleteConfirmDialog'

export function MyTravelPlans() {
  const { plans, loading, createPlans, updatePlan, deletePlan } = useMyTravelPlans()
  const { data: session } = useSession();
  const [filter, setFilter] = useState<TravelStatus | 'all'>('all')
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingPlan, setEditingPlan] = useState<TravelPlan | undefined>()
  const [deletingPlan, setDeletingPlan] = useState<TravelPlan | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const currentUserId = (session?.user as any)?.id;

  // Filter ONLY my plans for this specific page
  const myPlans = useMemo(() => {
    return plans.filter(p => String(p.userId) === String(currentUserId));
  }, [plans, currentUserId]);

  const filteredPlans = useMemo(() => {
    if (filter === 'all') return myPlans;
    return myPlans.filter(plan => getPlanStatus(plan.startDate, plan.endDate) === filter);
  }, [myPlans, filter]);

  const counts = useMemo(() => ({
    all: myPlans.length,
    upcoming: myPlans.filter(p => getPlanStatus(p.startDate, p.endDate) === 'upcoming').length,
    ongoing: myPlans.filter(p => getPlanStatus(p.startDate, p.endDate) === 'ongoing').length,
    completed: myPlans.filter(p => getPlanStatus(p.startDate, p.endDate) === 'completed').length,
    MyPlans: myPlans.length, // Consistency for the Filter component
  }), [myPlans]);

  const handleFormSubmit = async (data: TravelPlanFormData) => {
    setIsSubmitting(true);
    try {
      editingPlan ? await updatePlan(editingPlan.id, data) : await createPlans(data);
      setIsFormOpen(false);
    } finally { setIsSubmitting(false); }
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 flex items-center">
                <Plane className="w-6 h-6 mr-3 text-amber-600" /> My Travel Plans
              </h1>
            </div>
            <Button variant={'gradient'} onClick={() => { setEditingPlan(undefined); setIsFormOpen(true); }}>
              <Plus className="w-5 h-5 mr-2" /> Add Plan
            </Button>
          </div>
          <div className="mt-6">
            <PlanFilters currentFilter={filter as any} onFilterChange={(f) => setFilter(f as any)} counts={counts as any} />
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? <p className="text-center">Loading...</p> : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPlans.map(plan => (
              <TravelPlanCard key={plan.id} plan={plan} isOwner={true} onEdit={(p) => { setEditingPlan(p); setIsFormOpen(true); }} onDelete={setDeletingPlan} />
            ))}
          </div>
        )}
      </main>
      <Modal isOpen={isFormOpen} onClose={() => !isSubmitting && setIsFormOpen(false)} title={editingPlan ? 'Edit Plan' : 'New Plan'}>
        <TravelPlanForm initialData={editingPlan} onSubmit={handleFormSubmit} onCancel={() => setIsFormOpen(false)} isSubmitting={isSubmitting} />
      </Modal>
      <DeleteConfirmDialog isOpen={!!deletingPlan} onClose={() => setDeletingPlan(null)} onConfirm={async () => { if(deletingPlan){ await deletePlan(deletingPlan.id); setDeletingPlan(null); }}} planName={deletingPlan?.destination || ''} isDeleting={isSubmitting} />
    </div>
  )
}