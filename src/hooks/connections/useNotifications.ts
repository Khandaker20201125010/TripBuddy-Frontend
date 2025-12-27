import { useState, useEffect, useCallback } from 'react';
import api from '@/lib/axios';
import Swal from 'sweetalert2';

// Define types for BOTH connection and trip requests
export interface ConnectionRequest {
  id: string;
  status: string;
  sender: {
    id: string;
    name: string;
    profileImage: string;
    email?: string;
  };
  createdAt: string;
}

export interface TripRequest {
  id: string;
  status: string;
  user: {
    id: string;
    name: string;
    profileImage: string;
    email?: string;
  };
  travelPlan: {
    id: string;
    destination: string;
    startDate: string;
    endDate?: string;
  };
  createdAt: string;
}

export const useNotifications = () => {
  const [connectionRequests, setConnectionRequests] = useState<ConnectionRequest[]>([]);
  const [tripRequests, setTripRequests] = useState<TripRequest[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchNotifications = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      // Fetch Connection Requests
      const connResponse = await api.get('/connections/incoming');
      
      if (connResponse.data.success) {
        setConnectionRequests(connResponse.data.data || []);
      }

      // Fetch Trip Requests
      const tripResponse = await api.get('/travelPlan/my-plans');
      
      if (tripResponse.data.success && tripResponse.data.data) {
        const tripRequestsData: TripRequest[] = [];
        
        tripResponse.data.data.forEach((plan: any) => {
          if (plan.buddies && Array.isArray(plan.buddies)) {
            plan.buddies.forEach((buddy: any) => {
              if (buddy.status === "PENDING") {
                tripRequestsData.push({
                  id: buddy.id,
                  status: buddy.status,
                  user: {
                    id: buddy.user?.id || '',
                    name: buddy.user?.name || 'Unknown Traveler',
                    profileImage: buddy.user?.profileImage || '',
                    email: buddy.user?.email || ''
                  },
                  travelPlan: {
                    id: plan.id,
                    destination: plan.destination,
                    startDate: plan.startDate,
                    endDate: plan.endDate
                  },
                  createdAt: buddy.createdAt || new Date().toISOString()
                });
              }
            });
          }
        });
        
        setTripRequests(tripRequestsData);
      }

    } catch (error: any) {
      setError('Failed to fetch notifications');
      setConnectionRequests([]);
      setTripRequests([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  useEffect(() => {
    const intervalId = setInterval(fetchNotifications, 30000);
    return () => clearInterval(intervalId);
  }, [fetchNotifications]);

  // Handle Connection Request
  const handleConnectionAction = async (connectionId: string, status: 'ACCEPTED' | 'REJECTED') => {
    try {
      await api.patch(`/connections/respond/${connectionId}`, { status });
      
      setConnectionRequests(prev => prev.filter(req => req.id !== connectionId));
      
      Swal.fire({
        icon: 'success',
        title: status === 'ACCEPTED' ? 'Connection accepted!' : 'Request declined',
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000
      });
      
      setTimeout(() => fetchNotifications(), 1000);
    } catch (error: any) {
      Swal.fire('Error', 'Could not process connection request', 'error');
    }
  };

  // Handle Trip Request
  const handleTripAction = async (buddyId: string, status: 'APPROVED' | 'REJECTED') => {
    try {
      await api.patch(`/travelPlan/request-status/${buddyId}`, { status });
      
      setTripRequests(prev => prev.filter(req => req.id !== buddyId));
      
      Swal.fire({
        icon: 'success',
        title: `Request ${status.toLowerCase()} successfully`,
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000
      });
      
      setTimeout(() => fetchNotifications(), 1000);
    } catch (error: any) {
      Swal.fire('Error', 'Could not process trip request', 'error');
    }
  };

  const totalNotifications = connectionRequests.length + tripRequests.length;

  return {
    connectionRequests,
    tripRequests,
    loading,
    error,
    totalNotifications,
    handleConnectionAction,
    handleTripAction,
    refresh: fetchNotifications
  };
};