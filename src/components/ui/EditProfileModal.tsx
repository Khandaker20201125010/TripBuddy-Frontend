/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useSession } from "next-auth/react";
import Swal from "sweetalert2";
import api from "@/lib/axios";
import Image from "next/image";
import { Textarea } from "./textarea";
import { X, Plus, Upload, Loader2 } from "lucide-react";

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: any;
  onSuccess: () => void;
}

export function EditProfileModal({ isOpen, onClose, user, onSuccess }: EditProfileModalProps) {
  const { data: session, update } = useSession(); // Get session data
  const [formData, setFormData] = useState({
    name: user.name || "",
    bio: user.bio || "",
    visitedCountries: (user.visitedCountries || []).join(", "),
    newInterest: "",
  });
  const [interests, setInterests] = useState<string[]>(user.interests || []);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const suggestedInterests = [
    "Hiking", "Beaches", "Cultural", "Adventure", "Food", "History",
    "Photography", "Wildlife", "Sightseeing", "Luxury", "Backpacking",
    "Road Trips", "Mountains", "Islands", "Cities", "Nature", "Spiritual",
    "Festivals", "Museums", "Shopping", "Nightlife", "Family", "Solo Travel",
    "Couples", "Group Travel", "Budget", "Wellness", "Cruises", "Winter Sports",
    "Water Sports", "Camping", "Local Cuisine", "Architecture", "Art"
  ];

  useEffect(() => {
    if (isOpen) {
      setFormData({
        name: user.name || "",
        bio: user.bio || "",
        visitedCountries: (user.visitedCountries || []).join(", "),
        newInterest: "",
      });
      setInterests(user.interests || []);
      setImageFile(null);
      setPreviewUrl(null);
    }
  }, [isOpen, user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      // Validate file type
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
      if (!validTypes.includes(file.type)) {
        Swal.fire({
          title: 'Invalid File',
          text: 'Please select a valid image file (JPEG, PNG, GIF, WebP)',
          icon: 'error'
        });
        return;
      }
      
      // Validate file size (5MB)
      if (file.size > 5 * 1024 * 1024) {
        Swal.fire({
          title: 'File Too Large',
          text: 'Image size should be less than 5MB',
          icon: 'error'
        });
        return;
      }
      
      setImageFile(file);
      // Create preview URL
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const addInterest = () => {
    const interest = formData.newInterest.trim();
    if (interest && !interests.includes(interest)) {
      setInterests([...interests, interest]);
      setFormData({ ...formData, newInterest: "" });
    }
  };

  const removeInterest = (interestToRemove: string) => {
    setInterests(interests.filter(interest => interest !== interestToRemove));
  };

  const addSuggestedInterest = (interest: string) => {
    if (!interests.includes(interest)) {
      setInterests([...interests, interest]);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addInterest();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (loading) return;
    
    setLoading(true);

    try {
      const formDataToSend = new FormData();
      
      // Prepare the data object
      const data = {
        name: formData.name.trim(),
        bio: formData.bio.trim(),
        visitedCountries: formData.visitedCountries
          .split(",")
          .map((s: string) => s.trim())
          .filter(Boolean),
        interests: interests,
      };

      console.log("Submitting data:", data);

      // Append the JSON data as a string
      formDataToSend.append("data", JSON.stringify(data));

      // IMPORTANT: Use "file" as the field name (matching your backend)
      if (imageFile) {
        formDataToSend.append("file", imageFile);
      }

      // Get access token directly from session
      const accessToken = session?.accessToken;
      
      if (!accessToken) {
        throw new Error("No access token found");
      }

      const response = await api.patch(`/user/${user.id}`, formDataToSend, {
        headers: { 
          "Content-Type": "multipart/form-data",
          "Authorization": `Bearer ${accessToken}`
        },
      });

      console.log("Update response:", response.data);

      // Update the NextAuth session with ALL new user data
      if (response.data.data) {
        await update({
          // Update the user object in session
          user: {
            ...session?.user, // Keep existing user data
            name: response.data.data.name || user.name,
            image: response.data.data.profileImage || user.profileImage,
            // Update other fields if needed
            bio: response.data.data.bio || user.bio,
            interests: response.data.data.interests || user.interests,
            visitedCountries: response.data.data.visitedCountries || user.visitedCountries,
          },
          // Keep the access token and other session data
          accessToken: session?.accessToken,
        });
        
        // Also force a session refresh
        await fetch('/api/auth/session?update=true');
      }

      Swal.fire({
        title: "Success!",
        text: "Profile updated successfully!",
        icon: "success",
        timer: 2000,
        showConfirmButton: false
      });
      
      // Clean up preview URL
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
      
      onSuccess();
      onClose();
    } catch (error: any) {
      console.error("Profile update error:", error);
      console.error("Error details:", error.response?.data);
      
      Swal.fire(
        "Error",
        error.response?.data?.message || "Failed to update profile",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Profile</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 mt-2">
          {/* Profile Image Section */}
          <div className="flex flex-col items-center gap-4 mb-6">
            <div className="relative group">
              {/* Profile Image Preview */}
              <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-lg">
                <Image 
                  src={previewUrl || user.profileImage || "/images/userProfile.jpg"} 
                  alt="Profile" 
                  fill
                  className="object-cover"
                  sizes="128px"
                />
                
                {/* Upload Overlay */}
                <label 
                  htmlFor="profileImage"
                  className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                >
                  <Upload className="w-8 h-8 text-white" />
                </label>
              </div>
              
              {/* Edit Indicator */}
              {imageFile && (
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center animate-pulse">
                  <span className="text-white text-xs">✓</span>
                </div>
              )}
            </div>
            
            <div className="text-center">
              <Label 
                htmlFor="profileImage" 
                className="text-sm font-medium text-gray-700 cursor-pointer inline-flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              >
                <Upload className="w-4 h-4" />
                Change Profile Picture
              </Label>
              <Input 
                id="profileImage"
                type="file" 
                accept="image/*" 
                onChange={handleFileChange} 
                className="hidden"
              />
              <p className="text-xs text-gray-500 mt-2">
                Supports JPG, PNG, WebP (max 5MB)
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="name">Full Name *</Label>
            <Input 
              id="name" 
              name="name" 
              value={formData.name} 
              onChange={handleChange} 
              required 
              placeholder="Enter your full name"
              disabled={loading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="bio">Bio</Label>
            <Textarea 
              id="bio" 
              name="bio" 
              value={formData.bio} 
              onChange={handleChange} 
              className="min-h-[100px] resize-none"
              placeholder="Tell us about your travel style, favorite destinations, or travel philosophy..." 
              disabled={loading}
            />
          </div>

          {/* Interests Section */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label htmlFor="interests">Travel Interests</Label>
              <span className="text-xs text-muted-foreground">
                {interests.length}/20
              </span>
            </div>
            
            {/* Current Interests */}
            {interests.length > 0 && (
              <div className="flex flex-wrap gap-2 p-3 bg-gray-50 rounded-lg">
                {interests.map((interest, index) => (
                  <Badge 
                    key={index} 
                    variant="secondary"
                    className="flex items-center gap-1 px-3 py-1.5"
                  >
                    {interest}
                    <button
                      type="button"
                      onClick={() => removeInterest(interest)}
                      className="ml-1 hover:text-red-500 transition-colors"
                      disabled={loading}
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}

            {/* Add Interest Input */}
            <div className="flex gap-2">
              <Input
                id="newInterest"
                name="newInterest"
                value={formData.newInterest}
                onChange={handleChange}
                onKeyPress={handleKeyPress}
                placeholder="Add an interest (e.g., Hiking, Food, Culture)"
                className="flex-1"
                disabled={interests.length >= 20 || loading}
              />
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={addInterest}
                disabled={!formData.newInterest.trim() || interests.length >= 20 || loading}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>

            {/* Suggested Interests */}
            <div className="space-y-2">
              <p className="text-sm text-gray-600">Suggested interests:</p>
              <div className="flex flex-wrap gap-2">
                {suggestedInterests.map((interest) => (
                  <Badge
                    key={interest}
                    variant={interests.includes(interest) ? "default" : "outline"}
                    className="cursor-pointer hover:bg-blue-50 transition-colors"
                    onClick={() => !loading && addSuggestedInterest(interest)}
                  >
                    {interest}
                    {interests.includes(interest) && (
                      <X className="h-3 w-3 ml-1" />
                    )}
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="visitedCountries">Visited Countries (comma separated)</Label>
            <Input 
              id="visitedCountries" 
              name="visitedCountries" 
              value={formData.visitedCountries} 
              onChange={handleChange} 
              placeholder="Japan, France, Brazil, Italy, Thailand..." 
              disabled={loading}
            />
            <p className="text-xs text-gray-500">
              Separate countries with commas (e.g., Japan, France, Brazil)
            </p>
          </div>

          <div className="flex justify-end gap-3 pt-6 border-t border-gray-200">
            <Button 
              type="button" 
              variant="outline" 
              onClick={onClose}
              disabled={loading}
              className="min-w-[100px]"
            >
              Cancel
            </Button>
            <Button 
              variant="gradient" 
              type="submit" 
              disabled={loading}
              className="min-w-[140px] bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}