/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import {
  Heart,
  MapPin,
  Share2,
  MessageCircle,
  Clock,
  Images,
  MoreVertical,
  Trash2,
  Edit,
  Flag,
  Download,
  Copy,
  X,
  Save,
  Tag,
  Upload,
  Sparkles,
  ChevronDown,
  Loader2
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { Photo, UserPhotoGroup } from "@/types/commnunity";
import { useSession } from "next-auth/react";
import { mediaService } from "@/hooks/media/media";
import { NavbarAvatar } from "@/components/ui/NavbarAvatar";
import { toast } from "sonner";
import Swal from "sweetalert2";
import { ShareModal } from "./ShareModal";

interface PhotoCardProps {
  photoGroup: UserPhotoGroup;
  onPhotoClick: (photo: Photo, groupPhotos: Photo[]) => void;
  onDeleteSuccess?: () => void;
  onUpdateSuccess?: () => void;
  onLikeClick?: (photoId: string) => Promise<any>;
  onCommentClick?: (photoId: string) => void;
  onShareClick?: (photoId: string) => Promise<void>;
}

export function PhotoCard({
  photoGroup,
  onPhotoClick,
  onDeleteSuccess,
  onUpdateSuccess,
  onLikeClick,
  onCommentClick,
  onShareClick
}: PhotoCardProps) {
  const [showAllPhotos, setShowAllPhotos] = useState(false);
  const [isLiked, setIsLiked] = useState(() => photoGroup.photos[0]?.isLiked || false);
  const [likesCount, setLikesCount] = useState(() => photoGroup.photos[0]?.likesCount || photoGroup.totalLikes || 0);
  const [showOptions, setShowOptions] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingPhotoId, setEditingPhotoId] = useState<string | null>(null);
  const [editedCaption, setEditedCaption] = useState("");
  const [editedLocation, setEditedLocation] = useState("");
  const [editedTags, setEditedTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isLiking, setIsLiking] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  const { data: session } = useSession();
  const optionsRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const latestPhoto = photoGroup.photos[0];
  const totalShares = photoGroup.photos.reduce((acc, photo) => acc + (photo.sharesCount || 0), 0);
  const isOwner = session?.user?.id === photoGroup.userId;

  useEffect(() => {
    if (latestPhoto) {
      setIsLiked(latestPhoto.isLiked || false);
      setLikesCount(latestPhoto.likesCount || 0);
    }
  }, [latestPhoto?.isLiked, latestPhoto?.likesCount]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (optionsRef.current && !optionsRef.current.contains(event.target as Node)) {
        setShowOptions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (isEditing && latestPhoto) {
      setEditedCaption(latestPhoto.caption || "");
      setEditedLocation(latestPhoto.location || "");
      setEditedTags(latestPhoto.tags || []);
    }
  }, [isEditing, latestPhoto]);

  const handleLike = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (isLiking || !latestPhoto) return;

    setIsLiking(true);

    try {
      let responseData;

      if (onLikeClick) {
        responseData = await onLikeClick(latestPhoto.id);
      } else {
        responseData = await mediaService.toggleLike(latestPhoto.id);
      }

      const isLiked = responseData.data?.liked;
      const likesCount = responseData.data?.likesCount;

      if (isLiked !== undefined) {
        setIsLiked(isLiked);
      }

      if (likesCount !== undefined) {
        setLikesCount(likesCount);
      }

      if (responseData.message) {
        toast.success(responseData.message);
      }

    } catch (error: any) {
      const errorData = error.data || error.response?.data || error;
      const isLiked = errorData.data?.liked;
      const likesCount = errorData.data?.likesCount;

      if (isLiked !== undefined) {
        setIsLiked(isLiked);
      }

      if (likesCount !== undefined) {
        setLikesCount(likesCount);
      }

      if (errorData.message) {
        toast.success(errorData.message);
      } else {
        toast.error("Failed to update like");
      }
    } finally {
      setIsLiking(false);
    }
  };

  const handleComment = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (onCommentClick) {
      onCommentClick(latestPhoto.id);
    } else {
      handlePhotoClick(latestPhoto);
    }
  };

  const handleShare = async (e: React.MouseEvent) => {
  e.preventDefault();
  e.stopPropagation();

  if (isSharing || !latestPhoto) return;
  
  console.log("Handling share for photo:", latestPhoto.id);
  
  setIsSharing(true);

  try {
    // Call API first
    await mediaService.shareMediaPost(latestPhoto.id);

    // Open share modal - ensure photoId is available
    setIsShareModalOpen(true);

    // Trigger parent callback if needed
    if (onShareClick) {
      await onShareClick(latestPhoto.id);
    }

    toast.success("Post shared! You can now copy the link.");

  } catch (error: any) {
    console.error("Share error:", error);
    
    // Still open share modal even if API fails
    if (latestPhoto.id) {
      setIsShareModalOpen(true);
      toast.info("Opening share options...");
    } else {
      toast.error("Failed to share post - missing photo information");
    }
  } finally {
    setIsSharing(false);
  }
};
  const handlePhotoClick = (photo: Photo) => {
    if (!isEditing) {
      onPhotoClick(photo, photoGroup.photos);
    }
  };

  const handleGroupClick = () => {
    if (photoGroup.photos.length > 0 && !isEditing && !isSaving) {
      handlePhotoClick(latestPhoto);
    }
  };

  const toggleOptions = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setShowOptions(!showOptions);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];

      if (!file.type.startsWith("image/")) {
        toast.error("Please select an image file (JPG, PNG, WEBP)");
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

      // Reset the input
      e.target.value = "";
    }
  };

  const removeImage = () => {
    setSelectedFile(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const startEditing = (photo: Photo, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    setEditingPhotoId(photo.id);
    setEditedCaption(photo.caption || "");
    setEditedLocation(photo.location || "");
    setEditedTags([...photo.tags]);
    setSelectedFile(null);
    setImagePreview(null);
    setIsEditing(true);
    setShowOptions(false);
  };

  const cancelEditing = (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    setIsEditing(false);
    setEditingPhotoId(null);
    setEditedCaption("");
    setEditedLocation("");
    setEditedTags([]);
    setSelectedFile(null);
    setImagePreview(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSaveEdit = async (photoId: string, e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    if (!isOwner || !session) {
      toast.error("You must be logged in to edit photos");
      return;
    }

    setIsSaving(true);

    try {
      const updateData: any = {
        caption: editedCaption.trim() || "",
        location: editedLocation.trim() || "",
        tags: editedTags,
      };

      if (selectedFile) {
        updateData.image = selectedFile;
      }

      const response = await mediaService.updateMediaPost(photoId, updateData);

      if (response && response.data) {
        toast.success("Photo updated successfully!");

        if (onUpdateSuccess) {
          onUpdateSuccess();
        } else {
          window.location.reload();
        }

        cancelEditing();
      } else {
        throw new Error("Invalid response from server");
      }
    } catch (error: any) {
      let errorMessage = "Failed to update photo. Please try again.";
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }

      toast.error(errorMessage);
    } finally {
      setIsSaving(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTag();
    }
  };

  const addTag = () => {
    const trimmedTag = tagInput.trim();
    if (trimmedTag && !editedTags.includes(trimmedTag)) {
      setEditedTags([...editedTags, trimmedTag]);
      setTagInput("");
    }
  };

  const removeTag = (tagToRemove: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setEditedTags(editedTags.filter(tag => tag !== tagToRemove));
  };

  const handleDeleteAllPhotos = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isOwner || !session) {
      toast.error("You can only delete your own photos");
      return;
    }

    const result = await Swal.fire({
      title: 'Are you sure?',
      text: `You are about to delete all ${photoGroup.photos.length} photos. This action cannot be undone!`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Yes, delete them!',
      cancelButtonText: 'Cancel',
      reverseButtons: true,
    });

    if (!result.isConfirmed) return;

    setIsDeleting(true);

    try {
      const deletePromises = photoGroup.photos.map(photo =>
        mediaService.deleteMediaPost(photo.id)
      );

      await Promise.all(deletePromises);

      Swal.fire({
        title: 'Deleted!',
        text: `${photoGroup.photos.length} photos have been deleted.`,
        icon: 'success',
        timer: 2000,
        timerProgressBar: true,
        showConfirmButton: false,
      });

      toast.success(`Successfully deleted ${photoGroup.photos.length} photos`);

      if (onDeleteSuccess) {
        onDeleteSuccess();
      } else {
        window.location.reload();
      }

    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || "Please try again.";

      Swal.fire({
        title: 'Error!',
        text: `Failed to delete photos: ${errorMessage}`,
        icon: 'error',
        confirmButtonColor: '#ef4444',
      });

      toast.error(`Failed to delete photos: ${errorMessage}`);
    } finally {
      setIsDeleting(false);
      setShowOptions(false);
    }
  };

  const handleDeleteSinglePhoto = async (photoId: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isOwner || !session) {
      toast.error("You can only delete your own photos");
      return;
    }

    const result = await Swal.fire({
      title: 'Delete Photo?',
      text: "Are you sure you want to delete this photo? This action cannot be undone.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel',
      reverseButtons: true,
    });

    if (!result.isConfirmed) return;

    try {
      await mediaService.deleteMediaPost(photoId);

      Swal.fire({
        title: 'Deleted!',
        text: "Your photo has been deleted.",
        icon: 'success',
        timer: 2000,
        timerProgressBar: true,
        showConfirmButton: false,
      });

      toast.success("Photo deleted successfully");

      if (onDeleteSuccess) {
        onDeleteSuccess();
      } else {
        window.location.reload();
      }

    } catch (error: any) {
      Swal.fire({
        title: 'Error!',
        text: `Failed to delete photo: ${error.response?.data?.message || error.message || "Please try again."}`,
        icon: 'error',
        confirmButtonColor: '#ef4444',
      });

      toast.error(`Failed to delete photo: ${error.response?.data?.message || error.message || "Please try again"}`);
    }
  };

  const handleCopyLink = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    // Create share URL with hash/anchor
    const photoId = latestPhoto.id;
    const shareUrl = `${window.location.origin}/community#photo-${photoId}`;

    navigator.clipboard.writeText(shareUrl).then(() => {
      toast.success("📋 Share link copied to clipboard!");
      toast.info("This link will open the Community page with this photo highlighted");
    }).catch(() => {
      toast.error("Failed to copy link. Please try again.");
    });
    setShowOptions(false);
  };
  const handleReport = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toast.success("Report submitted. Our team will review this content.");
    setShowOptions(false);
  };


  const renderEditForm = () => {
    if (!isEditing || editingPhotoId !== latestPhoto.id) return null;

    return (
      <motion.div
        initial={{ opacity: 0, height: 0 }}
        animate={{ opacity: 1, height: 'auto' }}
        exit={{ opacity: 0, height: 0 }}
        className="mt-4 p-4 bg-gradient-to-r from-orange-50/50 to-pink-50/50 rounded-xl z-10 relative"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-2">
              Update Photo (Optional)
            </label>

            {imagePreview ? (
              <div className="relative">
                <div className="relative h-40 rounded-lg overflow-hidden mb-2">
                  <Image
                    src={imagePreview}
                    alt="Preview"
                    fill
                    className="object-cover"
                  />
                </div>
                <button
                  type="button"
                  onClick={removeImage}
                  className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full hover:bg-red-600"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-stone-300 rounded-lg p-4 text-center cursor-pointer hover:bg-white/50 transition-colors"
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  accept="image/*"
                  onChange={handleFileSelect}
                />
                <Upload className="w-6 h-6 text-stone-400 mx-auto mb-2" />
                <p className="text-sm text-stone-600">Click to upload new image</p>
                <p className="text-xs text-stone-500 mt-1">Supports JPG, PNG, WEBP (Max 5MB)</p>
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1">
              Caption
            </label>
            <textarea
              value={editedCaption}
              onChange={(e) => setEditedCaption(e.target.value)}
              className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none text-sm bg-white"
              rows={2}
              placeholder="Add a caption..."
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
              className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm bg-white"
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
                onKeyPress={handleKeyPress}
                className="flex-1 px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm bg-white"
                placeholder="Add a tag"
              />
              <button
                type="button"
                onClick={addTag}
                className="px-3 py-2 bg-stone-100 text-stone-700 rounded-lg text-sm hover:bg-stone-200"
              >
                Add
              </button>
            </div>

            {editedTags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {editedTags.map(tag => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1 px-2 py-1 bg-orange-100 text-orange-700 rounded-full text-xs"
                  >
                    #{tag}
                    <button
                      type="button"
                      onClick={(e) => removeTag(tag, e)}
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
            <button
              onClick={(e) => handleSaveEdit(latestPhoto.id, e)}
              disabled={isSaving}
              className="flex-1 flex items-center justify-center gap-1 px-4 py-2 bg-orange-500 text-white rounded-lg disabled:opacity-50 text-sm hover:bg-orange-600"
            >
              {isSaving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Save Changes
                </>
              )}
            </button>
            <button
              onClick={(e) => cancelEditing(e)}
              disabled={isSaving}
              className="px-4 py-2 bg-stone-100 text-stone-700 rounded-lg text-sm disabled:opacity-50 hover:bg-stone-200"
            >
              Cancel
            </button>
          </div>
        </div>

      </motion.div>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="relative rounded-3xl overflow-hidden bg-white shadow-lg border border-stone-100"
    >
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-pink-500 rounded-full blur-md opacity-30" />
              <NavbarAvatar
                src={photoGroup.userAvatar || session?.user?.image || session?.user?.picture || undefined}
                name={photoGroup.userName}
                className="w-12 h-12 rounded-full border-2 border-white shadow"
              />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-stone-900">
                  {photoGroup.userName}
                </h3>
                {photoGroup.photos.length > 1 && (
                  <span className="px-2 py-0.5 bg-gradient-to-r from-orange-100 to-pink-100 text-orange-600 text-xs font-medium rounded-full">
                    +{photoGroup.photos.length}
                  </span>
                )}
              </div>

              <div className="flex items-center gap-3 text-xs text-stone-500 mt-1">
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {formatDistanceToNow(new Date(latestPhoto.createdAt), { addSuffix: true })}
                </span>
                <span className="w-1 h-1 bg-stone-300 rounded-full" />
                <span className="flex items-center gap-1">
                  <Images className="w-3 h-3" />
                  {photoGroup.photos.length} {photoGroup.photos.length === 1 ? 'photo' : 'photos'}
                </span>
              </div>
            </div>
          </div>

          <div className="relative" ref={optionsRef}>
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={toggleOptions}
              disabled={isSaving || isDeleting || isEditing}
              className="p-2 rounded-full relative disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <MoreVertical className="w-5 h-5 text-stone-500" />
            </motion.button>

            <AnimatePresence>
              {showOptions && !isEditing && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: -10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: -10 }}
                  className="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl shadow-2xl shadow-black/10 border border-stone-200 py-2 z-50"
                >
                  <div className="absolute inset-0 bg-gradient-to-b from-white to-stone-50/50 rounded-xl" />

                  <div className="relative z-10">
                    {isOwner ? (
                      <>
                        <button
                          onClick={(e) => startEditing(latestPhoto, e)}
                          className="w-full px-4 py-3 text-left text-stone-700 flex items-center gap-3 transition-colors rounded-t-xl hover:bg-stone-50"
                        >
                          <Edit className="w-4 h-4" />
                          <span>Edit Post</span>
                        </button>
                        <button
                          onClick={handleDeleteAllPhotos}
                          disabled={isDeleting}
                          className="w-full px-4 py-3 text-left text-red-600 flex items-center gap-3 transition-colors hover:bg-stone-50 disabled:opacity-50"
                        >
                          {isDeleting ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <Trash2 className="w-4 h-4" />
                          )}
                          <span>{isDeleting ? "Deleting..." : "Delete All Photos"}</span>
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={handleReport}
                        className="w-full px-4 py-3 text-left text-stone-700 flex items-center gap-3 transition-colors rounded-t-xl hover:bg-stone-50"
                      >
                        <Flag className="w-4 h-4" />
                        <span>Report</span>
                      </button>
                    )}

                    <div className="border-t border-stone-100 my-1" />

                    <button
                      onClick={handleCopyLink}
                      className="w-full px-4 py-3 text-left text-stone-700 flex items-center gap-3 transition-colors hover:bg-stone-50"
                    >
                      <Copy className="w-4 h-4" />
                      <span>Copy Link</span>
                    </button>

                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {isEditing && (
          <div className="mt-4 flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-orange-600">
              <Edit className="w-4 h-4" />
              <span>Editing Mode</span>
            </div>
            <button
              onClick={(e) => cancelEditing(e)}
              className="text-sm text-stone-500 hover:text-stone-700 hover:underline"
            >
              Cancel Edit
            </button>
          </div>
        )}

        {latestPhoto.location && !isEditing && (
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="inline-flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-orange-500/10 to-pink-500/10 text-orange-700 rounded-full mb-4"
          >
            <MapPin className="w-4 h-4" />
            <span className="text-sm font-medium">{latestPhoto.location}</span>
          </motion.div>
        )}

        {renderEditForm()}
      </div>

      <div className="px-6 pb-6">
        <div
          className={`relative rounded-2xl overflow-hidden ${!isEditing && !isSaving ? 'cursor-pointer' : 'cursor-default'}`}
          onClick={handleGroupClick}
        >
          {photoGroup.photos.length === 1 ? (
            <div className="relative aspect-[4/3] overflow-hidden">
              <Image
                fill
                src={latestPhoto.imageUrl}
                alt={latestPhoto.caption || "Travel photo"}
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-2">
              {photoGroup.photos.slice(0, 4).map((photo, index) => (
                <div
                  key={photo.id}
                  className={`relative aspect-square overflow-hidden ${index === 0 ? 'rounded-tl-2xl' :
                    index === 1 ? 'rounded-tr-2xl' :
                      index === 2 ? 'rounded-bl-2xl' : 'rounded-br-2xl'
                    }`}
                >
                  <Image
                    fill
                    src={photo.imageUrl}
                    alt={photo.caption || `Photo ${index + 1}`}
                    className="object-cover"
                    sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 16vw"
                  />
                  {index === 3 && photoGroup.photos.length > 4 && (
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                      <span className="text-white text-lg font-bold">
                        +{photoGroup.photos.length - 4}
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="px-6 pb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={handleLike}
              disabled={isSaving || isLiking || isEditing}
              className="flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-80 transition-opacity"
            >
              <div className="relative">
                {isLiking ? (
                  <Loader2 className="w-6 h-6 text-pink-500 animate-spin" />
                ) : (
                  <Heart
                    className={`w-6 h-6 transition-all duration-200 ${isLiked
                      ? 'fill-pink-500 text-pink-500 scale-110'
                      : 'text-stone-400 hover:text-pink-400'
                      }`}
                  />
                )}
              </div>
              <span className={`font-medium transition-colors duration-200 ${isLiked ? 'text-pink-600' : 'text-stone-700'
                }`}>
                {likesCount.toLocaleString()}
              </span>
            </motion.button>

            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={handleComment}
              disabled={isSaving || isEditing}
              className="flex items-center gap-2 text-stone-700 disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-80 transition-opacity"
            >
              <MessageCircle className="w-6 h-6" />
              <span className="font-medium">{photoGroup.totalComments}</span>
            </motion.button>

            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={handleShare}
              disabled={isSaving || isSharing || isEditing}
              className="flex items-center gap-2 text-stone-700 disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-80 transition-opacity"
            >
              {isSharing ? (
                <Loader2 className="w-6 h-6 text-orange-500 animate-spin" />
              ) : (
                <Share2 className="w-6 h-6" />
              )}
              <span className="font-medium">{totalShares}</span>
            </motion.button>
          </div>

          {photoGroup.photos.length > 1 && !isEditing && (
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setShowAllPhotos(!showAllPhotos);
              }}
              disabled={isSaving}
              className="flex items-center gap-1 text-sm font-medium text-orange-600 disabled:opacity-50 disabled:cursor-not-allowed hover:text-orange-700 transition-colors"
            >
              <span>{showAllPhotos ? 'Show less' : 'Show all'}</span>
              <ChevronDown className={`w-4 h-4 transition-transform ${showAllPhotos ? 'rotate-180' : ''}`} />
            </button>
          )}
        </div>

        {latestPhoto.tags && latestPhoto.tags.length > 0 && !isEditing && (
          <div className="flex flex-wrap gap-2">
            {latestPhoto.tags.slice(0, 3).map(tag => (
              <span
                key={tag}
                className="px-3 py-1 bg-stone-100 text-stone-600 text-xs rounded-full"
              >
                #{tag}
              </span>
            ))}
            {latestPhoto.tags.length > 3 && (
              <span className="px-3 py-1 bg-stone-100 text-stone-600 text-xs rounded-full">
                +{latestPhoto.tags.length - 3}
              </span>
            )}
          </div>
        )}

        <AnimatePresence>
          {showAllPhotos && photoGroup.photos.length > 1 && !isEditing && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-4 pt-4 border-t border-stone-100 overflow-hidden"
            >
              <h4 className="text-sm font-semibold text-stone-700 mb-3 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-orange-500" />
                All Photos from this Journey
              </h4>
              <div className="grid grid-cols-3 gap-2">
                {photoGroup.photos.map((photo, index) => (
                  <motion.div
                    key={photo.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.05 }}
                    className="relative aspect-square rounded-lg overflow-hidden cursor-pointer"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handlePhotoClick(photo);
                    }}
                  >
                    <Image
                      fill
                      src={photo.imageUrl}
                      alt={`Photo ${index + 1}`}
                      className="object-cover"
                      sizes="(max-width: 768px) 33vw, (max-width: 1200px) 16vw, 11vw"
                    />
                    <span className="absolute bottom-2 right-2 px-1.5 py-0.5 bg-black/60 text-white text-xs rounded">
                      {index + 1}
                    </span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      {isShareModalOpen && latestPhoto && (
        <ShareModal
          isOpen={isShareModalOpen}
          onClose={() => setIsShareModalOpen(false)}
          photoTitle={latestPhoto.caption || "Travel Photo"}
          photoId={latestPhoto.id}
          photoImageUrl={latestPhoto.imageUrl}
        />
      )}
    </motion.div>
  );
}