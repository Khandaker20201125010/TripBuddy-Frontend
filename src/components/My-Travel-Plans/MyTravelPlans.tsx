'use client'

import { useMemo, useState } from 'react'
import { Plus, Plane } from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'
import { TravelPlan, TravelPlanFormData, TravelStatus } from '@/types/travel'
import { DeleteConfirmDialog } from './DeleteConfirmDialog'
import { TravelPlanForm } from './TravelPlanForm'
import { Modal } from '../ui/Modal'
import { EmptyPlansState } from './EmptyPlansState'
import { TravelPlanCard } from './TravelPlanCard'
import { PlanFilters } from './PlanFilters'
import { Button } from '../ui/button'
import { useMyTravelPlans } from '@/hooks/travelshooks/useMyTravelPlans'
import { getPlanStatus } from '../shared/getPlanStatus'



export function MyTravelPlans() {
    const { plans, loading, createPlans, updatePlan, deletePlan, } = useMyTravelPlans()

    const [filter, setFilter] = useState<TravelStatus | 'all'>('all')
    const [isFormOpen, setIsFormOpen] = useState(false)
    const [editingPlan, setEditingPlan] = useState<TravelPlan | undefined>()
    const [deletingPlan, setDeletingPlan] = useState<TravelPlan | null>(null)
    const [isSubmitting, setIsSubmitting] = useState(false)

  
 const filteredPlans = useMemo(() => {
  if (filter === 'all') return plans;

  return plans.filter(plan =>
    getPlanStatus(plan.startDate, plan.endDate) === filter
  );
}, [plans, filter]);

 const counts = useMemo(
  () => ({
    all: plans.length,
    upcoming: plans.filter(
      p => getPlanStatus(p.startDate, p.endDate) === 'upcoming'
    ).length,
    ongoing: plans.filter(
      p => getPlanStatus(p.startDate, p.endDate) === 'ongoing'
    ).length,
    completed: plans.filter(
      p => getPlanStatus(p.startDate, p.endDate) === 'completed'
    ).length,
  }),
  [plans],
);

    /* ================= Handlers ================= */
    const handleAddPlan = () => {
        setEditingPlan(undefined)
        setIsFormOpen(true)
    }

    const handleEditPlan = (plan: TravelPlan) => {
        setEditingPlan(plan)
        setIsFormOpen(true)
    }

    const handleDeleteClick = (plan: TravelPlan) => {
        setDeletingPlan(plan)
    }

    const handleConfirmDelete = async () => {
        if (!deletingPlan) return
        setIsSubmitting(true)
        try {
            await deletePlan(deletingPlan.id)
            setDeletingPlan(null)
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleFormSubmit = async (data: TravelPlanFormData) => {
        setIsSubmitting(true)
        try {
            if (editingPlan) {
                await updatePlan(editingPlan.id, data)
            } else {
                await createPlans(data)
            }
            setIsFormOpen(false)
            setEditingPlan(undefined)
        } finally {
            setIsSubmitting(false)
        }
    }

    /* ================= UI ================= */
    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900 flex items-center">
                                <Plane className="w-6 h-6 mr-3 text-amber-600" />
                                My Travel Plans
                            </h1>
                            <p className="mt-1 text-sm text-gray-500">
                                Manage your upcoming adventures and past memories
                            </p>
                        </div>
                        <Button variant={'gradient'} onClick={handleAddPlan}>
                            <Plus className="w-5 h-5 mr-2" />
                            Add Travel Plan
                        </Button>
                    </div>

                    <div className="mt-6">
                        <PlanFilters
                            currentFilter={filter}
                            onFilterChange={setFilter}
                            counts={counts}
                        />
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {loading ? (
                    <p className="text-center text-gray-500">Loading plans...</p>
                ) : (
                    <AnimatePresence mode="wait">
                        {filteredPlans.length > 0 ? (
                            <motion.div
                                layout
                                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                            >
                                <AnimatePresence>
                                    {filteredPlans.map(plan => (
                                        <TravelPlanCard
                                            key={plan.id}
                                            plan={plan}
                                            onEdit={handleEditPlan}
                                            onDelete={handleDeleteClick}
                                        />
                                    ))}
                                </AnimatePresence>
                            </motion.div>
                        ) : (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                            >
                                <EmptyPlansState onAddPlan={handleAddPlan} filterType={filter} />
                            </motion.div>
                        )}
                    </AnimatePresence>
                )}
            </main>

            <Modal
                isOpen={isFormOpen}
                onClose={() => !isSubmitting && setIsFormOpen(false)}
                title={editingPlan ? 'Edit Travel Plan' : 'Create New Travel Plan'}
                maxWidth="lg"
            >
                <TravelPlanForm
                    initialData={editingPlan}
                    onSubmit={handleFormSubmit}
                    onCancel={() => setIsFormOpen(false)}
                    isSubmitting={isSubmitting}
                />
            </Modal>

            <DeleteConfirmDialog
                isOpen={!!deletingPlan}
                onClose={() => setDeletingPlan(null)}
                onConfirm={handleConfirmDelete}
                planName={deletingPlan?.destination || ''}
                isDeleting={isSubmitting}
            />
        </div>
    )
}
