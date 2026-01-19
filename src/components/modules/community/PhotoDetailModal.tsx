/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import {
  X,
  Heart,
  MapPin,
  Calendar,
  Send,
  Trash2,
  Share2,
  Clock,
  Edit2,
  ChevronLeft,
  ChevronRight,
  Images,
  Upload,
  Tag,
  Save,
  MessageCircle,
  Bookmark,
  Download,
  Copy,
  Flag,
  Sparkles,
  Globe,
  MoreVertical,
  Check,
  Loader2
} from "lucide-react";
import { ShareModal } from "./ShareModal";
import { useSession } from "next-auth/react";
import { formatDistanceToNow } from "date-fns";
import { Photo } from "@/types/commnunity";
import { mediaService } from "@/hooks/media/media";
import { toast } from "sonner";
import { NavbarAvatar } from "@/components/ui/NavbarAvatar";

interface PhotoDetailModalProps {
  photo: Photo | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdatePhoto: (photoId: string, updates: Partial<Photo>) => void;
  groupPhotos?: Photo[];
}

export function PhotoDetailModal({
  photo,
  isOpen,
  onClose,
  onUpdatePhoto,
  groupPhotos = [],
}: PhotoDetailModalProps) {
  const [currentPhoto, setCurrentPhoto] = useState<Photo | null>(null);
  const [isLiked, setIsLiked] = useState(() => photo?.isLiked || false);
  const [likes, setLikes] = useState(() => photo?.likesCount || 0);
  const [comments, setComments] = useState<any[]>([]);
  const [newComment, setNewComment] = useState("");
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isEditingCaption, setIsEditingCaption] = useState(false);
  const [editedCaption, setEditedCaption] = useState("");
  const [loadingComments, setLoadingComments] = useState(false);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [isSaving, setIsSaving] = useState(false);
  const [isEditingImage, setIsEditingImage] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [editedLocation, setEditedLocation] = useState("");
  const [editedTags, setEditedTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isLiking, setIsLiking] = useState(false);
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const [editedCommentContent, setEditedCommentContent] = useState("");

  const { data: session } = useSession();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const optionsRef = useRef<HTMLDivElement>(null);

  const getCurrentPhoto = () => {
    if (groupPhotos.length > 0 && currentPhotoIndex >= 0 && currentPhotoIndex < groupPhotos.length) {
      return groupPhotos[currentPhotoIndex];
    }
    return photo;
  };

  useEffect(() => {
    if (photo) {
      const index = groupPhotos.findIndex(p => p.id === photo.id);
      setCurrentPhotoIndex(index >= 0 ? index : 0);

      if (groupPhotos.length > 0 && index >= 0) {
        const photoToShow = groupPhotos[index];
        setCurrentPhoto(photoToShow);
        setEditedCaption(photoToShow.caption || "");
        setEditedLocation(photoToShow.location || "");
        setEditedTags(photoToShow.tags || []);
        setIsLiked(photoToShow.isLiked);
        setLikes(photoToShow.likesCount);
      } else if (photo) {
        setCurrentPhoto(photo);
        setEditedCaption(photo.caption || "");
        setEditedLocation(photo.location || "");
        setEditedTags(photo.tags || []);
        setIsLiked(photo.isLiked);
        setLikes(photo.likesCount);
      }
    }
  }, [photo, groupPhotos]);

  useEffect(() => {
    const photoToShow = getCurrentPhoto();
    if (photoToShow) {
      setIsLiked(photoToShow.isLiked || false);
      setLikes(photoToShow.likesCount || 0);
      setEditedCaption(photoToShow.caption || "");
      setEditedLocation(photoToShow.location || "");
      setEditedTags(photoToShow.tags || []);
      fetchComments(photoToShow.id);
    }
  }, [currentPhotoIndex, groupPhotos]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (optionsRef.current && !optionsRef.current.contains(event.target as Node)) {
        setShowOptions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const fetchComments = async (photoId: string) => {
    try {
      setLoadingComments(true);
      const response = await mediaService.getMediaPostById(photoId);
      setComments(response.data.comments || []);
    } catch (error) {
      toast.error("Failed to load comments");
    } finally {
      setLoadingComments(false);
    }
  };

  const navigateToPhoto = (index: number) => {
    if (index >= 0 && index < groupPhotos.length) {
      setCurrentPhotoIndex(index);
      const newPhoto = groupPhotos[index];
      setCurrentPhoto(newPhoto);
      setIsEditingImage(false);
      setSelectedFile(null);
      setImagePreview(null);
    }
  };

  const nextPhoto = () => {
    if (currentPhotoIndex < groupPhotos.length - 1) {
      navigateToPhoto(currentPhotoIndex + 1);
    }
  };

  const prevPhoto = () => {
    if (currentPhotoIndex > 0) {
      navigateToPhoto(currentPhotoIndex - 1);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];

      if (!file.type.startsWith("image/")) {
        toast.error("Please select an image file");
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image size should be less than 5MB");
        return;
      }

      setSelectedFile(file);

      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setSelectedFile(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleImageUpdate = async () => {
    if (!currentPhoto || !session || !selectedFile) return;

    try {
      setIsSaving(true);
      const promise = mediaService.updateMediaPost(currentPhoto.id, {
        image: selectedFile,
        caption: editedCaption,
        location: editedLocation,
        tags: editedTags,
      });

      toast.promise(promise, {
        loading: 'Updating image...',
        success: () => {
          return "Photo image updated successfully!";
        },
        error: 'Failed to update image'
      });

      const updatedPhoto = await mediaService.getMediaPostById(currentPhoto.id);
      setCurrentPhoto(updatedPhoto.data);

      onUpdatePhoto(currentPhoto.id, {
        imageUrl: updatedPhoto.data.imageUrl,
      });

      setIsEditingImage(false);
      setSelectedFile(null);
      setImagePreview(null);

    } catch (error) {
    } finally {
      setIsSaving(false);
    }
  };

  const handleLike = async () => {
    if (!currentPhoto || !session || isLiking) {
      return;
    }

    setIsLiking(true);

    try {
      const response = await mediaService.toggleLike(currentPhoto.id);
      const responseData = response.data || response;

      const isLiked = responseData.liked ?? responseData.data?.liked;
      const likesCount = responseData.likesCount ?? responseData.data?.likesCount;

      if (isLiked !== undefined) {
        setIsLiked(isLiked);
      }

      if (likesCount !== undefined) {
        setLikes(likesCount);
      }

      if (isLiked !== undefined && likesCount !== undefined) {
        onUpdatePhoto(currentPhoto.id, {
          isLiked: isLiked,
          likesCount: likesCount,
        });
      }

      if (responseData.message?.includes('liked')) {
        toast.success("Photo liked!");
      } else if (responseData.message?.includes('unliked')) {
        toast.success("Photo unliked");
      }

    } catch (error: any) {
      const errorData = error.response?.data || error.data || error;
      const isLiked = errorData.liked ?? errorData.data?.liked;
      const likesCount = errorData.likesCount ?? errorData.data?.likesCount;

      if (isLiked !== undefined) {
        setIsLiked(isLiked);
      }

      if (likesCount !== undefined) {
        setLikes(likesCount);
      }

      if (isLiked !== undefined && likesCount !== undefined) {
        onUpdatePhoto(currentPhoto.id, {
          isLiked: isLiked,
          likesCount: likesCount,
        });
      }

      if (errorData.message) {
        toast.success(errorData.message || "Like updated");
      } else {
        toast.error("Failed to update like. Please try again.");
      }
    } finally {
      setIsLiking(false);
    }
  };

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPhoto || !newComment.trim() || !session) return;

    try {
      const response = await mediaService.addComment(currentPhoto.id, {
        content: newComment,
      });

      setComments(prev => [response.data, ...prev]);
      setNewComment("");

      onUpdatePhoto(currentPhoto.id, {
        commentsCount: currentPhoto.commentsCount + 1,
      });

      toast.success("Comment added!");
    } catch (error) {
      toast.error("Failed to add comment");
    }
  };

  const startEditingComment = (commentId: string, currentContent: string) => {
    setEditingCommentId(commentId);
    setEditedCommentContent(currentContent);
  };

  const cancelEditingComment = () => {
    setEditingCommentId(null);
    setEditedCommentContent("");
  };

  const handleSaveComment = async (commentId: string) => {
    if (!currentPhoto || !editedCommentContent.trim()) return;

    try {
      setIsSaving(true);

      // Call API to update comment
      await mediaService.updateComment(
        currentPhoto.id,
        commentId,
        { content: editedCommentContent }
      );

      // Update local state
      setComments(prev =>
        prev.map(comment =>
          comment.id === commentId
            ? { ...comment, content: editedCommentContent }
            : comment
        )
      );

      cancelEditingComment();
      toast.success("Comment updated!");
    } catch (error: any) {
      console.error("Failed to update comment:", error);

      // Show user-friendly error message
      const errorMessage = error.response?.data?.message || error.message || "Failed to update comment";
      toast.error(errorMessage);

      // Revert editing state on error
      cancelEditingComment();
    } finally {
      setIsSaving(false);
    }
  };


  const handleShare = async () => {
    if (!currentPhoto || !session) return;

    try {
      await mediaService.shareMediaPost(currentPhoto.id);
      setIsShareModalOpen(true);

      onUpdatePhoto(currentPhoto.id, {
        sharesCount: currentPhoto.sharesCount + 1,
      });

      toast.success("Post shared successfully!");
    } catch (error) {
      toast.error("Failed to share post");
    }
  };

  const handleSaveCaption = async () => {
    if (!currentPhoto) return;

    try {
      setIsSaving(true);
      const promise = mediaService.updateMediaPost(currentPhoto.id, {
        caption: editedCaption,
        location: editedLocation,
        tags: editedTags,
      });

      toast.promise(promise, {
        loading: 'Saving changes...',
        success: () => {
          return "Post updated successfully!";
        },
        error: 'Failed to update post'
      });

      await promise;
      onUpdatePhoto(currentPhoto.id, {
        caption: editedCaption,
        location: editedLocation,
        tags: editedTags,
      });

      setIsEditingCaption(false);
    } catch (error) {
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    if (!currentPhoto) return;

    try {
      // Call API to delete comment
      await mediaService.deleteComment(currentPhoto.id, commentId);

      // Update local state
      setComments(prev => prev.filter(c => c.id !== commentId));

      // Update comment count
      onUpdatePhoto(currentPhoto.id, {
        commentsCount: Math.max(0, currentPhoto.commentsCount - 1),
      });

      toast.success("Comment deleted!");
    } catch (error: any) {
      console.error("Failed to delete comment:", error);

      // Show user-friendly error message
      const errorMessage = error.response?.data?.message || error.message || "Failed to delete comment";
      toast.error(errorMessage);
    }
  };
  const addTag = () => {
    if (tagInput.trim() && !editedTags.includes(tagInput.trim())) {
      setEditedTags([...editedTags, tagInput.trim()]);
      setTagInput("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setEditedTags(editedTags.filter(tag => tag !== tagToRemove));
  };

  const handleDownload = async () => {
    if (!currentPhoto) return;

    try {
      setIsDownloading(true);
      const toastId = toast.loading("Preparing download...");

      const response = await fetch(currentPhoto.imageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `travel-photo-${currentPhoto.id}.jpg`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast.success("Photo downloaded successfully!", { id: toastId });
    } catch (error) {
      toast.error("Failed to download photo");
    } finally {
      setIsDownloading(false);
      setShowOptions(false);
    }
  };

  const handleCopyLink = () => {
    const photoUrl = `${window.location.origin}/media/${currentPhoto?.id}`;
    navigator.clipboard.writeText(photoUrl);
    toast.success("Link copied to clipboard!");
    setShowOptions(false);
  };

  const handleReport = () => {
    toast.success("Report submitted. Our team will review this content.");
    setShowOptions(false);
  };

  if (!isOpen || !currentPhoto) return null;

  const isOwnPhoto = session?.user?.id === currentPhoto.userId;

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative bg-white rounded-3xl shadow-2xl max-w-7xl w-full max-h-[90vh] overflow-hidden flex flex-col md:flex-row"
            >
              <div className="md:w-3/5 bg-gradient-to-br from-stone-900 to-black relative">
                <div className="absolute inset-0">
                  <Image
                    fill
                    src={currentPhoto.imageUrl}
                    alt={currentPhoto.caption || "Travel photo"}
                    className="object-contain"
                    sizes="(max-width: 768px) 100vw, 60vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
                </div>

                {groupPhotos.length > 1 && (
                  <>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={prevPhoto}
                      disabled={currentPhotoIndex === 0}
                      className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-full text-white disabled:opacity-30 transition-all"
                    >
                      <ChevronLeft className="w-6 h-6" />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={nextPhoto}
                      disabled={currentPhotoIndex === groupPhotos.length - 1}
                      className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-full text-white disabled:opacity-30 transition-all"
                    >
                      <ChevronRight className="w-6 h-6" />
                    </motion.button>

                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md text-white text-sm rounded-full"
                    >
                      <Images className="w-4 h-4" />
                      <span>{currentPhotoIndex + 1} / {groupPhotos.length}</span>
                    </motion.div>

                    <div className="absolute bottom-6 left-6 flex gap-1.5">
                      {groupPhotos.map((_, index) => (
                        <button
                          key={index}
                          onClick={() => navigateToPhoto(index)}
                          className={`w-2 h-2 rounded-full transition-all ${index === currentPhotoIndex
                            ? 'bg-white scale-125'
                            : 'bg-white/50 hover:bg-white/80'
                            }`}
                        />
                      ))}
                    </div>
                  </>
                )}

                <div className="absolute top-6 right-6 flex items-center gap-2">
                  <div className="relative" ref={optionsRef}>


                    <AnimatePresence>
                      {showOptions && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.95, y: -10 }}
                          animate={{ opacity: 1, scale: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.95, y: -10 }}
                          className="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl shadow-2xl shadow-black/20 border border-stone-200 py-2 z-50 overflow-hidden"
                        >
                          <div className="absolute inset-0 bg-gradient-to-b from-white to-stone-50/50" />

                          {isOwnPhoto ? (
                            <>
                              <button
                                onClick={() => {
                                  setIsEditingCaption(true);
                                  setShowOptions(false);
                                }}
                                className="w-full px-4 py-3 text-left text-stone-700 hover:bg-stone-50 flex items-center gap-3 transition-colors"
                              >
                                <Edit2 className="w-4 h-4" />
                                <span>Edit Post</span>
                              </button>
                              <button
                                onClick={() => {
                                  setIsEditingImage(true);
                                  setShowOptions(false);
                                }}
                                className="w-full px-4 py-3 text-left text-stone-700 hover:bg-stone-50 flex items-center gap-3 transition-colors"
                              >
                                <Upload className="w-4 h-4" />
                                <span>Update Image</span>
                              </button>
                              <div className="border-t border-stone-100 my-1" />
                            </>
                          ) : (
                            <button
                              onClick={handleReport}
                              className="w-full px-4 py-3 text-left text-stone-700 hover:bg-stone-50 flex items-center gap-3 transition-colors"
                            >
                              <Flag className="w-4 h-4" />
                              <span>Report Content</span>
                            </button>
                          )}

                          <button
                            onClick={handleCopyLink}
                            className="w-full px-4 py-3 text-left text-stone-700 hover:bg-stone-50 flex items-center gap-3 transition-colors"
                          >
                            <Copy className="w-4 h-4" />
                            <span>Copy Link</span>
                          </button>

                          <button
                            onClick={handleDownload}
                            disabled={isDownloading}
                            className="w-full px-4 py-3 text-left text-stone-700 hover:bg-stone-50 flex items-center gap-3 transition-colors disabled:opacity-50"
                          >
                            {isDownloading ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <Download className="w-4 h-4" />
                            )}
                            <span>{isDownloading ? "Downloading..." : "Download Photo"}</span>
                          </button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.1, rotate: 90 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={onClose}
                    className="p-2 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-full text-white transition-all"
                  >
                    <X className="w-6 h-6" />
                  </motion.button>
                </div>
              </div>

              <div className="md:w-2/5 flex flex-col max-h-[90vh]">
                <div className="p-8 border-b border-stone-100">
                  <div className="flex items-start gap-3 mb-6">
                    <motion.div
                      className="relative"
                      whileHover={{ scale: 1.05 }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-pink-500 rounded-full blur-md opacity-30" />
                      <NavbarAvatar
                        src={session?.user?.image || session?.user?.picture || undefined}
                        name={session?.user?.name}
                        className="w-12 h-12 rounded-full border-2 border-white shadow"
                      />
                    </motion.div>

                    <div className="flex-1">
                      <h3 className="font-bold text-lg text-stone-900">
                        {currentPhoto.user.name}
                      </h3>
                      <div className="flex items-center gap-2 text-sm text-stone-500 mt-1">
                        <Clock className="w-3 h-3" />
                        <span>
                          {formatDistanceToNow(new Date(currentPhoto.createdAt), { addSuffix: true })}
                        </span>
                        {currentPhoto.location && (
                          <>
                            <span className="w-1 h-1 bg-stone-300 rounded-full" />
                            <MapPin className="w-3 h-3" />
                            <span>{currentPhoto.location}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="mb-6">
                    <div className="flex items-center gap-2 mb-3">
                      <Globe className="w-5 h-5 text-orange-500" />
                      <h4 className="text-xl font-bold text-stone-900">
                        {currentPhoto.tripName}
                      </h4>
                    </div>

                    {isEditingImage && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mb-6 bg-gradient-to-r from-orange-50 to-pink-50 rounded-2xl p-4 overflow-hidden"
                      >
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="font-medium text-stone-900">Update Image</h4>
                          <button
                            onClick={() => {
                              setIsEditingImage(false);
                              removeImage();
                            }}
                            className="p-1 hover:bg-white/50 rounded-lg transition-colors"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>

                        {imagePreview ? (
                          <div className="relative mb-3">
                            <div className="relative h-40 rounded-lg overflow-hidden">
                              <Image
                                src={imagePreview}
                                alt="Preview"
                                fill
                                className="object-cover"
                              />
                            </div>
                            <button
                              onClick={removeImage}
                              className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full hover:bg-red-600"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        ) : (
                          <div
                            onClick={() => fileInputRef.current?.click()}
                            className="border-2 border-dashed border-stone-300 rounded-lg p-6 text-center cursor-pointer hover:bg-white/50 transition-colors mb-3"
                          >
                            <input
                              type="file"
                              ref={fileInputRef}
                              className="hidden"
                              accept="image/*"
                              onChange={handleFileSelect}
                            />
                            <Upload className="w-8 h-8 text-stone-400 mx-auto mb-2" />
                            <p className="text-sm text-stone-600">Click to upload new image</p>
                            <p className="text-xs text-stone-500 mt-1">Max 5MB</p>
                          </div>
                        )}

                        <div className="flex gap-2">
                          <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={handleImageUpdate}
                            disabled={isSaving || !selectedFile}
                            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-500 to-pink-500 text-white rounded-lg hover:shadow-lg disabled:opacity-50"
                          >
                            <Save className="w-4 h-4" />
                            {isSaving ? "Saving..." : "Update Image"}
                          </motion.button>
                        </div>
                      </motion.div>
                    )}

                    <div className="bg-gradient-to-r from-orange-50/50 to-pink-50/50 rounded-2xl p-4">
                      {isEditingCaption ? (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="space-y-4"
                        >
                          <div>
                            <label className="block text-sm font-medium text-stone-700 mb-1">
                              Caption
                            </label>
                            <textarea
                              value={editedCaption}
                              onChange={(e) => setEditedCaption(e.target.value)}
                              className="w-full px-3 py-2 bg-white/50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none transition-all duration-200"
                              rows={3}
                              placeholder="Tell the story behind this moment..."
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-stone-700 mb-1">
                              <MapPin className="w-4 h-4 inline mr-1" />
                              Location
                            </label>
                            <input
                              type="text"
                              value={editedLocation}
                              onChange={(e) => setEditedLocation(e.target.value)}
                              className="w-full px-3 py-2 bg-white/50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all duration-200"
                              placeholder="Where was this taken?"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-stone-700 mb-1">
                              <Tag className="w-4 h-4 inline mr-1" />
                              Tags
                            </label>
                            <div className="flex gap-2 mb-2">
                              <input
                                type="text"
                                value={tagInput}
                                onChange={(e) => setTagInput(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                                className="flex-1 px-3 py-2 bg-white/50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all duration-200"
                                placeholder="Add a tag"
                              />
                              <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                type="button"
                                onClick={addTag}
                                className="px-3 py-2 bg-gradient-to-r from-orange-100 to-pink-100 text-orange-700 rounded-xl hover:from-orange-200 hover:to-pink-200 transition-all"
                              >
                                Add
                              </motion.button>
                            </div>

                            {editedTags.length > 0 && (
                              <div className="flex flex-wrap gap-2">
                                {editedTags.map(tag => (
                                  <span
                                    key={tag}
                                    className="inline-flex items-center gap-1 px-2 py-1.5 bg-gradient-to-r from-orange-100 to-pink-100 text-orange-700 rounded-full text-sm"
                                  >
                                    #{tag}
                                    <button
                                      type="button"
                                      onClick={() => removeTag(tag)}
                                      className="hover:text-orange-900"
                                    >
                                      <X className="w-3 h-3" />
                                    </button>
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>

                          <div className="flex gap-2 pt-2">
                            <motion.button
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                              onClick={handleSaveCaption}
                              disabled={isSaving}
                              className="flex-1 flex items-center gap-1 px-4 py-2 bg-gradient-to-r from-orange-500 to-pink-500 text-white rounded-lg hover:shadow-lg disabled:opacity-50"
                            >
                              <Save className="w-4 h-4" />
                              {isSaving ? "Saving..." : "Save Changes"}
                            </motion.button>
                            <button
                              onClick={() => {
                                setIsEditingCaption(false);
                                setEditedCaption(currentPhoto.caption || "");
                                setEditedLocation(currentPhoto.location || "");
                                setEditedTags(currentPhoto.tags || []);
                              }}
                              className="px-4 py-2 bg-stone-100 text-stone-700 rounded-lg hover:bg-stone-200 transition-colors"
                            >
                              Cancel
                            </button>
                          </div>
                        </motion.div>
                      ) : (
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1">
                            <p className="text-stone-700 text-sm mb-2">
                              {currentPhoto.caption || (
                                <span className="text-stone-400 italic">
                                  No caption added
                                </span>
                              )}
                            </p>

                            {currentPhoto.tags && currentPhoto.tags.length > 0 && (
                              <div className="flex flex-wrap gap-2 mt-2">
                                {currentPhoto.tags.map(tag => (
                                  <span
                                    key={tag}
                                    className="inline-block px-2 py-1 bg-gradient-to-r from-stone-100 to-stone-50 text-stone-600 text-xs rounded-full"
                                  >
                                    #{tag}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                          {isOwnPhoto && !isEditingImage && (
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => setIsEditingCaption(true)}
                              className="p-1 hover:bg-white/50 rounded-lg transition-colors flex-shrink-0"
                            >
                              <Edit2 className="w-3.5 h-3.5 text-stone-600" />
                            </motion.button>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-6">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleLike}
                      disabled={isLiking}
                      className="flex items-center gap-2 group/like disabled:opacity-50"
                    >
                      <div className="relative">
                        {isLiking ? (
                          <Loader2 className="w-6 h-6 text-pink-500 animate-spin" />
                        ) : (
                          <Heart
                            className={`w-6 h-6 transition-all duration-200 ${isLiked
                              ? 'fill-pink-500 text-pink-500 scale-110'
                              : 'text-stone-400 group-hover/like:text-pink-400'
                              }`}
                          />
                        )}
                        {isLiked && (
                          <div className="absolute inset-0 scale-150">
                            <Heart className="w-6 h-6 fill-pink-200/30 text-pink-200/30" />
                          </div>
                        )}
                      </div>
                      <span className={`font-medium transition-colors duration-200 ${isLiked ? 'text-pink-600' : 'text-stone-700'
                        }`}>
                        {likes}
                      </span>
                    </motion.button>

                    <div className="flex items-center gap-2 text-stone-700">
                      <MessageCircle className="w-6 h-6 text-stone-400" />
                      <span className="font-medium">{currentPhoto.commentsCount}</span>
                    </div>

                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleShare}
                      className="flex items-center gap-2 group/share"
                    >
                      <Share2 className="w-6 h-6 text-stone-400 group-hover/share:text-orange-500" />
                      <span className="font-medium text-stone-700">
                        {currentPhoto.sharesCount}
                      </span>
                    </motion.button>
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto p-8">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-bold text-stone-900 flex items-center gap-2">
                      <MessageCircle className="w-5 h-5 text-orange-500" />
                      Community Responses ({currentPhoto.commentsCount})
                    </h3>
                    {session && comments.length > 0 && (
                      <button className="text-sm font-medium text-orange-600 hover:text-orange-700 transition-colors">
                        View all
                      </button>
                    )}
                  </div>

                  {loadingComments ? (
                    <div className="space-y-4">
                      {[1, 2, 3].map((i) => (
                        <div key={i} className="flex gap-3 animate-pulse">
                          <div className="w-10 h-10 bg-stone-200 rounded-full" />
                          <div className="flex-1 space-y-2">
                            <div className="h-4 bg-stone-200 rounded w-24" />
                            <div className="h-3 bg-stone-200 rounded w-full" />
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : comments.length === 0 ? (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-center py-8"
                    >
                      <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-orange-100 to-pink-100 flex items-center justify-center">
                        <MessageCircle className="w-8 h-8 text-orange-400" />
                      </div>
                      <p className="text-stone-600">
                        No comments yet. Be the first to share your thoughts!
                      </p>
                    </motion.div>
                  ) : (
                    <div className="space-y-4">
                      {comments.map((comment) => (
                        <motion.div key={comment.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="flex gap-3 group">
                          <NavbarAvatar
                            src={comment.userAvatar || session?.user?.image || session?.user?.picture || undefined}
                            name={comment.user.name}
                            className="w-10 h-10 rounded-full border-2 border-white shadow"
                          />
                          <div className="flex-1">
                            <div className="bg-stone-50 rounded-2xl px-4 py-3">
                              <div className="flex items-center justify-between mb-2">
                                <p className="font-semibold text-sm text-stone-900">
                                  {comment.user.name}
                                </p>
                                {comment.user.id === session?.user?.id && (
                                  <div className="flex gap-2">
                                    {editingCommentId === comment.id ? (
                                      <>
                                        <button
                                          onClick={() => handleSaveComment(comment.id)}
                                          className="text-xs text-green-600 hover:text-green-800"
                                        >
                                          Save
                                        </button>
                                        <button
                                          onClick={cancelEditingComment}
                                          className="text-xs text-stone-600 hover:text-stone-800"
                                        >
                                          Cancel
                                        </button>
                                      </>
                                    ) : (
                                      <>
                                        <button
                                          onClick={() => startEditingComment(comment.id, comment.content)}
                                          className="text-xs text-blue-600 hover:text-blue-800"
                                        >
                                          Edit
                                        </button>
                                        <button
                                          onClick={() => handleDeleteComment(comment.id)}
                                          className="text-xs text-red-600 hover:text-red-800"
                                        >
                                          Delete
                                        </button>
                                      </>
                                    )}
                                  </div>
                                )}
                              </div>
                              {editingCommentId === comment.id ? (
                                <textarea
                                  value={editedCommentContent}
                                  onChange={(e) => setEditedCommentContent(e.target.value)}
                                  className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none text-sm"
                                  rows={2}
                                />
                              ) : (
                                <p className="text-stone-700 text-sm">{comment.content}</p>
                              )}
                            </div>
                            <p className="text-xs text-stone-500 mt-1 ml-4">
                              {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
                            </p>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </div>

                {session && (
                  <form
                    onSubmit={handleAddComment}
                    className="p-8 border-t border-stone-100"
                  >
                    <div className="flex gap-3">

                      <NavbarAvatar
                        src={session?.user?.image || session?.user?.picture || undefined}
                        name={session?.user?.name}
                        className="w-12 h-12 rounded-full border-2 border-white shadow"
                      />
                      <div className="flex-1 relative">
                        <input
                          type="text"
                          value={newComment}
                          onChange={(e) => setNewComment(e.target.value)}
                          placeholder="Share your thoughts..."
                          className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-full focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
                          disabled={!session}
                        />
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          type="submit"
                          disabled={!newComment.trim() || !session}
                          className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-gradient-to-r from-orange-500 to-pink-500 text-white rounded-full hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <Send className="w-5 h-5" />
                        </motion.button>
                      </div>
                    </div>
                  </form>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <ShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        photoTitle={currentPhoto?.caption || currentPhoto?.tripName || "Travel Photo"}
        photoId={currentPhoto?.id || ""}
        photoImageUrl={currentPhoto?.imageUrl}
      />
    </>
  );
}