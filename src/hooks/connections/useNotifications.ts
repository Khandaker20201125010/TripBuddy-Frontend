/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect, useCallback } from 'react';
import api from '@/lib/axios';
import Swal from 'sweetalert2';
import { connectionManager } from './connectionManager';


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
      console.log('Fetching notifications...');
      
      // Fetch Connection Requests
      const connResponse = await api.get('/connections/incoming');
      console.log('Connection response:', connResponse.data);
      
      if (connResponse.data.success) {
        const connections = connResponse.data.data || [];
        console.log('Found connection requests:', connections.length);
        setConnectionRequests(connections);
      }

      // Fetch Trip Requests
      const tripResponse = await api.get('/travelPlan/my-plans');
      console.log('Trip plans response:', tripResponse.data);
      
      if (tripResponse.data.success && tripResponse.data.data) {
        const tripRequestsData: TripRequest[] = [];
        
        tripResponse.data.data.forEach((plan: any) => {
          console.log('Plan:', plan.destination, 'has buddies:', plan.buddies?.length || 0);
          
          if (plan.buddies && Array.isArray(plan.buddies)) {
            plan.buddies.forEach((buddy: any) => {
              console.log('Buddy status:', buddy.status, 'ID:', buddy.id);
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
        
        console.log('Found trip requests:', tripRequestsData.length);
        setTripRequests(tripRequestsData);
      }

    } catch (error: any) {
      console.error('Error fetching notifications:', error);
      setError('Failed to fetch notifications: ' + (error.message || 'Unknown error'));
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
      console.log(`Processing connection ${status}:`, connectionId);
      
      const response = await api.patch(`/connections/respond/${connectionId}`, { status });
      console.log('Connection action response:', response.data);
      
      // Remove from local state
      setConnectionRequests(prev => prev.filter(req => req.id !== connectionId));
      
      // IMPORTANT: Notify connection manager for real-time updates
      const connection = response.data.data;
      if (connection) {
        // Notify the sender that their request was responded to
        connectionManager.notify(connection.senderId, {
          userId: connection.receiverId,
          status: status,
          direction: 'sent',
          connectionId: connection.id
        });
        
        // Also notify the receiver (current user)
        connectionManager.notify(connection.receiverId, {
          userId: connection.senderId,
          status: status,
          direction: 'received',
          connectionId: connection.id
        });
      }
      
      // Show success message
      Swal.fire({
        icon: 'success',
        title: status === 'ACCEPTED' ? 'Connection accepted!' : 'Request declined',
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000
      });
      
      // Refresh notifications after a delay
      setTimeout(() => fetchNotifications(), 1000);
      
    } catch (error: any) {
      console.error('Connection action error:', error);
      
      // Show specific error message
      const errorMessage = error.response?.data?.message || 
                          error.message || 
                          'Could not process connection request';
      
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: errorMessage,
        confirmButtonText: 'OK'
      });
    }
  };

  // Handle Trip Request
  const handleTripAction = async (buddyId: string, status: 'APPROVED' | 'REJECTED') => {
    try {
      console.log(`Processing trip ${status}:`, buddyId);
      
      const response = await api.patch(`/travelPlan/request-status/${buddyId}`, { status });
      console.log('Trip action response:', response.data);
      
      // Remove from local state
      setTripRequests(prev => prev.filter(req => req.id !== buddyId));
      
      // Show success message
      Swal.fire({
        icon: 'success',
        title: `Request ${status.toLowerCase()} successfully`,
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000
      });
      
      // Refresh notifications after a delay
      setTimeout(() => fetchNotifications(), 1000);
      
    } catch (error: any) {
      console.error('Trip action error:', error);
      
      // Show specific error message
      const errorMessage = error.response?.data?.message || 
                          error.message || 
                          'Could not process trip request';
      
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: errorMessage,
        confirmButtonText: 'OK'
      });
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