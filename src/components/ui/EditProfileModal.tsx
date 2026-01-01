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
import { X, Plus } from "lucide-react";

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: any;
  onSuccess: () => void;
}

export function EditProfileModal({ isOpen, onClose, user, onSuccess }: EditProfileModalProps) {
  const { update } = useSession();
  const [formData, setFormData] = useState({
    name: user.name || "",
    bio: user.bio || "",
    visitedCountries: (user.visitedCountries || []).join(", "),
    newInterest: "",
  });
  const [interests, setInterests] = useState<string[]>(user.interests || []);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  // Predefined list of travel interests to suggest
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
    }
  }, [isOpen, user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
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
    setLoading(true);

    try {
      const payload = new FormData();
      
      // Prepare the data object
      const data = {
        name: formData.name,
        bio: formData.bio,
        visitedCountries: formData.visitedCountries
          .split(",")
          .map((s: string) => s.trim())
          .filter(Boolean),
        interests: interests,
      };

      console.log("Submitting data:", data);

      // Append the JSON data as a string
      payload.append("data", JSON.stringify(data));

      // IMPORTANT: Use "file" as the field name (not "profileImage")
      if (imageFile) {
        payload.append("file", imageFile);
      }

      const response = await api.patch(`/user/${user.id}`, payload, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      console.log("Update response:", response);

      // Update the NextAuth session with new user data
      if (response.data.data) {
        await update({
          user: {
            name: response.data.data.name || user.name,
            email: user.email,
            image: response.data.data.profileImage || user.profileImage,
          }
        });
      }

      Swal.fire({
        title: "Success!",
        text: "Profile updated successfully!",
        icon: "success",
        timer: 2000,
        showConfirmButton: false
      });
      
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
          {/* Profile Image Preview */}
          <div className="flex flex-col items-center gap-3 mb-4">
            {imageFile ? (
              <div className="relative w-24 h-24">
                <Image 
                  width={96} 
                  height={96} 
                  src={URL.createObjectURL(imageFile)} 
                  alt="Preview" 
                  className="w-full h-full rounded-full object-cover border-2 border-primary/20" 
                />
              </div>
            ) : (
              <div className="relative w-24 h-24">
                <Image 
                  width={96} 
                  height={96} 
                  src={user.profileImage || "/placeholder-user.png"} 
                  alt="Current" 
                  className="w-full h-full rounded-full object-cover border-2 border-primary/20" 
                />
              </div>
            )}
            <div className="text-center">
              <Label htmlFor="profileImage" className="text-sm text-muted-foreground">
                Profile Picture
              </Label>
              <Input 
                id="profileImage"
                type="file" 
                accept="image/*" 
                onChange={handleFileChange} 
                className="w-full max-w-xs text-xs mt-1"
              />
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
              <div className="flex flex-wrap gap-2 p-3 bg-muted/30 rounded-lg">
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
                      className="ml-1 hover:text-destructive transition-colors"
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
                disabled={interests.length >= 20}
              />
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={addInterest}
                disabled={!formData.newInterest.trim() || interests.length >= 20}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>

            {/* Suggested Interests */}
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Suggestions:</p>
              <div className="flex flex-wrap gap-2">
                {suggestedInterests.map((interest) => (
                  <Badge
                    key={interest}
                    variant={interests.includes(interest) ? "default" : "outline"}
                    className="cursor-pointer hover:bg-primary/10 transition-colors"
                    onClick={() => addSuggestedInterest(interest)}
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
            />
            <p className="text-xs text-muted-foreground">
              Separate countries with commas
            </p>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button 
              type="button" 
              variant="outline" 
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button 
              variant="default" 
              type="submit" 
              disabled={loading}
              className="bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
            >
              {loading ? (
                <>
                  <span className="animate-spin mr-2">⟳</span>
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