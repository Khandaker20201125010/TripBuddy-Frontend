/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { useState, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  Users, 
  UserPlus, 
  UserMinus, 
  RefreshCw, 
  UserCheck, 
  UserX, 
  MessageCircle, 
  Calendar,
  ChevronRight,
  Bell,
  Search
} from 'lucide-react';
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

interface ConnectionSidebarProps {
  onMobileAction?: () => void;
}

const ConnectionSidebar = ({ onMobileAction }: ConnectionSidebarProps) => {
  const { data: session } = useSession();
  const [connections, setConnections] = useState<Connection[]>([]);
  const [incomingRequests, setIncomingRequests] = useState<Connection[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'connections' | 'requests'>('connections');
  const [searchQuery, setSearchQuery] = useState('');

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
        // Trigger mobile action callback if provided
        onMobileAction?.();
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
        onMobileAction?.();
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

  // Filter buddies based on search query
  const filteredBuddies = buddies.filter(buddy => {
    const otherUser = buddy.senderId === session?.user?.id ? buddy.receiver : buddy.sender;
    return otherUser.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
           otherUser.email.toLowerCase().includes(searchQuery.toLowerCase());
  });

  // Filter requests based on search query
  const filteredRequests = incomingRequests.filter(request => {
    const sender = request.sender;
    return sender.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
           sender.email.toLowerCase().includes(searchQuery.toLowerCase());
  });

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
      <div className="h-full bg-gradient-to-b from-white to-stone-50 overflow-y-auto">
        <div className="p-4 lg:p-6">
          {/* Search Skeleton */}
          <Skeleton className="h-10 w-full rounded-xl mb-6" />
          
          {/* Stats Skeleton */}
          <div className="grid grid-cols-2 gap-3 lg:gap-4 mb-6">
            <Skeleton className="h-20 rounded-xl" />
            <Skeleton className="h-20 rounded-xl" />
          </div>
          
          {/* Tabs Skeleton */}
          <div className="flex space-x-2 mb-4">
            <Skeleton className="h-10 flex-1 rounded-full" />
            <Skeleton className="h-10 flex-1 rounded-full" />
          </div>
          
          {/* Connections List Skeleton */}
          <div className="space-y-3 lg:space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center space-x-3 p-3 lg:p-4 border border-stone-200 rounded-xl bg-white">
                <Skeleton className="h-10 w-10 lg:h-12 lg:w-12 rounded-full" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-3 lg:h-4 w-24 lg:w-32 rounded" />
                  <Skeleton className="h-2 lg:h-3 w-16 lg:w-24 rounded" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full bg-gradient-to-b from-white to-stone-50 overflow-y-auto">
      <div className="p-4 lg:p-6">
        {/* Desktop Header */}
        <div className="hidden lg:flex items-center justify-between mb-6">
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

        {/* Search Bar */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-stone-400" />
          <input
            type="text"
            placeholder="Search connections..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-300 text-sm placeholder:text-stone-400"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-stone-400 hover:text-stone-600"
            >
              ×
            </button>
          )}
        </div>

        {/* Stats Cards */}
     <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-6">
  {/* Connected */}
  <div className="bg-gradient-to-br from-blue-50 to-blue-100/60 border border-blue-200 rounded-2xl p-3 sm:p-4">
    <div className="flex items-center justify-between gap-3">
      <div className="min-w-0">
        <p className="text-lg sm:text-xl lg:text-2xl font-bold text-blue-700 leading-tight">
          {buddies.length}
        </p>
        <p className="text-[11px] sm:text-xs lg:text-sm text-blue-600 truncate">
          Connected
        </p>
      </div>

      <div className="shrink-0 p-2 sm:p-2.5 bg-white/70 backdrop-blur rounded-xl">
        <UserCheck className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
      </div>
    </div>
  </div>

  {/* Pending */}
  <div className="bg-gradient-to-br from-amber-50 to-amber-100/60 border border-amber-200 rounded-2xl p-3 sm:p-4">
    <div className="flex items-center justify-between gap-3">
      <div className="min-w-0">
        <p className="text-lg sm:text-xl lg:text-2xl font-bold text-amber-700 leading-tight">
          {incomingRequests.length}
        </p>
        <p className="text-[11px] sm:text-xs lg:text-sm text-amber-600 truncate">
          Pending
        </p>
      </div>

      <div className="relative shrink-0 p-2 sm:p-2.5 bg-white/70 backdrop-blur rounded-xl">
        <Bell className="h-4 w-4 sm:h-5 sm:w-5 text-amber-600" />

        {/* Notification dot */}
        {incomingRequests.length > 0 && (
          <span className="absolute -top-1 -right-1 h-2 w-2 bg-red-500 rounded-full" />
        )}
      </div>
    </div>

    {incomingRequests.length > 0 && (
      <div className="mt-2">
        <span className="inline-block text-[11px] sm:text-xs text-amber-700 font-medium bg-amber-200/40 px-2 py-0.5 rounded-full">
          {incomingRequests.length} new request
          {incomingRequests.length > 1 ? "s" : ""}
        </span>
      </div>
    )}
  </div>
</div>


        {/* Tabs */}
        <div className="flex space-x-2 mb-4">
          <button
            onClick={() => setActiveTab('connections')}
            className={`flex-1 py-2.5 text-sm font-medium rounded-xl transition-all duration-200 ${
              activeTab === 'connections'
                ? 'bg-gradient-to-r from-orange-500 to-pink-500 text-white shadow-md'
                : 'bg-white border border-stone-200 text-stone-600 hover:border-stone-300'
            }`}
          >
            Buddies ({buddies.length})
          </button>
          <button
            onClick={() => setActiveTab('requests')}
            className={`flex-1 py-2.5 text-sm font-medium rounded-xl transition-all duration-200 relative ${
              activeTab === 'requests'
                ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-md'
                : 'bg-white border border-stone-200 text-stone-600 hover:border-stone-300'
            }`}
          >
            Requests ({incomingRequests.length})
            {incomingRequests.length > 0 && (
              <span className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                {incomingRequests.length}
              </span>
            )}
          </button>
        </div>

        {/* Content */}
        <div className="space-y-3 lg:space-y-4">
          {activeTab === 'connections' ? (
            <>
              {filteredBuddies.length === 0 ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-stone-100 to-stone-200 flex items-center justify-center">
                    <UserPlus className="h-8 w-8 text-stone-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-stone-900 mb-2">
                    {searchQuery ? 'No matches found' : 'No connections yet'}
                  </h3>
                  <p className="text-sm text-stone-600 mb-4">
                    {searchQuery ? 'Try a different search term' : 'Start connecting with other travelers'}
                  </p>
                  <Button
                    variant="outline"
                    className="rounded-full"
                    onClick={() => {
                      window.location.href = '/find-travel-buddy';
                      onMobileAction?.();
                    }}
                  >
                    <UserPlus className="h-4 w-4 mr-2" />
                    Find Travel Buddies
                  </Button>
                </div>
              ) : (
                filteredBuddies.map((connection) => {
                  const otherUser = getOtherUser(connection);
                  return (
                    <div
                      key={connection.id}
                      className="group p-3 lg:p-4 border border-stone-200 rounded-xl bg-white hover:border-orange-300 hover:shadow-lg transition-all duration-200"
                    >
                      <div className="flex items-start space-x-3">
                        <Avatar className="h-10 w-10 lg:h-12 lg:w-12 ring-2 ring-white shadow-sm">
                          <AvatarImage src={otherUser.profileImage || ''} alt={otherUser.name} />
                          <AvatarFallback className="bg-gradient-to-br from-orange-100 to-pink-100 text-orange-700 text-sm">
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
                          onClick={() => {
                            // Handle message action
                            onMobileAction?.();
                          }}
                        >
                          <MessageCircle className="h-3 w-3 mr-1" />
                          Message
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveConnection(connection.id)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50 rounded-full"
                        >
                          <UserMinus className="h-3 w-3" />
                          <span className="ml-1">Remove</span>
                        </Button>
                      </div>
                    </div>
                  );
                })
              )}
            </>
          ) : (
            <>
              {filteredRequests.length === 0 ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-stone-100 to-stone-200 flex items-center justify-center">
                    <Bell className="h-8 w-8 text-stone-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-stone-900 mb-2">
                    {searchQuery ? 'No matches found' : 'No pending requests'}
                  </h3>
                  <p className="text-sm text-stone-600">
                    You're all caught up!
                  </p>
                </div>
              ) : (
                filteredRequests.map((request) => {
                  const sender = request.sender;
                  return (
                    <div
                      key={request.id}
                      className="p-3 lg:p-4 border border-stone-200 rounded-xl bg-white hover:border-blue-300 hover:shadow-lg transition-all duration-200"
                    >
                      <div className="flex items-start space-x-3 mb-4">
                        <Avatar className="h-10 w-10 lg:h-12 lg:w-12 ring-2 ring-white shadow-sm">
                          <AvatarImage src={sender.profileImage || ''} alt={sender.name} />
                          <AvatarFallback className="bg-gradient-to-br from-blue-100 to-cyan-100 text-blue-700 text-sm">
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

        {/* Footer */}
        <div className="mt-6 pt-4 border-t border-stone-200">
          <div className="text-center ">
            <p className="text-sm text-stone-600">
              You have <span className="font-semibold text-orange-600">{buddies.length}</span> travel buddies
            </p>
            <p className="text-xs text-stone-400 mt-1">
              Share your journeys with them!
            </p>
          </div>
          
          {/* Find More Buddies Button */}
          <Button
            variant="outline"
            className="w-full mt-4 rounded-xl"
            onClick={() => {
              window.location.href = '/find-travel-buddy';
              onMobileAction?.();
            }}
          >
            <UserPlus className="h-4 w-4 mr-2" />
            Find More Buddies
            <ChevronRight className="h-4 w-4 ml-auto" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ConnectionSidebar;