/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import api from "@/lib/axios";
import { UserProfile, Connection } from "../helpers/types";

export const useProfileData = () => {
  const { data: session, status } = useSession();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [connections, setConnections] = useState<Connection[]>([]);
  const [incomingRequests, setIncomingRequests] = useState<Connection[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingConnections, setLoadingConnections] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProfile = useCallback(async () => {
    if (!session?.user?.id) {
      setError("User not authenticated");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const res = await api.get(`/user/${session.user.id}`);

      if (res.data.success && res.data.data) {
        setProfile(res.data.data);
      } else {
        setError("Failed to load profile data");
      }
    } catch (error: any) {
      console.error("Failed to fetch profile", error);
      setError(error.response?.data?.message || "Failed to load profile");
    } finally {
      setLoading(false);
    }
  }, [session]);

  const fetchConnections = useCallback(async () => {
    if (!session?.user?.id) return;

    try {
      setLoadingConnections(true);
      const [buddiesRes, requestsRes] = await Promise.all([
        api.get('/connections/buddies'),
        api.get('/connections/incoming')
      ]);

      if (buddiesRes.data.success) {
        const buddies = buddiesRes.data.data.map((buddy: any) => {
          const isSender = buddy.sender.id === session.user.id;
          const otherUser = isSender ? buddy.receiver : buddy.sender;

          return {
            id: buddy.id,
            status: 'ACCEPTED' as const,
            senderId: buddy.sender.id,
            receiverId: buddy.receiver.id,
            createdAt: buddy.createdAt,
            updatedAt: buddy.updatedAt,
            sender: buddy.sender,
            receiver: buddy.receiver,
            otherUser: otherUser,
            direction: isSender ? 'sent' : 'received'
          };
        });

        setConnections(buddies);
      }

      if (requestsRes.data.success) {
        setIncomingRequests(requestsRes.data.data.map((req: any) => ({
          ...req,
          status: 'PENDING' as const,
          direction: 'received'
        })));
      }
    } catch (error: any) {
      console.error("Failed to fetch connections", error);
    } finally {
      setLoadingConnections(false);
    }
  }, [session]);

  const handleRespondToRequest = async (connectionId: string, status: 'ACCEPTED' | 'REJECTED') => {
    try {
      await api.patch(`/connections/respond/${connectionId}`, { status });

      if (status === 'ACCEPTED') {
        const request = incomingRequests.find(req => req.id === connectionId);
        if (request) {
          setIncomingRequests(prev => prev.filter(req => req.id !== connectionId));
          const newConnection = {
            ...request,
            status: 'ACCEPTED' as const
          };
          setConnections(prev => [...prev, newConnection]);
        }
      } else if (status === 'REJECTED') {
        setIncomingRequests(prev => prev.filter(req => req.id !== connectionId));
      }

      setTimeout(() => {
        fetchConnections();
      }, 500);
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Failed to update request");
    }
  };

  const handleDeleteConnection = async (connectionId: string) => {
    try {
      await api.delete(`/connections/${connectionId}`);
      setConnections(prev => prev.filter(conn => conn.id !== connectionId));
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Failed to delete connection");
    }
  };

  useEffect(() => {
    if (status === "authenticated") {
      fetchProfile();
      fetchConnections();
    } else if (status === "unauthenticated") {
      setLoading(false);
      setError("Please log in to view your profile");
    }
  }, [status, fetchProfile, fetchConnections]);

  return {
    profile,
    connections,
    incomingRequests,
    loading,
    loadingConnections,
    error,
    fetchProfile,
    fetchConnections,
    handleRespondToRequest,
    handleDeleteConnection,
    isAuthenticated: status === "authenticated"
  };
};