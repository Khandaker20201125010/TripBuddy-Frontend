/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Upload,
  Image as ImageIcon,
  X,
  MapPin,
  Tag,
  ChevronLeft,
  ChevronRight,
  Plus,
  Sparkles,
  Globe,
  Camera,
  CheckCircle,
  Loader2,
  Save
} from "lucide-react";
import Image from "next/image";
import { CreateMediaPostData, mediaService } from "@/hooks/media/media";
import { toast } from "sonner";

interface PhotoUploadProps {
  onSuccess?: () => void;
}

interface PhotoFile {
  id: string;
  file: File;
  preview: string;
  caption: string;
  location: string;
  tags: string[];
}

export function PhotoUpload({ onSuccess }: PhotoUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [photos, setPhotos] = useState<PhotoFile[]>([]);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [location, setLocation] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [uploaded, setUploaded] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      handleFiles(files);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(e.target.files);
    }
  };

  const handleFiles = (files: FileList) => {
    const validFiles: File[] = [];
    const invalidFiles: string[] = [];

    Array.from(files).forEach(file => {
      if (!file.type.startsWith("image/")) {
        invalidFiles.push(`${file.name} - Not an image file`);
      } else if (file.size > 5 * 1024 * 1024) {
        invalidFiles.push(`${file.name} - File too large (max 5MB)`);
      } else {
        validFiles.push(file);
      }
    });

    if (invalidFiles.length > 0) {
      toast.error(`Some files were skipped:\n${invalidFiles.join('\n')}`);
    }

    const newPhotos: PhotoFile[] = validFiles.map(file => ({
      id: Math.random().toString(36).substr(2, 9),
      file,
      preview: URL.createObjectURL(file),
      caption: "",
      location: "",
      tags: [],
    }));

    setPhotos(prev => [...prev, ...newPhotos]);
    
    if (photos.length === 0 && newPhotos.length > 0) {
      setCurrentPhotoIndex(0);
    }

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleAddMorePhotos = () => {
    fileInputRef.current?.click();
  };

  const handleRemovePhoto = (photoId: string) => {
    setPhotos(prev => {
      const newPhotos = prev.filter(photo => photo.id !== photoId);
      
      const photoToRemove = prev.find(photo => photo.id === photoId);
      if (photoToRemove) {
        URL.revokeObjectURL(photoToRemove.preview);
      }

      if (newPhotos.length === 0) {
        setCurrentPhotoIndex(0);
      } else if (currentPhotoIndex >= newPhotos.length) {
        setCurrentPhotoIndex(newPhotos.length - 1);
      }

      return newPhotos;
    });
  };

  const updateCurrentPhoto = (updates: Partial<PhotoFile>) => {
    setPhotos(prev =>
      prev.map((photo, index) =>
        index === currentPhotoIndex ? { ...photo, ...updates } : photo
      )
    );
  };

  const nextPhoto = () => {
    if (currentPhotoIndex < photos.length - 1) {
      setCurrentPhotoIndex(prev => prev + 1);
    }
  };

  const prevPhoto = () => {
    if (currentPhotoIndex > 0) {
      setCurrentPhotoIndex(prev => prev - 1);
    }
  };

  const addTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      const newTags = [...tags, tagInput.trim()];
      setTags(newTags);
      updateCurrentPhoto({ tags: newTags });
      setTagInput("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    const newTags = tags.filter(tag => tag !== tagToRemove);
    setTags(newTags);
    updateCurrentPhoto({ tags: newTags });
  };

 const handleShare = async () => {
  if (photos.length === 0) {
    toast.error("Please select at least one photo to upload");
    return;
  }

  try {
    setUploading(true);
    setUploadProgress(0);
    
    const totalPhotos = photos.length;
    let uploadedCount = 0;
    
    const uploadPromise = new Promise(async (resolve, reject) => {
      try {
        for (const photoItem of photos) {
          const postData: CreateMediaPostData = {
            caption: photoItem.caption.trim() || undefined,
            location: photoItem.location.trim() || location.trim() || undefined,
            tags: photoItem.tags.length > 0 ? photoItem.tags : tags.length > 0 ? tags : undefined,
            image: photoItem.file
          };

          await mediaService.createMediaPost(postData);
          uploadedCount++;
          setUploadProgress(Math.round((uploadedCount / totalPhotos) * 100));
        }
        resolve(true);
      } catch (error: any) {
        // Use a generic error message since we don't have access to photoItem here
        reject(new Error(`Failed to upload photo: ${error.response?.data?.message || error.message}`));
      }
    });

    toast.promise(uploadPromise, {
      loading: `Uploading ${photos.length} photo${photos.length > 1 ? 's' : ''}...`,
      success: () => {
        setUploaded(true);
        return `Successfully uploaded ${photos.length} photo${photos.length > 1 ? 's' : ''}!`;
      },
      error: (error) => error.message || "Failed to upload photos"
    });

    await uploadPromise;
    
    // Clear and refresh after upload
    setTimeout(() => {
      clearAll();
      setUploaded(false);
      
      if (onSuccess) {
        onSuccess();
      }
    }, 1500);
    
  } catch (error: any) {
    console.error("Failed to share photos:", error);
  } finally {
    setUploading(false);
  }
};

  const clearAll = () => {
    photos.forEach(photo => {
      URL.revokeObjectURL(photo.preview);
    });
    
    setPhotos([]);
    setCurrentPhotoIndex(0);
    setLocation("");
    setTags([]);
    setTagInput("");
    
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const currentPhoto = photos[currentPhotoIndex];

  return (
    <div className="w-full max-w-2xl mx-auto">
      <AnimatePresence mode="wait">
        {uploaded ? (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="text-center p-8 bg-gradient-to-br from-green-50 to-emerald-50 rounded-3xl border border-green-100 shadow-lg"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", delay: 0.2 }}
              className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center shadow-lg"
            >
              <CheckCircle className="w-10 h-10 text-white" />
            </motion.div>
            <h3 className="text-2xl font-bold text-stone-900 mb-2">
              Photos Shared Successfully!
            </h3>
            <p className="text-stone-600">
              Your travel moments are now live for the community to see.
            </p>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="mt-6 flex justify-center gap-4"
            >
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={clearAll}
                className="px-6 py-2 border border-stone-300 text-stone-700 rounded-full hover:bg-stone-50 transition-colors"
              >
                Upload More
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-2 gradient-sunset text-white rounded-full hover:shadow-lg"
              >
                View Post
              </motion.button>
            </motion.div>
          </motion.div>
        ) : photos.length === 0 ? (
          <motion.div
            key="upload"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`
                relative group cursor-pointer
                border-3 border-dashed rounded-3xl p-12 text-center transition-all duration-500
                ${isDragging 
                  ? 'border-orange-500 bg-gradient-to-br from-orange-50/50 to-pink-50/50 scale-[1.02]' 
                  : 'border-stone-200 hover:border-orange-300 bg-gradient-to-br from-white to-stone-50/50'
                }
              `}
            >
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/*"
                multiple
                onChange={handleFileSelect}
              />

              <div className="flex flex-col items-center justify-center space-y-6">
                <motion.div
                  animate={isDragging ? { y: [0, -10, 0] } : {}}
                  transition={isDragging ? { repeat: Infinity, duration: 1.5 } : {}}
                  className={`
                    p-5 rounded-2xl transition-all duration-300 relative overflow-hidden
                    ${isDragging 
                      ? 'bg-gradient-to-r from-orange-500 to-pink-500 text-white shadow-lg shadow-orange-500/25' 
                      : 'bg-gradient-to-r from-stone-100 to-stone-200 text-stone-500 group-hover:from-orange-50 group-hover:to-pink-50 group-hover:text-orange-500'
                    }
                  `}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-orange-500/0 via-pink-500/0 to-purple-500/0 group-hover:from-orange-500/10 group-hover:via-pink-500/10 group-hover:to-purple-500/10 transition-all duration-300" />
                  <Upload className="w-10 h-10 relative z-10" />
                </motion.div>

                <div className="space-y-3">
                  <h3 className="text-2xl font-bold text-stone-900">
                    Share Your Journey
                  </h3>
                  <p className="text-stone-600 max-w-md">
                    Drag & drop or click to upload multiple photos. Share your travel stories with the world.
                  </p>
                </div>

                <div className="flex items-center justify-center gap-6">
                  <div className="flex items-center gap-2 text-sm text-stone-500">
                    <ImageIcon className="w-4 h-4" />
                    <span>JPG, PNG, WEBP</span>
                  </div>
                  <div className="w-px h-4 bg-stone-300" />
                  <div className="flex items-center gap-2 text-sm text-stone-500">
                    <Globe className="w-4 h-4" />
                    <span>Max 5MB each</span>
                  </div>
                </div>

                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="cursor-pointer mt-4 px-6 py-3 gradient-sunset text-white rounded-full font-medium inline-flex items-center gap-2 shadow-lg shadow-orange-500/25"
                >
                  <Camera className="w-5 h-5" />
                  Select Photos
                </motion.div>
              </div>

              {/* Floating Elements */}
              <div className="absolute top-6 left-6 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                <Sparkles className="w-6 h-6 text-orange-300" />
              </div>
              <div className="absolute bottom-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                <Sparkles className="w-6 h-6 text-pink-300" />
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="preview"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="relative bg-white rounded-3xl shadow-2xl shadow-stone-200/50 border border-stone-100 overflow-hidden"
          >
            {/* Header */}
            <div className="p-8 bg-gradient-to-r from-orange-50 to-pink-50 border-b border-stone-100">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold text-stone-900 mb-1">
                    Preview Your Photos
                  </h3>
                  <p className="text-stone-600">
                    Add details to make your story come alive
                  </p>
                </div>
                
                <div className="flex items-center gap-3">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleAddMorePhotos}
                    className="flex items-center gap-2 px-4 py-2 bg-white text-stone-700 rounded-full hover:bg-stone-50 transition-colors text-sm font-medium shadow-sm"
                    disabled={uploading}
                  >
                    <Plus className="w-4 h-4" />
                    Add More
                  </motion.button>
                  <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    accept="image/*"
                    multiple
                    onChange={handleFileSelect}
                  />
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleRemovePhoto(currentPhoto.id)}
                    className="p-2 hover:bg-white rounded-full transition-colors"
                    disabled={uploading}
                  >
                    <X className="w-5 h-5 text-stone-400" />
                  </motion.button>
                </div>
              </div>
            </div>

            {/* Photo Gallery */}
            <div className="p-8">
              <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-stone-900 to-black mb-6">
                {photos.length > 1 && (
                  <>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={prevPhoto}
                      disabled={currentPhotoIndex === 0 || uploading}
                      className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-full text-white disabled:opacity-30 transition-all z-10"
                    >
                      <ChevronLeft className="w-6 h-6" />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={nextPhoto}
                      disabled={currentPhotoIndex === photos.length - 1 || uploading}
                      className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-full text-white disabled:opacity-30 transition-all z-10"
                    >
                      <ChevronRight className="w-6 h-6" />
                    </motion.button>
                  </>
                )}
                
                <div className="relative h-72">
                  <Image
                    fill
                    src={currentPhoto.preview}
                    alt={`Preview ${currentPhotoIndex + 1}`}
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
                </div>
                
                {/* Photo Counter */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2">
                  <div className="flex items-center gap-2 px-4 py-2 bg-black/40 backdrop-blur-md rounded-full text-white text-sm">
                    <span>Photo {currentPhotoIndex + 1} of {photos.length}</span>
                  </div>
                </div>
                
                {/* Thumbnails */}
                <div className="absolute bottom-4 left-4 flex gap-1.5">
                  {photos.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentPhotoIndex(index)}
                      disabled={uploading}
                      className={`w-2 h-2 rounded-full transition-all ${
                        index === currentPhotoIndex 
                          ? 'bg-white scale-125' 
                          : 'bg-white/50 hover:bg-white/80'
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* Form */}
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-3">
                    <span className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-orange-500" />
                      What's the story behind this moment?
                    </span>
                  </label>
                  <textarea
                    value={currentPhoto.caption}
                    onChange={(e) => updateCurrentPhoto({ caption: e.target.value })}
                    placeholder="Share the story, feeling, or memory associated with this photo..."
                    className="w-full px-4 py-3 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none bg-stone-50/50 transition-all duration-200"
                    rows={3}
                    disabled={uploading}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-stone-700 mb-3">
                      <span className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-orange-500" />
                        Location
                      </span>
                    </label>
                    <input
                      type="text"
                      value={currentPhoto.location}
                      onChange={(e) => updateCurrentPhoto({ location: e.target.value })}
                      placeholder="Where was this taken?"
                      className="w-full px-4 py-3 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-stone-50/50 transition-all duration-200"
                      disabled={uploading}
                    />
                    {location && (
                      <div className="mt-2">
                        <label className="block text-sm text-stone-500 mb-1">
                          Global Location (applies to all photos)
                        </label>
                        <input
                          type="text"
                          value={location}
                          onChange={(e) => setLocation(e.target.value)}
                          placeholder="General location for all photos..."
                          className="w-full px-3 py-2 border border-stone-200 rounded-lg bg-white/50"
                          disabled={uploading}
                        />
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-stone-700 mb-3">
                      <span className="flex items-center gap-2">
                        <Tag className="w-4 h-4 text-orange-500" />
                        Tags
                      </span>
                    </label>
                    <div className="flex gap-2 mb-2">
                      <input
                        type="text"
                        value={tagInput}
                        onChange={(e) => setTagInput(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                        placeholder="Add tags like #sunset, #beach..."
                        className="flex-1 px-4 py-3 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-stone-50/50 transition-all duration-200"
                        disabled={uploading}
                      />
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        type="button"
                        onClick={addTag}
                        disabled={uploading || !tagInput.trim()}
                        className="cursor-pointer px-4 py-3 bg-gradient-to-r from-orange-100 to-pink-100 text-orange-700 rounded-xl hover:from-orange-200 hover:to-pink-200 disabled:opacity-50 transition-all"
                      >
                        Add
                      </motion.button>
                    </div>
                    
                    {(currentPhoto.tags.length > 0 || tags.length > 0) && (
                      <div className="flex flex-wrap gap-2">
                        {currentPhoto.tags.map(tag => (
                          <span
                            key={tag}
                            className="inline-flex items-center gap-1 px-3 py-1.5 bg-gradient-to-r from-orange-100 to-pink-100 text-orange-700 rounded-full text-sm"
                          >
                            #{tag}
                            <button
                              type="button"
                              onClick={() => removeTag(tag)}
                              className="hover:text-orange-900 cursor-pointer"
                              disabled={uploading}
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </span>
                        ))}
                        {tags.length > 0 && currentPhoto.tags.length === 0 && (
                          <span className="text-sm text-stone-500 px-2">
                            Using global tags
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Progress Bar */}
                {uploading && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="space-y-2"
                  >
                    <div className="flex justify-between text-sm text-stone-600">
                      <span>Uploading your photos...</span>
                      <span className="font-medium">{uploadProgress}%</span>
                    </div>
                    <div className="w-full bg-stone-200 rounded-full h-2 overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${uploadProgress}%` }}
                        className="h-2 bg-gradient-to-r from-orange-500 to-pink-500 rounded-full relative overflow-hidden"
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
                      </motion.div>
                    </div>
                  </motion.div>
                )}

                {/* Action Buttons */}
                <div className="flex justify-between items-center pt-6 border-t border-stone-100">
                  <div className="text-sm text-stone-600">
                    <span className="font-medium">{photos.length}</span> photo{photos.length !== 1 ? 's' : ''} ready to share
                  </div>
                  <div className="flex gap-3">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={clearAll}
                      disabled={uploading}
                      className="cursor-pointer px-6 py-3 border border-stone-300 text-stone-700 rounded-full hover:bg-stone-50 transition-colors disabled:opacity-50 font-medium"
                    >
                      Cancel All
                    </motion.button>
                    <motion.button
                      whileHover={uploading ? {} : { scale: 1.05 }}
                      whileTap={uploading ? {} : { scale: 0.95 }}
                      onClick={handleShare}
                      disabled={uploading || photos.length === 0}
                      className="cursor-pointer px-8 py-3 gradient-sunset text-white rounded-full font-medium hover:shadow-lg hover:shadow-orange-500/25 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                      {uploading ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          Uploading...
                        </>
                      ) : (
                        <>
                          <Save className="w-5 h-5" />
                          Share {photos.length} Photo{photos.length !== 1 ? 's' : ''}
                        </>
                      )}
                    </motion.button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* CSS for shimmer effect */}
      <style jsx global>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        .animate-shimmer {
          animation: shimmer 2s infinite;
        }
      `}</style>
    </div>
  );
}