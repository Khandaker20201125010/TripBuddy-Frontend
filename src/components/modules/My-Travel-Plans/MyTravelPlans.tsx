/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { useMemo, useState } from 'react'
import { Plus, Plane, Calendar, MapPin, Users, Sparkles, ChevronRight, Globe, TrendingUp, Clock, ChevronLeft, ChevronRight as RightIcon } from 'lucide-react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Swal from 'sweetalert2'
import { TravelPlan, TravelPlanFormData } from '@/types/travel'
import { getPlanStatus } from '../../shared/getPlanStatus'
import { TravelPlanCard } from './TravelPlanCard'
import { PlanFilters, FilterType } from './PlanFilters'
import { Button } from '../../ui/button'
import { Modal } from '../../ui/Modal'
import { TravelPlanForm } from './TravelPlanForm'
import { DeleteConfirmDialog } from './DeleteConfirmDialog'
import { useMyTravelPlans } from '@/hooks/travelshooks/useMyTravelPlans'
import { Badge } from '../../ui/badge'
import { motion } from 'framer-motion'

// Defined Limits based on subscription tiers
const PLAN_LIMITS = {
  FREE: 2,
  EXPLORER: 5,
  UNLIMITED: Infinity
};

// Pagination constants
const ITEMS_PER_PAGE = 9; // Show 9 cards per page (3x3 grid)

export function MyTravelPlans() {
  const { plans, userPlans, loading, createPlans, updatePlan, deletePlan } = useMyTravelPlans()
  const { data: session, status } = useSession()
  const router = useRouter()

  const [filter, setFilter] = useState<FilterType>('all')
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingPlan, setEditingPlan] = useState<TravelPlan | undefined>()
  const [deletingPlan, setDeletingPlan] = useState<TravelPlan | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1)

  // Memoized filtered plans list
  const filteredPlans = useMemo(() => {
    if (filter === 'MyPlans') return userPlans;
    if (filter === 'all') return plans;
    return plans.filter(plan => getPlanStatus(plan.startDate, plan.endDate) === filter);
  }, [plans, userPlans, filter]);

  // Calculate paginated plans
  const paginatedPlans = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return filteredPlans.slice(startIndex, endIndex);
  }, [filteredPlans, currentPage]);

  // Calculate total pages
  const totalPages = useMemo(() => {
    return Math.ceil(filteredPlans.length / ITEMS_PER_PAGE);
  }, [filteredPlans.length]);

  // Memoized counts for the filter tabs
  const counts = useMemo(() => ({
    all: plans.length,
    MyPlans: userPlans.length,
    upcoming: plans.filter(p => getPlanStatus(p.startDate, p.endDate) === 'upcoming').length,
    ongoing: plans.filter(p => getPlanStatus(p.startDate, p.endDate) === 'ongoing').length,
    completed: plans.filter(p => getPlanStatus(p.startDate, p.endDate) === 'completed').length,
  }), [plans, userPlans]);

  // Calculate travel statistics
  const travelStats = useMemo(() => {
    const upcomingCount = plans.filter(p => getPlanStatus(p.startDate, p.endDate) === 'upcoming').length;
    const ongoingCount = plans.filter(p => getPlanStatus(p.startDate, p.endDate) === 'ongoing').length;
    const completedCount = plans.filter(p => getPlanStatus(p.startDate, p.endDate) === 'completed').length;

    // Count unique destinations from all plans
    const destinations = [...new Set(plans.map(p => p.destination))].length;

    // Calculate total travel days for user's plans
    const userTotalDays = userPlans.reduce((sum, plan) => {
      const start = new Date(plan.startDate);
      const end = new Date(plan.endDate);
      const diffTime = Math.abs(end.getTime() - start.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; // +1 to include both start and end days
      return sum + diffDays;
    }, 0);

    // Get subscription info
    const subType = (session?.user as any)?.subscriptionType;
    const planLimit = subType === 'MONTHLY' || subType === 'YEARLY'
      ? PLAN_LIMITS.UNLIMITED
      : subType === 'EXPLORER'
        ? PLAN_LIMITS.EXPLORER
        : PLAN_LIMITS.FREE;

    return {
      upcoming: upcomingCount,
      ongoing: ongoingCount,
      completed: completedCount,
      destinations,
      userTotalDays,
      totalPlans: plans.length,
      userPlansCount: userPlans.length,
      planLimit,
      remainingPlans: Math.max(0, planLimit - userPlans.length),
      subscriptionType: subType || 'FREE'
    };
  }, [plans, userPlans, session]);

  /**
   * Logic to check plan limits and show SweetAlert2 if limit is exceeded
   */
  const handleCreateClick = () => {
    const currentCount = userPlans.length;

    // Safely get subscription type from session
    const subType = (session?.user as any)?.subscriptionType;

    let limit = PLAN_LIMITS.FREE;
    if (subType === 'MONTHLY' || subType === 'YEARLY') {
      limit = PLAN_LIMITS.UNLIMITED;
    } else if (subType === 'EXPLORER') {
      limit = PLAN_LIMITS.EXPLORER;
    }

    if (currentCount >= limit) {
      Swal.fire({
        title: 'Plan Limit Reached',
        text: `Your current plan allows up to ${limit} travel plans. Upgrade now to unlock more!`,
        icon: 'info',
        showCancelButton: true,
        confirmButtonColor: '#f59e0b', // Amber-500
        cancelButtonColor: '#6b7280',
        confirmButtonText: 'View Pricing',
        cancelButtonText: 'Maybe Later',
        reverseButtons: true,
        background: '#ffffff',
        color: '#1f2937',
        iconColor: '#f59e0b',
      }).then((result) => {
        if (result.isConfirmed) {
          // Redirects to landing page and auto-scrolls to pricing section
          router.push('/#pricing');
        }
      });
      return;
    }

    setEditingPlan(undefined);
    setIsFormOpen(true);
  };

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
      Swal.fire({
        title: 'Subscription Required',
        text: 'It looks like you have reached your plan limit. Please upgrade to continue.',
        icon: 'warning',
        confirmButtonColor: '#f59e0b',
        confirmButtonText: 'Upgrade Now',
        background: '#ffffff',
        color: '#1f2937',
        iconColor: '#f59e0b',
      }).then((res) => {
        if (res.isConfirmed) router.push('/#pricing');
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  // Handle filter change - reset to page 1
  const handleFilterChange = (newFilter: FilterType) => {
    setFilter(newFilter);
    setCurrentPage(1); // Reset to first page when filter changes
  }

  // Pagination handlers
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Scroll to top of plans section for better UX
    const plansSection = document.getElementById('plans-grid-section');
    if (plansSection) {
      plansSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  // Generate page numbers for pagination
  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      // Show all pages
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      // Always show first page
      pageNumbers.push(1);

      // Calculate start and end of visible pages
      let start = Math.max(2, currentPage - 1);
      let end = Math.min(totalPages - 1, currentPage + 1);

      // Adjust if near start
      if (currentPage <= 3) {
        end = Math.min(totalPages - 1, maxVisiblePages - 1);
      }

      // Adjust if near end
      if (currentPage >= totalPages - 2) {
        start = Math.max(2, totalPages - (maxVisiblePages - 2));
      }

      // Add ellipsis at start if needed
      if (start > 2) {
        pageNumbers.push('...');
      }

      // Add middle pages
      for (let i = start; i <= end; i++) {
        pageNumbers.push(i);
      }

      // Add ellipsis at end if needed
      if (end < totalPages - 1) {
        pageNumbers.push('...');
      }

      // Always show last page
      pageNumbers.push(totalPages);
    }

    return pageNumbers;
  }

  if (status === 'loading') {
    return (
      <div className="h-screen flex items-center justify-center bg-gradient-to-br from-stone-50 via-white to-amber-50/20">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-orange-200 border-t-orange-600 mb-4"></div>
          <p className="text-stone-600 font-medium">Verifying your session...</p>
        </div>
      </div>
    );
  }

  // Determine user's plan status badge
  const getPlanStatusBadge = () => {
    const subType = travelStats.subscriptionType;
    if (subType === 'MONTHLY' || subType === 'YEARLY') {
      return { text: 'Premium', color: 'bg-gradient-to-r from-purple-500 to-pink-500 text-white' };
    } else if (subType === 'EXPLORER') {
      return { text: 'Explorer', color: 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white' };
    } else {
      return { text: 'Free', color: 'bg-gradient-to-r from-amber-500 to-orange-500 text-white' };
    }
  };

  const planStatusBadge = getPlanStatusBadge();

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-50 via-white to-amber-50/20 pb-20">
      {/* Enhanced Professional Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="md:sticky top-0 z-40 bg-gradient-to-r from-white via-white to-orange-50 border-b border-stone-200 shadow-sm backdrop-blur-sm bg-white/95"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Top Bar */}
          <div className="py-4 border-b border-stone-100">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-gradient-to-br from-orange-100 to-amber-100 rounded-xl shadow-xs">
                    <Plane className="w-5 h-5 text-orange-600" />
                  </div>
                  <div>
                    <h1 className="text-xl font-bold text-stone-900">Travel Community Hub</h1>
                    <p className="text-sm text-stone-500 flex items-center gap-1">
                      <span>Discover & Share Travel Adventures</span>
                      <ChevronRight className="w-3 h-3" />
                      <Badge className={`px-2 py-0.5 text-xs font-medium ${planStatusBadge.color}`}>
                        {planStatusBadge.text} Plan
                      </Badge>
                    </p>
                  </div>
                </div>

                {/* Quick Stats */}
                <div className="hidden md:flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                    <span className="text-sm text-stone-600">
                      <span className="font-bold text-stone-900">{travelStats.ongoing}</span> ongoing trips
                    </span>
                  </div>
                  <div className="w-px h-4 bg-stone-300"></div>
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-blue-500" />
                    <span className="text-sm text-stone-600">
                      <span className="font-bold text-stone-900">{plans.length}</span> total plans
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="hidden md:block">
                  <Badge variant="outline" className="border-emerald-200 bg-emerald-50 text-emerald-700">
                    <Sparkles className="w-3 h-3 mr-1" />
                    {travelStats.remainingPlans} plans left
                  </Badge>
                </div>
                <Button
                  variant={'gradient'}
                  onClick={handleCreateClick}
                  className="shadow-md shadow-orange-200 hover:shadow-lg hover:shadow-orange-300 transition-shadow"
                >
                  <Plus className="w-5 h-5 mr-2" />
                  <span className="hidden sm:inline">New Travel Plan</span>
                  <span className="sm:hidden">New Plan</span>
                </Button>
              </div>
            </div>
          </div>

          {/* Statistics Dashboard */}
          <div className="py-5">
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 mb-6">
              {/* Total Community Plans */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 }}
                className="bg-white p-4 rounded-xl border border-stone-200 shadow-xs hover:shadow-sm transition-shadow"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-50 rounded-lg">
                    <Globe className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-stone-500">Community Plans</p>
                    <p className="text-2xl font-bold text-stone-900">{travelStats.totalPlans}</p>
                  </div>
                </div>
              </motion.div>

              {/* Your Plans */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                className="bg-white p-4 rounded-xl border border-stone-200 shadow-xs hover:shadow-sm transition-shadow"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-amber-50 rounded-lg">
                    <Plane className="w-5 h-5 text-amber-600" />
                  </div>
                  <div>
                    <p className="text-sm text-stone-500">Your Plans</p>
                    <p className="text-2xl font-bold text-stone-900">{travelStats.userPlansCount}</p>
                    <p className="text-xs text-stone-400">of {travelStats.planLimit === Infinity ? '∞' : travelStats.planLimit}</p>
                  </div>
                </div>
              </motion.div>

              {/* Destinations */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 }}
                className="bg-white p-4 rounded-xl border border-stone-200 shadow-xs hover:shadow-sm transition-shadow"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-emerald-50 rounded-lg">
                    <MapPin className="w-5 h-5 text-emerald-600" />
                  </div>
                  <div>
                    <p className="text-sm text-stone-500">Destinations</p>
                    <p className="text-2xl font-bold text-stone-900">{travelStats.destinations}</p>
                  </div>
                </div>
              </motion.div>

              {/* Travel Days */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 }}
                className="bg-white p-4 rounded-xl border border-stone-200 shadow-xs hover:shadow-sm transition-shadow hidden md:block"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-violet-50 rounded-lg">
                    <Calendar className="w-5 h-5 text-violet-600" />
                  </div>
                  <div>
                    <p className="text-sm text-stone-500">Your Travel Days</p>
                    <p className="text-2xl font-bold text-stone-900">{travelStats.userTotalDays}</p>
                  </div>
                </div>
              </motion.div>

              {/* Activity Progress */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 }}
                className="bg-gradient-to-r from-orange-50 to-amber-50 p-4 rounded-xl border border-orange-200 shadow-xs col-span-2 md:col-span-1 hover:shadow-sm transition-shadow"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-orange-700 font-medium">Active Trips</p>
                    <p className="text-xl font-bold text-stone-900">
                      {travelStats.ongoing}
                    </p>
                    <p className="text-xs text-orange-600">Live right now</p>
                  </div>
                  <div className="relative w-12 h-12">
                    <div className="absolute inset-0 rounded-full border-4 border-orange-200"></div>
                    <div className="absolute inset-0 rounded-full border-4 border-orange-500 border-t-transparent border-r-transparent transform -rotate-45"
                      style={{
                        clipPath: `polygon(0 0, 100% 0, 100% ${Math.min(100, (travelStats.ongoing / Math.max(1, travelStats.totalPlans)) * 100)}%, 0 ${Math.min(100, (travelStats.ongoing / Math.max(1, travelStats.totalPlans)) * 100)}%)`
                      }}
                    ></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Clock className="w-5 h-5 text-orange-500" />
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Filters Section */}
            <div className="mt-2">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-stone-800">Explore Travel Plans</h3>
                  <p className="text-sm text-stone-500">
                    Browse community plans or filter by status
                    {session?.user && (
                      <span className="ml-2 text-amber-600 font-medium">
                        • You have {travelStats.remainingPlans} plans remaining
                      </span>
                    )}
                  </p>
                </div>
                <div className="text-sm text-stone-500">
                  Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1} - {Math.min(currentPage * ITEMS_PER_PAGE, filteredPlans.length)} of {filteredPlans.length} plans
                </div>
              </div>
              <PlanFilters
                currentFilter={filter}
                onFilterChange={handleFilterChange}
                counts={counts}
              />
            </div>
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8" id="plans-grid-section">
        {loading && plans.length === 0 ? (
          <div className="text-center py-20">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-orange-200 border-t-orange-600 mb-4"></div>
            <p className="text-stone-600 font-medium">Loading travel plans...</p>
          </div>
        ) : filteredPlans.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border-2 border-dashed border-stone-300">
            <div className="max-w-md mx-auto">
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-orange-100 to-amber-100 flex items-center justify-center">
                <Plane className="h-10 w-10 text-orange-500" />
              </div>
              <h3 className="text-2xl font-bold text-stone-900 mb-3">
                {filter === 'MyPlans' ? 'No Personal Plans Yet' : 'No Plans Found'}
              </h3>
              <p className="text-stone-600 mb-6">
                {filter === 'MyPlans'
                  ? 'Start by creating your first travel plan to share with the community!'
                  : 'Try adjusting your filters or check back later for new travel plans.'}
              </p>
              {filter === 'MyPlans' && (
                <Button
                  variant={'gradient'}
                  onClick={handleCreateClick}
                  size="lg"
                  className="shadow-lg shadow-orange-200"
                >
                  <Plus className="w-5 h-5 mr-2" /> Create Your First Plan
                </Button>
              )}

            </div>
          </div>
        ) : (
          <>
            {/* Results Summary */}
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-stone-800">
                  {filter === 'MyPlans' ? 'Your Travel Plans' :
                    filter === 'all' ? 'All Community Plans' :
                      `${filter.charAt(0).toUpperCase() + filter.slice(1)} Trips`}
                </h3>
                <p className="text-sm text-stone-500">
                  {filter === 'MyPlans'
                    ? `Manage and edit your personal travel plans (${userPlans.length} total)`
                    : `Discover travel plans from adventurers around the world`}
                </p>
              </div>
              <div className="text-sm text-stone-500">
                Page {currentPage} of {totalPages} • Showing {paginatedPlans.length} of {filteredPlans.length} plans
              </div>
            </div>

            {/* Plans Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
              {paginatedPlans.map((plan, index) => {
                const sUserId = session?.user?.id ? String(session.user.id) : null;
                const pUserId = plan.userId ? String(plan.userId) : (plan.user?.id ? String(plan.user.id) : null);
                const isOwner = sUserId && pUserId && sUserId === pUserId;

                return (
                  <motion.div
                    key={plan.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <TravelPlanCard
                      plan={plan}
                      isOwner={!!isOwner}
                      onEdit={(p) => { setEditingPlan(p); setIsFormOpen(true); }}
                      onDelete={setDeletingPlan}
                    />
                  </motion.div>
                )
              })}
            </div>

            {/* Pagination Controls - Only show if more than one page */}
            {totalPages > 1 && (
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-8 border-t border-stone-200">
                <div className="text-sm text-stone-500">
                  Showing <span className="font-semibold text-stone-700">{(currentPage - 1) * ITEMS_PER_PAGE + 1}-{Math.min(currentPage * ITEMS_PER_PAGE, filteredPlans.length)}</span> of <span className="font-semibold text-stone-700">{filteredPlans.length}</span> plans
                </div>

                <div className="flex items-center gap-2">
                  {/* Previous Button */}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="flex items-center gap-1 border-stone-300 hover:bg-stone-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronLeft className="h-4 w-4" />
                    <span className="hidden sm:inline">Previous</span>
                  </Button>

                  {/* Page Numbers */}
                  <div className="flex items-center gap-1">
                    {getPageNumbers().map((pageNumber, index) => (
                      pageNumber === '...' ? (
                        <span key={`ellipsis-${index}`} className="px-3 py-1 text-stone-400">
                          ...
                        </span>
                      ) : (
                        <Button
                          key={`page-${pageNumber}`}
                          variant={currentPage === pageNumber ? "default" : "outline"}
                          size="sm"
                          onClick={() => handlePageChange(pageNumber as number)}
                          className={`w-10 h-10 font-medium ${currentPage === pageNumber
                              ? 'bg-orange-600 hover:bg-orange-700 text-white border-orange-600'
                              : 'border-stone-300 hover:bg-stone-50 text-stone-700'
                            }`}
                        >
                          {pageNumber}
                        </Button>
                      )
                    ))}
                  </div>

                  {/* Next Button */}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="flex items-center gap-1 border-stone-300 hover:bg-stone-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <span className="hidden sm:inline">Next</span>
                    <RightIcon className="h-4 w-4" />
                  </Button>
                </div>

                {/* Page Selector */}
                <div className="flex items-center gap-2">
                  <span className="text-sm text-stone-500">Go to page:</span>
                  <div className="relative">
                    <select
                      value={currentPage}
                      onChange={(e) => handlePageChange(Number(e.target.value))}
                      className="pl-3 pr-8 py-1.5 text-sm border border-stone-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-100 focus:border-orange-400 bg-white appearance-none cursor-pointer"
                    >
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                        <option key={page} value={page}>
                          {page}
                        </option>
                      ))}
                    </select>
                    <ChevronRight className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-stone-400 pointer-events-none" />
                  </div>
                </div>
              </div>
            )}

            {/* Show message if no pagination but many plans */}
            {totalPages === 1 && filteredPlans.length > ITEMS_PER_PAGE && (
              <div className="text-center py-6 text-stone-500 text-sm border-t border-stone-200">
                Showing all {filteredPlans.length} plans on one page
              </div>
            )}
          </>
        )}
      </main>

      {/* Modals & Dialogs */}
      <Modal
        isOpen={isFormOpen}
        onClose={() => !isSubmitting && setIsFormOpen(false)}
        title={editingPlan ? 'Edit Travel Plan' : 'Create New Travel Plan'}
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