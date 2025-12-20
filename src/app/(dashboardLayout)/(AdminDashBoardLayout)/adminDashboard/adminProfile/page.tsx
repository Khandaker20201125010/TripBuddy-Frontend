"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState, useCallback } from "react";
import api from "@/lib/axios";
import AdminProfile from "@/components/AdminDashBoardComponents/AdminProfile";
import { Skeleton } from "@/components/ui/skeleton";

export default function AdminProfilePage() {
  const { data: session } = useSession();
  const [profile, setProfile] = useState(null);

  // Extract ID specifically to avoid session-object memoization conflicts
  const userId = session?.user?.id;

  const fetchMyProfile = useCallback(async () => {
    if (!userId) return;

    try {
      const res = await api.get(`/user/${userId}`);
      setProfile(res.data.data);
    } catch (err) {
      console.error("Error fetching profile", err);
    }
  }, [userId]); // Dependency is now a simple string, which React Compiler loves

  useEffect(() => {
  let isMounted = true;

  const loadData = async () => {
    const data = await fetchMyProfile();
    if (isMounted && data) setProfile(data);
  };

  loadData();
  return () => { isMounted = false; };
}, [fetchMyProfile]);

  if (!profile) return <ProfileSkeleton />;

  return <AdminProfile profile={profile} onUpdate={fetchMyProfile} />;
}

function ProfileSkeleton() {
  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      <Skeleton className="h-[250px] w-full rounded-3xl" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-32 w-full" />
      </div>
    </div>
  );
}