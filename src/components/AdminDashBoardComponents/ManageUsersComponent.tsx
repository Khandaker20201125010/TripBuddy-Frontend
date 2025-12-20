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
  ShieldCheck
} from "lucide-react";
import { toast } from "sonner";
import Image from "next/image";

export default function ManageUsersComponent() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      // Fetching with high limit to see all users
      const res = await api.get("/user?limit=100"); 
      
      // ✅ FIXED: Your controller returns { meta: {}, data: [] }
      // So we need res.data.data
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

  const handleStatusChange = async (userId: string, currentStatus: string) => {
    const newStatus = currentStatus === "ACTIVE" ? "BANNED" : "ACTIVE";
    try {
      // ✅ FIXED: Standard PATCH body
      await api.patch(`/user/${userId}`, { status: newStatus });
      toast.success(`User status updated to ${newStatus}`);
      fetchUsers();
    } catch (err) {
      toast.error("Action failed");
    }
  };

  const handleRoleChange = async (userId: string, currentRole: string) => {
    const newRole = currentRole === "USER" ? "ADMIN" : "USER";
    try {
      // ✅ FIXED: Standard PATCH body
      await api.patch(`/user/${userId}`, { role: newRole });
      toast.success(`User updated to ${newRole}`);
      fetchUsers();
    } catch (err) {
      toast.error("Action failed");
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
              filteredUsers.map((user: any) => (
                <TableRow key={user.id} className="hover:bg-slate-50/50 transition-colors">
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="relative w-10 h-10 rounded-full overflow-hidden border bg-slate-100">
                        <Image 
                          src={user.profileImage || "/placeholder-user.png"} 
                          alt={user.name || "user"} 
                          fill 
                          className="object-cover" 
                        />
                      </div>
                      <div className="flex flex-col">
                        <span className="font-semibold text-slate-900">{user.name}</span>
                        <span className="text-xs text-slate-500">{user.email}</span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={user.role === 'ADMIN' ? 'default' : 'secondary'}>
                      {user.role}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge 
                      variant="outline" 
                      className={user.status === 'ACTIVE' ? 'text-green-600 border-green-200 bg-green-50' : 'text-red-600 border-red-200 bg-red-50'}
                    >
                      {user.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-slate-500 text-sm">
                    {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "N/A"}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-48">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => handleRoleChange(user.id, user.role)}>
                          {user.role === 'USER' ? (
                            <><ShieldCheck className="mr-2 h-4 w-4 text-blue-500" /> Make Admin</>
                          ) : (
                            <><UserMinus className="mr-2 h-4 w-4 text-orange-500" /> Demote to User</>
                          )}
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => handleStatusChange(user.id, user.status)}
                          className={user.status === 'ACTIVE' ? "text-red-600" : "text-green-600"}
                        >
                          {user.status === 'ACTIVE' ? (
                            <><ShieldAlert className="mr-2 h-4 w-4" /> Ban User</>
                          ) : (
                            <><UserCheck className="mr-2 h-4 w-4" /> Activate User</>
                          )}
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