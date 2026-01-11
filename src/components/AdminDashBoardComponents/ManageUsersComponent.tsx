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
  ShieldAlert, 
  UserCheck, 
  UserMinus, 
  Search,
  ShieldCheck,
  ShieldOff,
  Crown
} from "lucide-react";
import { toast } from "sonner";
import Image from "next/image";
import { getImageSrc } from "@/helpers/getImageSrc ";

// Helper function to identify super admin
const isSuperAdmin = (email: string) => {
  // Add your super admin email from .env here
  const superAdminEmail = process.env.NEXT_PUBLIC_SUPER_ADMIN_EMAIL || "admin@tripbuddy.com";
  return email?.toLowerCase() === superAdminEmail.toLowerCase();
};

export default function ManageUsersComponent() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get("/user?limit=100"); 
      const userData = res.data?.data || [];
      setUsers(userData);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load users");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleStatusChange = async (userId: string, currentStatus: string, userEmail: string) => {
    // Check if it's super admin
    if (isSuperAdmin(userEmail)) {
      toast.error("Cannot modify super admin status");
      return;
    }

    const newStatus = currentStatus === "ACTIVE" ? "BANNED" : "ACTIVE";
    try {
      await api.patch(`/user/${userId}`, { status: newStatus });
      toast.success(`User status updated to ${newStatus}`);
      fetchUsers();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Action failed");
    }
  };

  const handleRoleChange = async (userId: string, currentRole: string, userEmail: string) => {
    // Check if it's super admin
    if (isSuperAdmin(userEmail)) {
      toast.error("Cannot modify super admin role");
      return;
    }

    const newRole = currentRole === "USER" ? "ADMIN" : "USER";
    try {
      await api.patch(`/user/${userId}`, { role: newRole });
      toast.success(`User updated to ${newRole}`);
      fetchUsers();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Action failed");
    }
  };

  const filteredUsers = users.filter((user: any) =>
    user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">User Management</h1>
          <p className="text-slate-500">View, moderate, and manage system roles.</p>
          <div className="mt-2 flex items-center gap-2 text-sm text-slate-600">
            <Crown className="h-4 w-4 text-purple-500" />
            <span>Super admin is protected and cannot be modified</span>
          </div>
        </div>
        
        <div className="relative w-full md:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
          <Input 
            placeholder="Search by name or email..." 
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
              <TableHead>User</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Joined</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow><TableCell colSpan={5} className="text-center py-10">Loading users...</TableCell></TableRow>
            ) : filteredUsers.length === 0 ? (
              <TableRow><TableCell colSpan={5} className="text-center py-10">No users found.</TableCell></TableRow>
            ) : (
              filteredUsers.map((user: any) => {
                const superAdmin = isSuperAdmin(user.email);
                
                return (
                  <TableRow 
                    key={user.id} 
                    className={`hover:bg-slate-50/50 transition-colors ${
                      superAdmin ? "bg-purple-50/30" : ""
                    }`}
                  >
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="relative w-10 h-10 rounded-full overflow-hidden border bg-slate-100">
                          <Image 
                            src={getImageSrc(user.profileImage)} 
                            alt={user.name || "user"} 
                            fill 
                            className="object-cover" 
                          />
                        </div>
                        <div className="flex flex-col">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-slate-900">{user.name}</span>
                            {superAdmin && (
                              <Badge variant="default" className="bg-purple-100 text-purple-800 border-purple-200 text-xs">
                                <Crown className="h-3 w-3 mr-1" />
                                Super Admin
                              </Badge>
                            )}
                          </div>
                          <span className="text-xs text-slate-500">{user.email}</span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant={user.role === 'ADMIN' ? 'default' : 'secondary'}
                        className={superAdmin ? "bg-purple-100 text-purple-800 border-purple-200" : ""}
                      >
                        {user.role}
                        {superAdmin && " ⭐"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant="outline" 
                        className={user.status === 'ACTIVE' 
                          ? 'text-green-600 border-green-200 bg-green-50' 
                          : 'text-red-600 border-red-200 bg-red-50'
                        }
                      >
                        {user.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-slate-500 text-sm">
                      {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "N/A"}
                    </TableCell>
                    <TableCell className="text-right">
                      {superAdmin ? (
                        <div className="flex justify-end">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            disabled
                            className="text-slate-400 cursor-not-allowed flex items-center gap-1"
                          >
                            <ShieldOff className="h-4 w-4" />
                            <span>Protected</span>
                          </Button>
                        </div>
                      ) : (
                        <div className="flex justify-end">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-48">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem 
                                onClick={() => handleRoleChange(user.id, user.role, user.email)}
                                className={user.role === 'USER' ? "text-blue-600 cursor-pointer" : "text-orange-600 cursor-pointer"}
                              >
                                {user.role === 'USER' ? (
                                  <><ShieldCheck className="mr-2 h-4 w-4" /> Make Admin</>
                                ) : (
                                  <><UserMinus className="mr-2 h-4 w-4" /> Demote to User</>
                                )}
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                onClick={() => handleStatusChange(user.id, user.status, user.email)}
                                className={user.status === 'ACTIVE' ? "text-red-600 cursor-pointer" : "text-green-600 cursor-pointer"}
                              >
                                {user.status === 'ACTIVE' ? (
                                  <><ShieldAlert className="mr-2 h-4 w-4" /> Ban User</>
                                ) : (
                                  <><UserCheck className="mr-2 h-4 w-4" /> Activate User</>
                                )}
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}