/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { 
  Dialog, DialogContent, DialogHeader, 
  DialogTitle, DialogTrigger, DialogFooter 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Edit3, Camera, Loader2 } from "lucide-react";
import api from "@/lib/axios";
import { toast } from "sonner";
import Image from "next/image";

interface EditAdminModalProps {
  profile: any;
  onUpdate: () => void;
}

export default function EditAdminModal({ profile, onUpdate }: EditAdminModalProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const { register, handleSubmit, reset } = useForm({
    defaultValues: {
      name: "",
      bio: "",
    },
  });

  // Sync form when profile data arrives
  useEffect(() => {
    if (profile) {
      reset({
        name: profile.name,
        bio: profile.bio || "",
      });
      setPreviewImage(profile.profileImage);
    }
  }, [profile, reset]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

 const onSubmit = async (values: any) => {
  setLoading(true);
  try {
    const formData = new FormData();
    
    // Append text fields individually
    formData.append("name", values.name);
    formData.append("bio", values.bio);

    // Append the file if selected
    if (selectedFile) {
      // Note: Ensure "file" matches the key your backend Multer is looking for
      formData.append("file", selectedFile); 
    }

    // DEBUG: Log the formData to see what's being sent
    // for (let [key, value] of formData.entries()) { console.log(key, value); }

    await api.patch(`/user/${profile.id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    toast.success("Profile updated successfully!");
    setOpen(false);
    onUpdate(); 
  } catch (error: any) {
    console.error("Update Error:", error);
    toast.error(error.response?.data?.message || "Update failed. Check console.");
  } finally {
    setLoading(false);
  }
};

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="secondary" className="rounded-full px-6 bg-linear-to-r from-orange-600 to-orange-800 hover:bg-slate-700 text-white gap-2">
          <Edit3 size={16} /> Edit Profile
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-white">
        <DialogHeader><DialogTitle>Edit Admin Profile</DialogTitle></DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="flex flex-col items-center gap-2">
            <div className="relative w-24 h-24 group cursor-pointer">
              <Image 
                src={previewImage || "/placeholder-user.png"} 
                alt="Avatar" fill className="rounded-full object-cover border" 
              />
              <label htmlFor="img-up" className="absolute inset-0 bg-black/40 rounded-full opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                <Camera className="text-white" />
              </label>
              <input id="img-up" type="file" className="hidden" onChange={handleImageChange} accept="image/*" />
            </div>
          </div>
          <div className="space-y-4">
            <div>
              <Label>Full Name</Label>
              <Input {...register("name")} />
            </div>
            <div>
              <Label>Bio</Label>
              <Textarea {...register("bio")} className="resize-none" />
            </div>
          </div>
          <DialogFooter>
            <Button variant={"gradient"} type="submit" disabled={loading} className="w-full">
              {loading && <Loader2 className=" mr-2 h-4 w-4 animate-spin" />} Save Changes
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}