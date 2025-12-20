/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState } from "react";
import { 
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow 
} from "@/components/ui/table";
import { 
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter 
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Edit, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useMyTravelPlans } from "@/hooks/travelshooks/useMyTravelPlans";

const MyTravelPlanComponents = () => {
  const { userPlans, loading, deletePlan, updatePlan } = useMyTravelPlans();

  // State for Editing
  const [selectedPlan, setSelectedPlan] = useState<any>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const onEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPlan) return;

    try {
      // ✅ Pass ALL required fields to satisfy TravelPlanFormData
      await updatePlan(selectedPlan.id, {
        destination: selectedPlan.destination,
        budget: Number(selectedPlan.budget), // Ensure it's a number
        travelType: selectedPlan.travelType,
        startDate: selectedPlan.startDate,
        endDate: selectedPlan.endDate,
        description: selectedPlan.description || "",
      });
      
      toast.success("Plan updated successfully");
      setIsEditDialogOpen(false);
    } catch (error) {
      toast.error("Failed to update plan");
    }
  };

  if (loading) return <div className="p-10 text-center text-sm">Loading plans...</div>;

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-12">
      
      <section className="space-y-4">
        <h2 className="text-xl font-bold tracking-tight">My Travel Plans</h2>
        <div className="rounded-md border">
          <Table>
            <TableHeader className="bg-slate-50">
              <TableRow>
                <TableHead>Destination</TableHead>
                <TableHead>Travel Type</TableHead>
                <TableHead>Budget</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {userPlans.map((plan: any) => (
                <TableRow key={plan.id}>
                  <TableCell className="font-medium">{plan.destination}</TableCell>
                  <TableCell className="capitalize">{plan.travelType}</TableCell>
                  <TableCell>${plan.budget}</TableCell>
                  <TableCell><Badge variant="outline">{plan.status}</Badge></TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => {
                          setSelectedPlan(plan);
                          setIsEditDialogOpen(true);
                        }}
                      >
                        <Edit className="h-4 w-4 text-blue-600" />
                      </Button>

                      <Button variant="ghost" size="sm" onClick={() => deletePlan(plan.id)}>
                        <Trash2 className="h-4 w-4 text-red-600" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </section>

      {/* EDIT MODAL */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Travel Plan</DialogTitle>
          </DialogHeader>
          <form onSubmit={onEditSubmit} className="grid grid-cols-2 gap-4 py-4">
            <div className="col-span-2 space-y-2">
              <Label htmlFor="destination">Destination</Label>
              <Input 
                id="destination" 
                value={selectedPlan?.destination || ""} 
                onChange={(e) => setSelectedPlan({...selectedPlan, destination: e.target.value})}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="startDate">Start Date</Label>
              <Input 
                id="startDate" 
                type="date"
                // Extracting YYYY-MM-DD from ISO string for the input
                value={selectedPlan?.startDate ? new Date(selectedPlan.startDate).toISOString().split('T')[0] : ""} 
                onChange={(e) => setSelectedPlan({...selectedPlan, startDate: e.target.value})}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="endDate">End Date</Label>
              <Input 
                id="endDate" 
                type="date"
                value={selectedPlan?.endDate ? new Date(selectedPlan.endDate).toISOString().split('T')[0] : ""} 
                onChange={(e) => setSelectedPlan({...selectedPlan, endDate: e.target.value})}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="budget">Budget ($)</Label>
              <Input 
                id="budget" 
                type="number"
                value={selectedPlan?.budget || ""} 
                onChange={(e) => setSelectedPlan({...selectedPlan, budget: e.target.value})}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="type">Travel Type</Label>
              <Input 
                id="type" 
                value={selectedPlan?.travelType || ""} 
                onChange={(e) => setSelectedPlan({...selectedPlan, travelType: e.target.value})}
              />
            </div>

            <div className="col-span-2 flex justify-end gap-3 mt-4">
               <Button type="button" variant="gradient" onClick={() => setIsEditDialogOpen(false)}>Cancel</Button>
               <Button type="submit"  variant="gradient">Save Changes</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MyTravelPlanComponents;