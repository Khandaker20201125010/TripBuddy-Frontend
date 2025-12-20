/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import  { useEffect, useState } from 'react';
import Image from "next/image";
import Link from "next/link";
import {
    ShieldCheck, Users, Map, Settings,
    Activity, Mail, Calendar, UserX
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import api from '@/lib/axios';
import EditAdminModal from "./EditAdminModal"; // Ensure path is correct

const AdminProfile = ({ profile, onUpdate }: { profile: any; onUpdate: () => void }) => {
    const [stats, setStats] = useState({
        totalUsers: 0,
        totalTravelPlans: 0,
        bannedUsers: 0
    });

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await api.get("/user/admin/stats");
                setStats(res.data.data);
            } catch (err) {
                console.error("Failed to load admin stats");
            }
        };
        fetchStats();
    }, []);

    const adminStats = [
        {
            label: "Total Users",
            value: stats.totalUsers,
            icon: <Users className="text-blue-500" />,
            link: "/dashboard/manage-users",
            color: "border-l-blue-500"
        },
        {
            label: "Active Plans",
            value: stats.totalTravelPlans,
            icon: <Map className="text-green-500" />,
            link: "/dashboard/manage-plans",
            color: "border-l-green-500"
        },
        {
            label: "Banned Users",
            value: stats.bannedUsers,
            icon: <UserX className="text-red-500" />,
            link: "/dashboard/manage-users?filter=banned",
            color: "border-l-red-500"
        },
    ];

    return (
        <div className="max-w-6xl mx-auto p-6 space-y-8 animate-in fade-in duration-500">
            {/* --- Admin Header Section --- */}
            <div className="gradient-sunset rounded-3xl p-8 shadow-2xl text-white relative overflow-hidden border border-amber-600">
                <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600 opacity-5 rounded-full -mr-32 -mt-32 blur-3xl" />

                <div className="relative flex flex-col md:flex-row items-center gap-8">
                    <div className="relative group">
                        <div className="w-32 h-32 rounded-full border-4 border-blue-500/30 overflow-hidden relative shadow-2xl">
                            <Image
                                src={profile?.profileImage || "/placeholder-user.png"}
                                alt={profile?.name || "Admin Profile"}
                                fill
                                priority // Tells Next.js to preload this image
                                loading="eager" // Ensures it doesn't lazy-load
                                sizes="128px" // Matches the w-32 (128px) width
                                className="object-cover group-hover:scale-110 transition-transform duration-500"
                            />
                        </div>
                        <div className="absolute -bottom-2 -right-2 bg-blue-600 p-2 rounded-full border-4 border-slate-900 shadow-lg">
                            <ShieldCheck size={20} className="text-white" />
                        </div>
                    </div>

                    <div className="flex-1 text-center md:text-left space-y-3">
                        <div className="flex flex-wrap justify-center md:justify-start items-center gap-3">
                            <h1 className="text-4xl font-extrabold tracking-tight text-white">{profile?.name}</h1>
                            <Badge className="bg-amber-500 hover:bg-amber-400 px-3 py-1 text-xs font-bold uppercase tracking-widest shadow-lg shadow-blue-500/20">
                                System Administrator
                            </Badge>
                        </div>

                        <div className="flex flex-wrap justify-center md:justify-start items-center gap-6 text-slate-200">
                            <span className="flex items-center gap-2 text-sm"><Mail size={16} className="text-orange-800" /> {profile?.email}</span>
                            <span className="flex items-center gap-2 text-sm"><Calendar size={16} className="text-orange-800" /> Since {new Date(profile?.createdAt).toLocaleDateString(undefined, { month: 'long', year: 'numeric' })}</span>
                        </div>
                    </div>

                    <div className="flex gap-4">
                        {/* Modal replacing the old Link */}
                        <EditAdminModal profile={profile} onUpdate={onUpdate} />
                    </div>
                </div>
            </div>

            {/* --- KPI Cards --- */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {adminStats.map((stat, idx) => (
                    <Link href={stat.link} key={idx}>
                        <Card className={`hover:shadow-xl transition-all border-l-4 ${stat.color} cursor-pointer group active:scale-95 bg-white`}>
                            <CardContent className="p-6 flex items-center justify-between">
                                <div className="space-y-1">
                                    <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider">{stat.label}</p>
                                    <h3 className="text-3xl font-black text-slate-800">{stat.value.toLocaleString()}</h3>
                                </div>
                                <div className="p-4 bg-slate-50 rounded-2xl group-hover:bg-slate-100 transition-colors">
                                    {stat.icon}
                                </div>
                            </CardContent>
                        </Card>
                    </Link>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <Card className="shadow-sm border-slate-200 bg-white">
                    <CardHeader className="border-b bg-slate-50/50">
                        <CardTitle className="text-lg flex items-center gap-2">
                            <Settings className="w-5 h-5 text-slate-600" /> Administrative Controls
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-6">
                        <Link href="/dashboard/manage-users">
                            <Button variant="outline" className="w-full justify-start gap-3 h-14 hover:border-blue-500 hover:bg-blue-50 transition-all">
                                <Users size={18} className="text-blue-500" />
                                <div className="text-left">
                                    <p className="text-sm font-bold">Manage Users</p>
                                    <p className="text-[10px] text-slate-500 uppercase">Ban, Edit, Verify</p>
                                </div>
                            </Button>
                        </Link>
                        <Link href="/dashboard/manage-plans">
                            <Button variant="outline" className="w-full justify-start gap-3 h-14 hover:border-green-500 hover:bg-green-50 transition-all">
                                <Map size={18} className="text-green-500" />
                                <div className="text-left">
                                    <p className="text-sm font-bold">Moderate Trips</p>
                                    <p className="text-[10px] text-slate-500 uppercase">Review content</p>
                                </div>
                            </Button>
                        </Link>
                    </CardContent>
                </Card>

                <Card className="shadow-sm border-slate-200 bg-white">
                    <CardHeader className="border-b bg-slate-50/50">
                        <CardTitle className="text-lg flex items-center gap-2">
                            <Activity className="w-5 h-5 text-blue-500" /> Recent System Logs
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                        <div className="divide-y divide-slate-100">
                            {[
                                { msg: "New Admin Created", time: "10m ago", type: "success" },
                                { msg: "User reported for spam", time: "2h ago", type: "warning" },
                                { msg: "DB Backup successful", time: "5h ago", type: "info" }
                            ].map((log, i) => (
                                <div key={i} className="flex items-center gap-4 p-4 hover:bg-slate-50 transition-colors">
                                    <div className={`w-2 h-2 rounded-full ${log.type === 'success' ? 'bg-green-500' : 'bg-blue-500'}`} />
                                    <span className="text-sm font-medium text-slate-700 flex-1">{log.msg}</span>
                                    <span className="text-xs text-slate-400 font-mono italic">{log.time}</span>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default AdminProfile;