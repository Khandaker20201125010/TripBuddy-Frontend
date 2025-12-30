/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import Swal from "sweetalert2";
import api from "@/lib/axios";
import { X } from "lucide-react";
import Image from "next/image";
import { Textarea } from "./textarea";

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: any;
  onSuccess: () => void;
}

export function EditProfileModal({ isOpen, onClose, user, onSuccess }: EditProfileModalProps) {
  const [formData, setFormData] = useState({
    name: user.name || "",
    bio: user.bio || "",
   visitedCountries: (user.visitedCountries || []).join(", "), 
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

 const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setLoading(false);

  try {
    const payload = new FormData();
    // Prepare the data object
    const data = {
      name: formData.name,
      bio: formData.bio,
      visitedCountries: formData.visitedCountries
        .split(",")
        .map((s : any) => s.trim())
        .filter(Boolean),
    };

    // Append the JSON data as a string (common pattern for Zod validation with files)
    payload.append("data", JSON.stringify(data));

    if (imageFile) {
      payload.append("profileImage", imageFile);
    }

    await api.patch(`/user/${user.id}`, payload, { // Use /user/ instead of /users/
      headers: { "Content-Type": "multipart/form-data" },
    });

    Swal.fire("Success", "Profile updated!", "success");
    onSuccess();
    onClose();
  } catch (error: any) {
    console.error("Profile update error:", error);
    // ... error handling
  }
};

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Edit Profile</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          {/* Profile Image Preview */}
          <div className="flex flex-col items-center gap-2 mb-4">
            {imageFile ? (
              <Image width={80} height={80} src={URL.createObjectURL(imageFile)} alt="Preview" className="w-20 h-20 rounded-full object-cover" />
            ) : (
              <Image width={80} height={80} src={user.profileImage || "/placeholder-user.png"} alt="Current" className="w-20 h-20 rounded-full object-cover border" />
            )}
            <Input 
              type="file" 
              accept="image/*" 
              onChange={handleFileChange} 
              className="w-full max-w-xs text-xs"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input id="name" name="name" value={formData.name} onChange={handleChange} required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="bio">Bio</Label>
            <Textarea 
              id="bio" 
              name="bio" 
              value={formData.bio} 
              onChange={handleChange} 
              className="h-24 resize-none"
              placeholder="Tell us about your travel style..." 
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="visitedCountries">Visited Countries (comma separated)</Label>
            <Input 
              id="visitedCountries" 
              name="visitedCountries" 
              value={formData.visitedCountries} 
              onChange={handleChange} 
              placeholder="Japan, France, Brazil..." 
            />
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="ghost" onClick={onClose}>Cancel</Button>
            <Button variant="gradient" type="submit" disabled={loading}>
              {loading ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}