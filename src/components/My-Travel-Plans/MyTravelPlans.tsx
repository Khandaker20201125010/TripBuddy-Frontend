'use client'

import { useMemo, useState, useEffect } from 'react'
import { Plus, Plane } from 'lucide-react'
import { useSession } from 'next-auth/react'
import { TravelPlan, TravelPlanFormData } from '@/types/travel'
import { getPlanStatus } from '../shared/getPlanStatus'
import { TravelPlanCard } from './TravelPlanCard'
import { PlanFilters, FilterType } from './PlanFilters'
import { Button } from '../ui/button'
import { Modal } from '../ui/Modal'
import { TravelPlanForm } from './TravelPlanForm'
import { DeleteConfirmDialog } from './DeleteConfirmDialog'
import { useMyTravelPlans } from '@/hooks/travelshooks/useMyTravelPlans'

export function MyTravelPlans() {
  const { plans, userPlans, loading, createPlans, updatePlan, deletePlan } = useMyTravelPlans()
  const { data: session, status } = useSession()

  const [filter, setFilter] = useState<FilterType>('all')
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingPlan, setEditingPlan] = useState<TravelPlan | undefined>()
  const [deletingPlan, setDeletingPlan] = useState<TravelPlan | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // FORCE LOGGING - If this doesn't show in console, your page isn't reloading properly
  useEffect(() => {
    if (status !== 'loading') {
      console.log("--- AUTH DEBUG START ---");
      console.log("Full Session Object:", session);
      console.log("Logged In User ID:", session?.user?.id);
      console.log("Total Plans Found:", plans.length);
      console.log("--- AUTH DEBUG END ---");
    }
  }, [session, status, plans]);

  const filteredPlans = useMemo(() => {
    if (filter === 'MyPlans') return userPlans;
    if (filter === 'all') return plans;
    return plans.filter(plan => getPlanStatus(plan.startDate, plan.endDate) === filter);
  }, [plans, userPlans, filter]);

  const counts = useMemo(() => ({
    all: plans.length,
    MyPlans: userPlans.length,
    upcoming: plans.filter(p => getPlanStatus(p.startDate, p.endDate) === 'upcoming').length,
    ongoing: plans.filter(p => getPlanStatus(p.startDate, p.endDate) === 'ongoing').length,
    completed: plans.filter(p => getPlanStatus(p.startDate, p.endDate) === 'completed').length,
  }), [plans, userPlans]);

  const handleFormSubmit = async (data: TravelPlanFormData) => {
    setIsSubmitting(true);
    try {
      if (editingPlan) {
        await updatePlan(editingPlan.id, data);
      } else {
        await createPlans(data);
        setFilter('MyPlans');
      }
      setIsFormOpen(false);
    } catch (err) {
      console.error("Submit Error:", err);
    } finally {
      setIsSubmitting(false);
    }
  }

  if (status === 'loading') {
    return <div className="h-screen flex items-center justify-center">Verifying session...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900 flex items-center">
              <Plane className="w-6 h-6 mr-3 text-amber-600" /> Travel Community
            </h1>
            <Button variant={'gradient'} onClick={() => { setEditingPlan(undefined); setIsFormOpen(true); }}>
              <Plus className="w-5 h-5 mr-2" /> Add Plan
            </Button>
          </div>
          <div className="mt-6">
            <PlanFilters currentFilter={filter} onFilterChange={setFilter} counts={counts} />
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading && plans.length === 0 ? (
          <p className="text-center text-gray-500 mt-10">Loading plans...</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPlans.map(plan => {
              // The comparison Logic
              const sUserId = session?.user?.id ? String(session.user.id) : null;
              
              // Note: Check if your backend uses 'userId', 'user_id', or 'authorId'
              // If your backend returns the whole user object, it might be plan.user.id
              const pUserId = plan.userId ? String(plan.userId) : (plan.user?.id ? String(plan.user.id) : null);
              
              const isOwner = sUserId && pUserId && sUserId === pUserId;

              return (
                <TravelPlanCard
                  key={plan.id}
                  plan={plan}
                  isOwner={!!isOwner}
                  onEdit={(p) => { setEditingPlan(p); setIsFormOpen(true); }}
                  onDelete={setDeletingPlan}
                />
              )
            })}
          </div>
        )}
      </main>

      <Modal isOpen={isFormOpen} onClose={() => !isSubmitting && setIsFormOpen(false)} title={editingPlan ? 'Edit Plan' : 'New Plan'}>
        <TravelPlanForm initialData={editingPlan} onSubmit={handleFormSubmit} onCancel={() => setIsFormOpen(false)} isSubmitting={isSubmitting} />
      </Modal>

      <DeleteConfirmDialog
        isOpen={!!deletingPlan}
        onClose={() => setDeletingPlan(null)}
        onConfirm={async () => {
          if (deletingPlan) {
            await deletePlan(deletingPlan.id);
            setDeletingPlan(null);
          }
        }}
        planName={deletingPlan?.destination || ''}
        isDeleting={isSubmitting}
      />
    </div>
  )
}