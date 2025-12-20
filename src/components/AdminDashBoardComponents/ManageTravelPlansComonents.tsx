/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect, useState, useCallback } from "react";
import api from "@/lib/axios";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  MoreHorizontal, 
  Trash2, 
  Eye, 
  EyeOff, 
  Search,
  MapPin,
  Calendar,
  DollarSign
} from "lucide-react";
import { toast } from "sonner";
import Image from "next/image";
import Swal from "sweetalert2";

export default function ManageTravelPlansComponents() {
  const [plans, setPlans] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchPlans = useCallback(async () => {
    setLoading(true);
    try {
      // Fetching all plans (Admin access)
      const res = await api.get("/travelPlan?limit=100"); 
      const planData = res.data?.data || [];
      setPlans(planData);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load travel plans");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPlans();
  }, [fetchPlans]);

  const toggleVisibility = async (id: string, currentVisibility: boolean) => {
    try {
      await api.patch(`/travelPlan/${id}`, { visibility: !currentVisibility });
      toast.success(`Trip is now ${!currentVisibility ? 'Public' : 'Private'}`);
      fetchPlans();
    } catch (err) {
      toast.error("Failed to update visibility");
    }
  };

  const handleDelete = async (id: string) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This trip will be permanently removed!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
        await api.delete(`/travelPlan/${id}`);
        toast.success("Travel plan deleted");
        fetchPlans();
      } catch (err) {
        toast.error("Delete failed");
      }
    }
  };

  const filteredPlans = plans.filter((plan: any) =>
    plan.destination.toLowerCase().includes(searchTerm.toLowerCase()) ||
    plan.user?.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Manage Travel Plans</h1>
          <p className="text-slate-500">Monitor and moderate all user travel itineraries.</p>
        </div>
        
        <div className="relative w-full md:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
          <Input 
            placeholder="Search by destination or host..." 
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="rounded-xl border bg-white shadow-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-slate-50">
            <TableRow>
              <TableHead>Destination & Host</TableHead>
              <TableHead>Dates</TableHead>
              <TableHead>Budget</TableHead>
              <TableHead>Visibility</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow><TableCell colSpan={5} className="text-center py-10">Loading plans...</TableCell></TableRow>
            ) : filteredPlans.length === 0 ? (
              <TableRow><TableCell colSpan={5} className="text-center py-10">No travel plans found.</TableCell></TableRow>
            ) : (
              filteredPlans.map((plan: any) => (
                <TableRow key={plan.id} className="hover:bg-slate-50/50 transition-colors">
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="relative w-12 h-12 rounded-lg overflow-hidden border bg-slate-100 flex-shrink-0">
                        <Image 
                          src={plan.image || "/placeholder-travel.png"} 
                          alt={plan.destination} 
                          fill 
                          className="object-cover" 
                        />
                      </div>
                      <div className="flex flex-col">
                        <span className="font-semibold text-slate-900 flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-amber-500" /> {plan.destination}
                        </span>
                        <span className="text-xs text-slate-500">Host: {plan.user?.name || "Deleted User"}</span>
                      </div>
                    </div>
                  </TableCell>
                  
                  <TableCell>
                    <div className="flex flex-col text-sm text-slate-600">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" /> {new Date(plan.startDate).toLocaleDateString()}
                      </span>
                      <span className="text-xs text-slate-400 pl-4">to {new Date(plan.endDate).toLocaleDateString()}</span>
                    </div>
                  </TableCell>

                  <TableCell>
                    <div className="flex items-center font-medium text-slate-700">
                      <DollarSign className="w-3 h-3 text-green-600" />
                      {plan.budget.toLocaleString()}
                    </div>
                  </TableCell>

                  <TableCell>
                    <Badge variant={plan.visibility ? "default" : "secondary"} className="gap-1">
                      {plan.visibility ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                      {plan.visibility ? "Public" : "Private"}
                    </Badge>
                  </TableCell>

                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-48">
                        <DropdownMenuLabel>Moderation</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => toggleVisibility(plan.id, plan.visibility)}>
                          {plan.visibility ? (
                            <><EyeOff className="mr-2 h-4 w-4 text-slate-500" /> Hide from Feed</>
                          ) : (
                            <><Eye className="mr-2 h-4 w-4 text-blue-500" /> Show on Feed</>
                          )}
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => handleDelete(plan.id)}
                          className="text-red-600 focus:text-red-600 focus:bg-red-50"
                        >
                          <Trash2 className="mr-2 h-4 w-4" /> Delete Plan
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}