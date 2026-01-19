/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { useState, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Users, UserPlus, UserMinus, RefreshCw, UserCheck, UserX, MessageCircle, MapPin, Calendar } from 'lucide-react';
import { toast } from 'sonner';
import { connectionManager } from '@/hooks/connections/connectionManager';

interface Connection {
  id: string;
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED';
  senderId: string;
  receiverId: string;
  createdAt: string;
  updatedAt: string;
  sender: {
    id: string;
    name: string;
    profileImage: string | null;
    email: string;
  };
  receiver: {
    id: string;
    name: string;
    profileImage: string | null;
    email: string;
  };
}

const ConnectionSidebar = () => {
  const { data: session } = useSession();
  const [connections, setConnections] = useState<Connection[]>([]);
  const [incomingRequests, setIncomingRequests] = useState<Connection[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'connections' | 'requests'>('connections');

  // Fetch all connections
  const fetchConnections = useCallback(async () => {
    if (!session?.accessToken) return;
    
    try {
      setLoading(true);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/connections/all`,
        {
          headers: {
            'Authorization': `Bearer ${session.accessToken}`,
          },
        }
      );

      if (response.ok) {
        const result = await response.json();
        setConnections(result.data || []);
      }
    } catch (error) {
      console.error('Failed to fetch connections:', error);
      toast.error('Failed to load connections');
    } finally {
      setLoading(false);
    }
  }, [session?.accessToken]);

  // Fetch incoming requests
  const fetchIncomingRequests = useCallback(async () => {
    if (!session?.accessToken) return;
    
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/connections/incoming`,
        {
          headers: {
            'Authorization': `Bearer ${session.accessToken}`,
          },
        }
      );

      if (response.ok) {
        const result = await response.json();
        setIncomingRequests(result.data || []);
      }
    } catch (error) {
      console.error('Failed to fetch incoming requests:', error);
    }
  }, [session?.accessToken]);

  // Initial fetch
  useEffect(() => {
    if (session?.accessToken) {
      fetchConnections();
      fetchIncomingRequests();
    }
  }, [session?.accessToken, fetchConnections, fetchIncomingRequests]);

  // Subscribe to real-time connection updates
  useEffect(() => {
    if (!session?.user?.id) return;

    const unsubscribe = connectionManager.subscribe(
      session.user.id,
      (event :any) => {
        console.log('Connection update received:', event);
        // Refresh connections when updates occur
        fetchConnections();
        fetchIncomingRequests();
      }
    );

    return () => unsubscribe();
  }, [session?.user?.id, fetchConnections, fetchIncomingRequests]);

  // Handle connection response (accept/reject)
  const handleRespond = async (connectionId: string, status: 'ACCEPTED' | 'REJECTED') => {
    if (!session?.accessToken) return;

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/connections/respond/${connectionId}`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${session.accessToken}`,
          },
          body: JSON.stringify({ status }),
        }
      );

      if (response.ok) {
        toast.success(`Request ${status.toLowerCase()} successfully`);
        fetchConnections();
        fetchIncomingRequests();
      }
    } catch (error) {
      console.error('Failed to respond to request:', error);
      toast.error('Failed to process request');
    }
  };

  // Handle connection removal
  const handleRemoveConnection = async (connectionId: string) => {
    if (!session?.accessToken) return;

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/connections/${connectionId}`,
        {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${session.accessToken}`,
          },
        }
      );

      if (response.ok) {
        toast.success('Connection removed successfully');
        fetchConnections();
      }
    } catch (error) {
      console.error('Failed to remove connection:', error);
      toast.error('Failed to remove connection');
    }
  };

  // Filter accepted connections (buddies)
  const buddies = connections.filter(conn => 
    conn.status === 'ACCEPTED' && 
    (conn.senderId === session?.user?.id || conn.receiverId === session?.user?.id)
  );

  // Get the other user in the connection
  const getOtherUser = (connection: Connection) => {
    if (connection.senderId === session?.user?.id) {
      return connection.receiver;
    }
    return connection.sender;
  };

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffInDays === 0) return 'Today';
    if (diffInDays === 1) return 'Yesterday';
    if (diffInDays < 7) return `${diffInDays} days ago`;
    if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} weeks ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  if (loading) {
    return (
      <div className="h-full bg-gradient-to-b from-white to-stone-50 border-r border-stone-200 overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <Skeleton className="h-8 w-40 rounded-full" />
            <Skeleton className="h-10 w-10 rounded-full" />
          </div>
          
          {/* Tabs Skeleton */}
          <div className="flex space-x-3 mb-6">
            <Skeleton className="h-10 flex-1 rounded-lg" />
            <Skeleton className="h-10 flex-1 rounded-lg" />
          </div>
          
          {/* Stats Skeleton */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <Skeleton className="h-20 rounded-xl" />
            <Skeleton className="h-20 rounded-xl" />
          </div>
          
          {/* Connections List Skeleton */}
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center space-x-3 p-4 border border-stone-200 rounded-xl bg-white">
                <Skeleton className="h-12 w-12 rounded-full" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-32 rounded" />
                  <Skeleton className="h-3 w-24 rounded" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full bg-gradient-to-b from-white to-stone-50 border-r border-stone-200 overflow-y-auto">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gradient-to-br from-orange-500/10 to-pink-500/10 rounded-lg">
              <Users className="h-5 w-5 text-orange-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-stone-900">Travel Buddies</h2>
              <p className="text-sm text-stone-500">Connect & Share</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              fetchConnections();
              fetchIncomingRequests();
            }}
            className="rounded-full hover:bg-stone-100"
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100/50 border border-blue-200 rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-blue-700">{buddies.length}</p>
                <p className="text-sm text-blue-600">Connected</p>
              </div>
              <div className="p-2 bg-white/50 rounded-lg">
                <UserCheck className="h-5 w-5 text-blue-600" />
              </div>
            </div>
          </div>
          <div className="bg-gradient-to-br from-amber-50 to-amber-100/50 border border-amber-200 rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-amber-700">{incomingRequests.length}</p>
                <p className="text-sm text-amber-600">Pending</p>
              </div>
              <div className="p-2 bg-white/50 rounded-lg">
                <UserPlus className="h-5 w-5 text-amber-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex space-x-2 mb-4">
          <Button
            variant={activeTab === 'connections' ? 'gradient' : 'outline'}
            size="sm"
            onClick={() => setActiveTab('connections')}
            className="flex-1 rounded-full"
          >
            Buddies ({buddies.length})
          </Button>
          <Button
            variant={activeTab === 'requests' ? 'gradient' : 'outline'}
            size="sm"
            onClick={() => setActiveTab('requests')}
            className="flex-1 rounded-full"
          >
            Requests ({incomingRequests.length})
          </Button>
        </div>

        {/* Content */}
        <div className="space-y-3">
          {activeTab === 'connections' ? (
            <>
              {buddies.length === 0 ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-stone-100 to-stone-200 flex items-center justify-center">
                    <UserPlus className="h-8 w-8 text-stone-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-stone-900 mb-2">
                    No connections yet
                  </h3>
                  <p className="text-sm text-stone-600">
                    Start connecting with other travelers
                  </p>
                </div>
              ) : (
                buddies.map((connection) => {
                  const otherUser = getOtherUser(connection);
                  return (
                    <div
                      key={connection.id}
                      className="group p-4 border border-stone-200 rounded-xl bg-white hover:border-orange-300 hover:shadow-lg transition-all duration-200"
                    >
                      <div className="flex items-start space-x-3">
                        <Avatar className="h-12 w-12 ring-2 ring-white shadow-sm">
                          <AvatarImage src={otherUser.profileImage || ''} alt={otherUser.name} />
                          <AvatarFallback className="bg-gradient-to-br from-orange-100 to-pink-100 text-orange-700">
                            {otherUser.name.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <p className="text-sm font-semibold text-stone-900 truncate">
                              {otherUser.name}
                            </p>
                            <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200">
                              Connected
                            </Badge>
                          </div>
                          <p className="text-xs text-stone-500 truncate mb-2">
                            {otherUser.email}
                          </p>
                          <div className="flex items-center text-xs text-stone-400">
                            <Calendar className="h-3 w-3 mr-1" />
                            <span>Connected {formatDate(connection.createdAt)}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex space-x-2 mt-3 pt-3 border-t border-stone-100">
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1 text-xs rounded-full border-stone-200 hover:border-orange-300 hover:bg-orange-50"
                        >
                          <MessageCircle className="h-3 w-3 mr-1" />
                          Message
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveConnection(connection.id)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50 rounded-full"
                          title="Remove connection"
                        >
                          <UserMinus className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  );
                })
              )}
            </>
          ) : (
            <>
              {incomingRequests.length === 0 ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-stone-100 to-stone-200 flex items-center justify-center">
                    <UserCheck className="h-8 w-8 text-stone-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-stone-900 mb-2">
                    No pending requests
                  </h3>
                  <p className="text-sm text-stone-600">
                    You're all caught up!
                  </p>
                </div>
              ) : (
                incomingRequests.map((request) => {
                  const sender = request.sender;
                  return (
                    <div
                      key={request.id}
                      className="p-4 border border-stone-200 rounded-xl bg-white hover:border-blue-300 hover:shadow-lg transition-all duration-200"
                    >
                      <div className="flex items-start space-x-3 mb-4">
                        <Avatar className="h-12 w-12 ring-2 ring-white shadow-sm">
                          <AvatarImage src={sender.profileImage || ''} alt={sender.name} />
                          <AvatarFallback className="bg-gradient-to-br from-blue-100 to-cyan-100 text-blue-700">
                            {sender.name.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <p className="text-sm font-semibold text-stone-900">
                            {sender.name}
                          </p>
                          <p className="text-xs text-stone-500 mb-2">
                            {sender.email}
                          </p>
                          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 text-xs">
                            <UserPlus className="h-3 w-3 mr-1" />
                            Wants to connect
                          </Badge>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white rounded-full"
                          onClick={() => handleRespond(request.id, 'ACCEPTED')}
                        >
                          <UserCheck className="h-3 w-3 mr-1" />
                          Accept
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1 text-red-600 border-red-200 hover:bg-red-50 rounded-full"
                          onClick={() => handleRespond(request.id, 'REJECTED')}
                        >
                          <UserX className="h-3 w-3 mr-1" />
                          Decline
                        </Button>
                      </div>
                    </div>
                  );
                })
              )}
            </>
          )}
        </div>

        {/* Footer Stats */}
        {buddies.length > 0 && (
          <div className="mt-6 pt-4 border-t border-stone-200">
            <div className="text-center">
              <p className="text-xs text-stone-500">
                You have <span className="font-semibold text-orange-600">{buddies.length}</span> travel buddies
              </p>
              <p className="text-xs text-stone-400 mt-1">
                Share your journeys with them!
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ConnectionSidebar;