/* eslint-disable @typescript-eslint/no-explicit-any */
// components/ui/EditAdminModal.tsx
"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { X, Settings, Upload, User, Globe, Palette, Save, Loader2 } from "lucide-react";
import api from "@/lib/axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { toast, Toaster } from "sonner";
import { getImageSrc } from "@/helpers/getImageSrc ";


interface EditAdminModalProps {
  profile: any;
  onUpdate: () => void;
}

export function EditAdminModal({ profile, onUpdate }: EditAdminModalProps) {
  const { data: session, update: updateSession } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    bio: "",
    interests: "",
    visitedCountries: "",
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  // Initialize form data when profile changes or modal opens
  useEffect(() => {
    if (profile && isOpen) {
      setFormData({
        name: profile?.name || "",
        bio: profile?.bio || "",
        interests: profile?.interests?.join(", ") || "",
        visitedCountries: profile?.visitedCountries?.join(", ") || "",
      });
      setPreviewImage(null);
      setSelectedFile(null);
      setUploadProgress(0);
    }
  }, [profile, isOpen]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast.error("Please select an image file");
        return;
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image size should be less than 5MB");
        return;
      }

      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadstart = () => {
        setUploadProgress(10);
      };
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
        setUploadProgress(100);
        setTimeout(() => setUploadProgress(0), 500);
      };
      reader.onerror = () => {
        toast.error("Failed to load image");
        setUploadProgress(0);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    const loadingToast = toast.loading("Updating admin profile...");

    try {
      const formDataToSend = new FormData();
      const dataToSend = {
        ...formData,
        interests: formData.interests.split(",")
          .map((item) => item.trim())
          .filter(Boolean),
        visitedCountries: formData.visitedCountries.split(",")
          .map((item) => item.trim())
          .filter(Boolean),
      };

      formDataToSend.append("data", JSON.stringify(dataToSend));

      if (selectedFile) {
        formDataToSend.append("file", selectedFile);
      }

      const res = await api.patch(`/user/${profile.id}`, formDataToSend, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total) {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            setUploadProgress(percentCompleted);
          }
        },
      });

      if (res.data.success) {
        // Update the session with new user data
        await updateSession({
          ...session,
          user: {
            ...session?.user,
            name: formData.name,
            image: res.data.data.profileImage,
          },
        });

        // Fetch updated profile data
        onUpdate();
        
        toast.success("Profile updated successfully!", {
          id: loadingToast,
          duration: 3000,
        });
        
        setIsOpen(false);
      }
    } catch (error: any) {
      console.error("Failed to update profile:", error);
      toast.error(error.response?.data?.message || "Failed to update profile", {
        id: loadingToast,
        duration: 5000,
      });
    } finally {
      setLoading(false);
      setUploadProgress(0);
    }
  };

  const currentImage = previewImage || getImageSrc(profile?.profileImage || "/images/userProfile.jpg");
  const interestsArray = formData.interests.split(",").map(i => i.trim()).filter(Boolean);
  const countriesArray = formData.visitedCountries.split(",").map(c => c.trim()).filter(Boolean);

  return (
    <>
      <Toaster position="top-right" richColors />
      
      {/* Edit Button - Enhanced with hover effect */}
      <Button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5 active:translate-y-0 group"
      >
        <Settings size={18} className="group-hover:rotate-12 transition-transform" />
        <span>Edit Profile</span>
      </Button>

      {/* Modal with Backdrop */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            />
            
            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
            >
              <div className="bg-gradient-to-b from-white to-gray-50 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden shadow-2xl border border-gray-200">
                {/* Header */}
                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-white relative overflow-hidden">
                  <div className="absolute -top-24 -right-24 w-48 h-48 bg-white/10 rounded-full blur-3xl" />
                  <div className="relative flex items-center justify-between">
                    <div>
                      <h2 className="text-2xl font-bold flex items-center gap-2">
                        <User className="w-6 h-6" />
                        Edit Admin Profile
                      </h2>
                      <p className="text-blue-100 mt-1">Update your administrator information</p>
                    </div>
                    <button
                      onClick={() => setIsOpen(false)}
                      className="p-2 hover:bg-white/20 rounded-full transition-colors"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="overflow-y-auto max-h-[calc(90vh-120px)]">
                  <div className="p-6 space-y-6">
                    {/* Profile Image Upload Section */}
                    <Card className="border-2 border-dashed border-gray-200 hover:border-blue-300 transition-colors">
                      <CardContent className="p-6">
                        <div className="flex flex-col items-center gap-6">
                          <div className="relative group">
                            <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-xl ring-4 ring-blue-100">
                              <Image
                                src={currentImage}
                                alt="Profile preview"
                                fill
                                className="object-cover group-hover:scale-110 transition-transform duration-300"
                                sizes="128px"
                              />
                              {uploadProgress > 0 && uploadProgress < 100 && (
                                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                                  <div className="text-white text-sm font-semibold">
                                    {uploadProgress}%
                                  </div>
                                </div>
                              )}
                            </div>
                            <div className="absolute -bottom-2 -right-2 bg-gradient-to-r from-blue-500 to-purple-500 p-2 rounded-full border-4 border-white shadow-lg">
                              <User className="h-4 w-4 text-white" />
                            </div>
                          </div>
                          
                          <div className="text-center">
                            <Label htmlFor="profile-image" className="cursor-pointer">
                              <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg transition-colors">
                                <Upload className="h-4 w-4" />
                                <span className="font-medium">Change Profile Photo</span>
                              </div>
                              <input
                                id="profile-image"
                                type="file"
                                accept="image/*"
                                onChange={handleFileChange}
                                className="hidden"
                              />
                            </Label>
                            <p className="text-sm text-gray-500 mt-2">
                              Recommended: Square image, max 5MB
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Name & Bio Section */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="name" className="flex items-center gap-2 text-gray-700 mb-2">
                            <User className="h-4 w-4" />
                            Full Name
                          </Label>
                          <Input
                            id="name"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            placeholder="John Doe"
                            required
                            className="h-12"
                          />
                        </div>

                        <div>
                          <Label htmlFor="bio" className="flex items-center gap-2 text-gray-700 mb-2">
                            <Palette className="h-4 w-4" />
                            Bio
                          </Label>
                          <Textarea
                            id="bio"
                            value={formData.bio}
                            onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                            placeholder="Tell us about yourself..."
                            rows={4}
                            className="resize-none"
                          />
                          <p className="text-xs text-gray-500 mt-1">
                            {formData.bio.length}/200 characters
                          </p>
                        </div>
                      </div>

                      {/* Preview Card */}
                      <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-100">
                        <CardContent className="p-6">
                          <h3 className="font-semibold text-gray-700 mb-4 flex items-center gap-2">
                            <User className="h-4 w-4" />
                            Preview
                          </h3>
                          <div className="space-y-3">
                            <div className="flex items-center gap-3">
                              <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold">
                                {formData.name.charAt(0).toUpperCase()}
                              </div>
                              <div>
                                <p className="font-bold text-gray-800">{formData.name || "Your Name"}</p>
                                <p className="text-sm text-gray-600">System Administrator</p>
                              </div>
                            </div>
                            {formData.bio && (
                              <p className="text-sm text-gray-600 line-clamp-2">{formData.bio}</p>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    </div>

                  

                    {/* Progress Bar */}
                    {uploadProgress > 0 && uploadProgress < 100 && (
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm text-gray-600">
                          <span>Uploading image...</span>
                          <span>{uploadProgress}%</span>
                        </div>
                        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${uploadProgress}%` }}
                            className="h-full bg-gradient-to-r from-blue-500 to-purple-500"
                          />
                        </div>
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex gap-3 pt-6 border-t border-gray-100">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setIsOpen(false)}
                        className="flex-1 h-12 text-gray-600"
                        disabled={loading}
                      >
                        Cancel
                      </Button>
                      <Button
                        type="submit"
                        className="flex-1 h-12 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl"
                        disabled={loading}
                      >
                        {loading ? (
                          <>
                            <Loader2 className="h-4 w-4 animate-spin mr-2" />
                            Saving...
                          </>
                        ) : (
                          <>
                            <Save className="h-4 w-4 mr-2" />
                            Save Changes
                          </>
                        )}
                      </Button>
                    </div>

                    {/* Tips */}
                    <div className="text-sm text-gray-500 bg-blue-50 p-4 rounded-lg">
                      <p className="font-medium text-blue-700 mb-1">💡 Tips:</p>
                      <ul className="space-y-1">
                        <li>• Use commas to separate multiple interests or countries</li>
                        <li>• Profile image updates will be reflected immediately</li>
                        <li>• Changes are saved to your administrator profile</li>
                      </ul>
                    </div>
                  </div>
                </form>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}