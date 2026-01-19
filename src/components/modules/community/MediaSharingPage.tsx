/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useState, useEffect, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PhotoUpload } from "./PhotoUpload";
import { PhotoCard } from "./PhotoCard";
import { PhotoDetailModal } from "./PhotoDetailModal";
import { useSession } from "next-auth/react";
import { mediaService } from "@/hooks/media/media";
import { Photo, UserPhotoGroup } from "@/types/commnunity";
import {
  Camera,
  Globe,
  Users,
  TrendingUp,
  Sparkles,
  RefreshCw
} from "lucide-react";
import { Toaster, toast } from "sonner";

export function MediaSharingPage() {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
  const [selectedGroupPhotos, setSelectedGroupPhotos] = useState<Photo[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const { data: session } = useSession();

  const [uploadSessions, setUploadSessions] = useState<Record<string, Photo[]>>({});
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const fetchMediaPosts = useCallback(async () => {
    try {
      setLoading(true);
      const response = await mediaService.getAllMediaPosts();

      if (!response.data || !Array.isArray(response.data)) {
        setPhotos([]);
        setUploadSessions({});
        return;
      }

      const posts = response.data;
      const sessions: Record<string, Photo[]> = {};
      const processedPosts: Photo[] = [];

      // First, process all posts
      posts.forEach((post: any) => {
        const photo: Photo = {
          id: post.id,
          userId: post.userId,
          caption: post.caption,
          imageUrl: post.imageUrl,
          location: post.location,
          tags: post.tags || [],
          likesCount: post.likesCount || 0,
          commentsCount: post.commentsCount || 0,
          sharesCount: post.sharesCount || 0,
          type: 'IMAGE',
          travelPlanId: post.travelPlanId,
          createdAt: post.createdAt,
          updatedAt: post.updatedAt,
          isLiked: post.isLiked || false,
          user: post.user || {
            id: post.userId,
            name: 'Unknown User',
            profileImage: null,
            email: ''
          },
          travelPlan: post.travelPlan,
          photographer: post.user?.name || 'Unknown User',
          photographerAvatar: post.user?.profileImage,
          aspectRatio: 'square',
          timestamp: new Date(post.createdAt).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          }),
          date: new Date(post.createdAt).toLocaleDateString('en-US', {
            month: 'short',
            year: 'numeric'
          }),
          tripName: post.travelPlan?.destination || 'Travel Adventure',
        };

        processedPosts.push(photo);
      });

      // Group photos by user and time window (5 minutes instead of 5 seconds)
      const groupedBySession: Record<string, Photo[]> = {};

      // Sort posts by creation time
      const sortedPosts = [...processedPosts].sort((a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );

      sortedPosts.forEach((photo, index) => {
        // Check if this photo belongs to an existing session
        let sessionFound = false;
        const photoTime = new Date(photo.createdAt).getTime();

        Object.keys(groupedBySession).forEach(sessionId => {
          const sessionPhotos = groupedBySession[sessionId];
          const firstPhoto = sessionPhotos[0];
          const firstPhotoTime = new Date(firstPhoto.createdAt).getTime();

          // Group photos from same user within 5 minutes (300,000 ms)
          if (photo.userId === firstPhoto.userId &&
            Math.abs(photoTime - firstPhotoTime) <= 1 * 60 * 1000) {
            sessionPhotos.push(photo);
            sessionFound = true;
          }
        });

        if (!sessionFound) {
          // Create new session with user ID and timestamp
          const sessionId = `session-${photo.userId}-${photoTime}`;
          groupedBySession[sessionId] = [photo];
        }
      });

      setPhotos(processedPosts);
      setUploadSessions(groupedBySession);

    } catch (error) {
      toast.error("Failed to load media posts");
      setPhotos([]);
      setUploadSessions({});
    } finally {
      setLoading(false);
    }
  }, [refreshTrigger, session?.user?.id]);

  useEffect(() => {
    fetchMediaPosts();
  }, [fetchMediaPosts]);

  const groupedPhotos = useMemo(() => {
    const groups: UserPhotoGroup[] = [];

    Object.keys(uploadSessions).forEach((sessionId) => {
      const sessionPhotos = uploadSessions[sessionId];
      if (sessionPhotos.length === 0) return;

      const latestPhoto = sessionPhotos[0];
      const totalLikes = sessionPhotos.reduce((sum, photo) => sum + (photo.likesCount || 0), 0);
      const totalComments = sessionPhotos.reduce((sum, photo) => sum + (photo.commentsCount || 0), 0);

      groups.push({
        id: sessionId,
        userId: latestPhoto.userId,
        userName: latestPhoto.user?.name || 'Unknown User',
        userAvatar: latestPhoto.user?.profileImage || '',
        photos: sessionPhotos,
        totalLikes,
        totalComments,
        latestPhotoTime: latestPhoto.timestamp,
      });
    });

    groups.sort((a, b) => {
      const timeA = new Date(a.photos[0]?.createdAt || 0).getTime();
      const timeB = new Date(b.photos[0]?.createdAt || 0).getTime();
      return timeB - timeA;
    });

    return groups;
  }, [uploadSessions]);

  const handlePhotoClick = useCallback((photo: Photo, groupPhotos: Photo[] = [photo]) => {
    setSelectedPhoto(photo);
    setSelectedGroupPhotos(groupPhotos);
    setIsModalOpen(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
    setTimeout(() => {
      setSelectedPhoto(null);
      setSelectedGroupPhotos([]);
    }, 200);
  }, []);

  const handleLikeClick = useCallback(async (photoId: string) => {
    try {
      const responseData = await mediaService.toggleLike(photoId);

      const isLiked = responseData.data?.liked;
      const likesCount = responseData.data?.likesCount;

      if (isLiked !== undefined && likesCount !== undefined) {
        setPhotos(prev => prev.map(photo =>
          photo.id === photoId ? {
            ...photo,
            isLiked: isLiked,
            likesCount: likesCount,
          } : photo
        ));

        setUploadSessions(prev => {
          const updated = { ...prev };
          Object.keys(updated).forEach(sessionId => {
            updated[sessionId] = updated[sessionId].map(photo =>
              photo.id === photoId ? {
                ...photo,
                isLiked: isLiked,
                likesCount: likesCount,
              } : photo
            );
          });
          return updated;
        });

        if (selectedPhoto?.id === photoId) {
          setSelectedPhoto(prev => prev ? {
            ...prev,
            isLiked: isLiked,
            likesCount: likesCount,
          } : null);
        }

        toast.success(responseData.message || "Like updated");
      }

      return responseData;

    } catch (error: any) {
      const errorData = error.data || error.response?.data || error;
      toast.error(errorData.message || "Failed to update like");
      throw error;
    }
  }, [selectedPhoto]);

  const handleUpdatePhotoForModal = useCallback((photoId: string, updates: Partial<Photo>) => {
    setPhotos(prev => prev.map(photo =>
      photo.id === photoId ? { ...photo, ...updates } : photo
    ));

    setUploadSessions(prev => {
      const updated = { ...prev };
      Object.keys(updated).forEach(sessionId => {
        updated[sessionId] = updated[sessionId].map(photo =>
          photo.id === photoId ? { ...photo, ...updates } : photo
        );
      });
      return updated;
    });

    if (selectedPhoto?.id === photoId) {
      setSelectedPhoto(prev => prev ? { ...prev, ...updates } : null);
    }
  }, [selectedPhoto]);

  const handleShareClick = useCallback(async (photoId: string) => {
    try {
      await mediaService.shareMediaPost(photoId);

      setPhotos(prev => prev.map(photo =>
        photo.id === photoId ? {
          ...photo,
          sharesCount: (photo.sharesCount || 0) + 1,
        } : photo
      ));

      setUploadSessions(prev => {
        const updated = { ...prev };
        Object.keys(updated).forEach(sessionId => {
          updated[sessionId] = updated[sessionId].map(photo =>
            photo.id === photoId ? {
              ...photo,
              sharesCount: (photo.sharesCount || 0) + 1,
            } : photo
          );
        });
        return updated;
      });

      if (selectedPhoto?.id === photoId) {
        setSelectedPhoto(prev => prev ? {
          ...prev,
          sharesCount: (prev.sharesCount || 0) + 1,
        } : null);
      }

      toast.success("Post shared successfully!");

    } catch (error) {
      toast.error("Failed to share post");
      throw error;
    }
  }, [selectedPhoto]);

  const handleCommentClick = useCallback((photoId: string) => {
    const photo = photos.find(p => p.id === photoId);
    if (photo) {
      handlePhotoClick(photo);
    }
  }, [photos, handlePhotoClick]);

  const handleNewPost = useCallback(async () => {
    toast.success("Photos uploaded successfully!");
    setRefreshing(true);
    setTimeout(() => {
      setRefreshTrigger(prev => prev + 1);
    }, 1000);
  }, []);

  const handleManualRefresh = useCallback(async () => {
    setRefreshing(true);
    const toastId = toast.loading("Refreshing posts...");

    try {
      setRefreshTrigger(prev => prev + 1);
      // Wait for fetchMediaPosts to complete
      await fetchMediaPosts();

      toast.success("Posts refreshed!", { id: toastId });
    } catch (error) {
      toast.error("Failed to refresh posts", { id: toastId });
    } finally {
      setRefreshing(false);
    }
  }, [fetchMediaPosts]);
  if (loading) {
    return (
      <>
        <Toaster richColors position="top-right" />
        <MediaSharingSkeleton />
      </>
    );
  }

  return (
    <>
      <Toaster richColors position="top-right" />
      <div className="min-h-screen bg-gradient-to-b from-stone-50 via-white to-stone-50/50">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative overflow-hidden pt-20 pb-32 px-4 sm:px-6 lg:px-8"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 via-pink-500/5 to-purple-500/5" />
          <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-r from-orange-300/20 to-pink-300/20 rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-gradient-to-r from-blue-300/20 to-purple-300/20 rounded-full blur-3xl" />

          <div className="relative max-w-7xl mx-auto">
            <div className="text-center">
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-orange-500/10 to-pink-500/10 border border-orange-200/50 mb-8"
              >
                <Sparkles className="w-4 h-4 text-orange-500" />
                <span className="text-sm font-medium bg-gradient-to-r from-orange-600 to-pink-600 bg-clip-text text-transparent">
                  Global Community
                </span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.6 }}
                className="text-5xl md:text-7xl font-bold mb-6 tracking-tight"
              >
                <span className="block text-stone-900">Visual Stories from</span>
                <span className="block mt-2">
                  <span className="bg-gradient-to-r from-orange-500 via-pink-500 to-purple-600 bg-clip-text text-transparent animate-gradient">
                    Around the World
                  </span>
                </span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.6 }}
                className="text-xl text-stone-600 max-w-3xl mx-auto mb-12 leading-relaxed"
              >
                Join thousands of travelers sharing their moments. Every photo tells a story,
                every story inspires a journey.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.6 }}
                className="flex flex-wrap justify-center gap-8 mb-12"
              >
                <div className="text-center">
                  <div className="text-3xl font-bold text-stone-900 mb-2">
                    {photos.length.toLocaleString()}+
                  </div>
                  <div className="text-sm text-stone-500 flex items-center justify-center gap-2">
                    <Camera className="w-4 h-4" />
                    Photos Shared
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-stone-900 mb-2">
                    {groupedPhotos.length.toLocaleString()}+
                  </div>
                  <div className="text-sm text-stone-500 flex items-center justify-center gap-2">
                    <Users className="w-4 h-4" />
                    Upload Sessions
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-stone-900 mb-2">
                    {photos.reduce((acc, p) => acc + (p.likesCount || 0), 0).toLocaleString()}+
                  </div>
                  <div className="text-sm text-stone-500 flex items-center justify-center gap-2">
                    <TrendingUp className="w-4 h-4" />
                    Total Likes
                  </div>
                </div>
              </motion.div>

              {session && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.7, duration: 0.5 }}
                >
                  <PhotoUpload onSuccess={handleNewPost} />
                </motion.div>
              )}
            </div>
          </div>
        </motion.div>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.6 }}
            className="bg-white rounded-3xl shadow-2xl shadow-stone-200/50 border border-stone-100 overflow-hidden"
          >
            <div className="p-8 border-b border-stone-100">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h2 className="text-3xl font-bold text-stone-900 mb-2">
                    Recent Uploads
                  </h2>
                  <p className="text-stone-600">
                    Each upload creates a new photo card
                  </p>
                </div>
              </div>
            </div>

            <div className="p-8">
              {groupedPhotos.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-20"
                >
                  <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-r from-stone-100 to-stone-200 flex items-center justify-center">
                    <Camera className="w-12 h-12 text-stone-400" />
                  </div>
                  <h3 className="text-2xl font-bold text-stone-900 mb-2">
                    No photos yet
                  </h3>
                  <p className="text-stone-600 max-w-md mx-auto">
                    Be the first to share your travel adventure and inspire others!
                  </p>
                  {session && (
                    <button
                      onClick={() => document.querySelector('[data-testid="photo-upload"]')?.scrollIntoView({ behavior: 'smooth' })}
                      className="mt-6 px-6 py-3 bg-gradient-to-r from-orange-500 to-pink-500 text-white rounded-full font-medium hover:shadow-lg transition-all"
                    >
                      Upload First Photo
                    </button>
                  )}
                </motion.div>
              ) : (
                <motion.div
                  layout
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                >
                  <AnimatePresence mode="popLayout">
                    {groupedPhotos.map((group) => (
                      <motion.div
                        key={group.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ duration: 0.3 }}
                      >
                        <PhotoCard
                          photoGroup={group}
                          onPhotoClick={handlePhotoClick}
                          onDeleteSuccess={handleManualRefresh}
                          onUpdateSuccess={handleManualRefresh}
                          onLikeClick={handleLikeClick}
                          onCommentClick={handleCommentClick}
                          onShareClick={handleShareClick}
                        />
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </motion.div>
              )}
            </div>

            {groupedPhotos.length > 0 && (
              <div className="p-8 border-t border-stone-100 text-center">
                <button
                  onClick={handleManualRefresh}
                  disabled={refreshing}
                  className="px-8 py-3 border border-stone-300 text-stone-700 rounded-full hover:bg-stone-50 transition-colors font-medium disabled:opacity-50 flex items-center gap-2 mx-auto"
                >
                  {refreshing ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      Refreshing...
                    </>
                  ) : (
                    <>
                      <RefreshCw className="w-4 h-4" />
                      Refresh Posts
                    </>
                  )}
                </button>
              </div>
            )}
          </motion.div>
        </main>

        <PhotoDetailModal
          key={`modal-${selectedPhoto?.id || 'none'}`}
          photo={selectedPhoto}
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onUpdatePhoto={handleUpdatePhotoForModal}
          groupPhotos={selectedGroupPhotos}
        />
      </div>
    </>
  );
}

function MediaSharingSkeleton() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-stone-50 via-white to-stone-50/50">
      <div className="relative overflow-hidden pt-20 pb-32 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <div className="inline-block w-32 h-8 bg-stone-200 rounded-full mb-8" />

            <div className="space-y-4 mb-6">
              <div className="h-12 bg-stone-200 rounded-lg max-w-2xl mx-auto" />
              <div className="h-12 bg-stone-200 rounded-lg max-w-3xl mx-auto" />
            </div>

            <div className="h-6 bg-stone-200 rounded max-w-3xl mx-auto mb-12" />

            <div className="flex flex-wrap justify-center gap-8 mb-12">
              {[1, 2, 3].map((i) => (
                <div key={i} className="text-center">
                  <div className="w-20 h-10 bg-stone-200 rounded mb-2 mx-auto" />
                  <div className="w-24 h-4 bg-stone-200 rounded mx-auto" />
                </div>
              ))}
            </div>

            <div className="w-full max-w-2xl mx-auto">
              <div className="h-48 bg-stone-200 rounded-3xl" />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-20">
        <div className="bg-white rounded-3xl shadow-2xl shadow-stone-200/50 border border-stone-100 overflow-hidden">
          <div className="p-8 border-b border-stone-100">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
              <div className="space-y-2">
                <div className="w-48 h-8 bg-stone-200 rounded" />
                <div className="w-64 h-4 bg-stone-200 rounded" />
              </div>
              <div className="w-32 h-10 bg-stone-200 rounded-lg" />
            </div>
          </div>

          <div className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="space-y-4">
                  <div className="aspect-square bg-stone-200 rounded-2xl" />
                  <div className="space-y-2">
                    <div className="h-4 bg-stone-200 rounded w-3/4" />
                    <div className="h-4 bg-stone-200 rounded w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}