/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useActionState, useEffect, useState, useRef } from "react";
import { Field, FieldDescription, FieldGroup, FieldLabel } from "../ui/field";
import Swal from "sweetalert2";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Eye, EyeOff, Upload, User, Camera, X } from "lucide-react";
import { registerTraveler } from "@/services/auth/registerTraveler";
import InputFieldError from "../shared/InputFieldError";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { signIn, useSession } from "next-auth/react";
import { FcGoogle } from "react-icons/fc";

const RegisterForm = () => {
  const [state, formAction, isPending] = useActionState(registerTraveler, null);
  const [showPassword, setShowPassword] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const router = useRouter();
  const { data: session } = useSession();
  const autoLoginAttempted = useRef(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const togglePassword = () => setShowPassword(!showPassword);

  // Handle drag events
  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files && files[0]) {
      handleFileSelect(files[0]);
    }
  };

  // Handle file selection
  const handleFileSelect = (file: File) => {
    // Validate file type
    if (!file.type.match("image.*")) {
      Swal.fire({
        title: "Invalid File",
        text: "Please select an image file (JPEG, PNG, GIF, etc.)",
        icon: "error",
        confirmButtonText: "OK",
      });
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      Swal.fire({
        title: "File Too Large",
        text: "Please select an image smaller than 5MB",
        icon: "error",
        confirmButtonText: "OK",
      });
      return;
    }

    setSelectedFile(file);
    const previewUrl = URL.createObjectURL(file);
    setPreview(previewUrl);

    // Update the file input
    if (fileInputRef.current) {
      const dataTransfer = new DataTransfer();
      dataTransfer.items.add(file);
      fileInputRef.current.files = dataTransfer.files;
    }
  };

  // Handle file input change
  const handleFileInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  // Remove selected image
  const removeImage = () => {
    setPreview(null);
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const getFieldError = (fieldName: string) => {
    if (state && Array.isArray(state.errors)) {
      const error = state.errors.find((err: any) => err.field === fieldName);
      return error?.message || null;
    }
    return null;
  };

  // Auto-login with NextAuth after successful registration
  const attemptAutoLogin = async (email: string, password: string) => {
    try {
      console.log("Attempting auto-login with credentials:", email);
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      console.log("Auto-login result:", result);

      if (result?.error) {
        console.error("Auto-login failed:", result.error);
        Swal.fire({
          title: "Account Created!",
          text: "Your account was created successfully. Please login with your credentials.",
          icon: "success",
          confirmButtonText: "Go to Login",
        }).then(() => {
          router.push("/login");
        });
        return false;
      } else {
        // Login successful - force a complete refresh to update session
        Swal.fire({
          title: "Welcome!",
          text: "Your account has been created and you are now logged in.",
          icon: "success",
          timer: 1000,
          showConfirmButton: false,
        }).then(() => {
          // Force a hard page refresh to update all session data
          window.location.href = "/";
        });
        return true;
      }
    } catch (error) {
      console.error("Auto-login error:", error);
      Swal.fire({
        title: "Account Created!",
        text: "Your account was created successfully. Please login.",
        icon: "success",
        confirmButtonText: "Go to Login",
      }).then(() => {
        router.push("/login");
      });
      return false;
    }
  };

  useEffect(() => {
    if (!state || autoLoginAttempted.current) return;

    if (state.success && state.email && state.password) {
      console.log("Registration successful, attempting auto-login...");
      autoLoginAttempted.current = true;

      // Use setTimeout to ensure state is fully updated
      setTimeout(async () => {
        const success = await attemptAutoLogin(state.email, state.password);
        if (!success) {
          // Reset if failed
          autoLoginAttempted.current = false;
        }
      }, 100);
    }

    if (state.error) {
      Swal.fire({
        title: "Registration Failed",
        text: state.error,
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  }, [state, router]);

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    autoLoginAttempted.current = false;

    // Create FormData from the form
    const form = e.currentTarget;
    const formData = new FormData(form);

    // Call the server action
    const result = await registerTraveler(null, formData);

    // Update state manually since useActionState doesn't trigger immediately
    if (result.success) {
      // Trigger auto-login
      setTimeout(async () => {
        const success = await attemptAutoLogin(result.email, result.password);
        if (success) {
          // Force a page refresh to update navbar
          setTimeout(() => {
            window.location.href = "/";
          }, 100);
        }
      }, 100);
    } else {
      Swal.fire({
        title: "Registration Failed",
        text: result.error || "Registration failed",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-5 p-6 bg-white rounded-xl shadow-md border border-gray-100 max-w-md mx-auto"
      encType="multipart/form-data"
    >
      {/* Header */}
      <div className="text-center mb-2">
        <h2 className="text-2xl font-bold text-gray-800">Create Account</h2>
        <p className="text-gray-500 text-sm mt-1">Join Travel Buddy community</p>
      </div>

      {/* Compact Profile Image Upload */}
      <Field>
        <div className="flex flex-col items-center">
          <div className="relative group mb-3">
            {/* Profile Image Container */}
            <div
              className={`relative w-24 h-24 rounded-full border-2 ${isDragging ? "border-orange-500" : preview ? "border-orange-300" : "border-gray-200"
                } overflow-hidden bg-gray-50 cursor-pointer transition-all duration-200 ${!preview ? "hover:border-orange-400 hover:bg-orange-50" : ""
                }`}
              onClick={() => fileInputRef.current?.click()}
              onDragEnter={handleDragEnter}
              onDragLeave={handleDragLeave}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
            >
              {preview ? (
                <>
                  <Image
                    src={preview}
                    alt="Profile preview"
                    fill
                    className="object-cover"
                    sizes="96px"
                  />
                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                    <Camera className="w-6 h-6 text-white" />
                  </div>
                </>
              ) : (
                <div className="flex items-center justify-center h-full">
                  <User className="w-10 h-10 text-gray-400" />
                </div>
              )}

              {/* Upload Indicator */}
              {!preview && (
                <div className="absolute -bottom-1 -right-1 bg-orange-500 text-white rounded-full p-1.5">
                  <Upload className="w-3.5 h-3.5" />
                </div>
              )}

              {/* Remove Button */}
              {preview && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeImage();
                  }}
                  className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors shadow-sm"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>

            {/* Drag Indicator */}
            {isDragging && (
              <div className="absolute inset-0 rounded-full border-4 border-dashed border-orange-300 animate-pulse"></div>
            )}
          </div>

          {/* Upload Button and Text */}
          <div className="text-center space-y-2 w-full">
            <div className="flex flex-col sm:flex-row gap-2 justify-center">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-4 py-2 bg-gray-100 text-gray-700 text-sm rounded-lg hover:bg-gray-200 transition-colors font-medium flex items-center justify-center gap-2"
              >
                <Camera className="w-4 h-4" />
                {preview ? "Change Photo" : "Upload Photo"}
              </button>

              {preview && (
                <button
                  type="button"
                  onClick={removeImage}
                  className="px-4 py-2 bg-red-50 text-red-600 text-sm rounded-lg hover:bg-red-100 transition-colors font-medium flex items-center justify-center gap-2"
                >
                  <X className="w-4 h-4" />
                  Remove
                </button>
              )}
            </div>

            <p className="text-xs text-gray-500">
              {preview ? (
                <>
                  <span className="block truncate max-w-[200px] mx-auto">
                    {selectedFile?.name || "Uploaded image"}
                  </span>
                  {selectedFile?.size && (
                    <span className="text-gray-400">
                      {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                    </span>
                  )}
                </>
              ) : (
                "Click to upload or drag & drop"
              )}
            </p>

            <p className="text-xs text-gray-400">
              JPG, PNG, GIF • Max 5MB
            </p>
          </div>

          {/* Hidden File Input */}
          <input
            ref={fileInputRef}
            id="file"
            name="file"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileInputChange}
          />

          <InputFieldError field="file" state={state} />
        </div>
      </Field>

      {/* Form Fields */}
      <FieldGroup className="space-y-4">
        <Field>
          <FieldLabel htmlFor="name" className="text-gray-700 text-sm font-medium">
            Full Name
          </FieldLabel>
          <Input
            id="name"
            name="name"
            type="text"
            placeholder="John Doe"
            required
            className="mt-1"
          />
          {getFieldError("name") && (
            <FieldDescription className="text-red-600 text-xs mt-1">
              {getFieldError("name")}
            </FieldDescription>
          )}
        </Field>

        <Field>
          <FieldLabel htmlFor="email" className="text-gray-700 text-sm font-medium">
            Email Address
          </FieldLabel>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="you@example.com"
            required
            className="mt-1"
          />
          {getFieldError("email") && (
            <FieldDescription className="text-red-600 text-xs mt-1">
              {getFieldError("email")}
            </FieldDescription>
          )}
        </Field>

        <Field>
          <FieldLabel htmlFor="password" className="text-gray-700 text-sm font-medium">
            Password
          </FieldLabel>
          <div className="relative mt-1">
            <Input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              required
              minLength={6}
              className="pr-10"
            />
            <button
              type="button"
              onClick={togglePassword}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
            >
              {showPassword ? (
                <EyeOff className="w-4.5 h-4.5" />
              ) : (
                <Eye className="w-4.5 h-4.5" />
              )}
            </button>
          </div>
          {getFieldError("password") && (
            <FieldDescription className="text-red-600 text-xs mt-1">
              {getFieldError("password")}
            </FieldDescription>
          )}
          <p className="text-xs text-gray-400 mt-1.5">
            At least 6 characters
          </p>
        </Field>
      </FieldGroup>

      {/* Submit Section */}
      <div className="pt-2 space-y-4">
        {/* Submit Button */}
        <Button
          variant="gradient"
          type="submit"
          disabled={isPending}
          className="w-full h-11 text-sm font-semibold rounded-lg"
        >
          {isPending ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Creating Account...
            </span>
          ) : "Create Account"}
        </Button>

        {/* Or Divider */}
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200"></div>
          </div>
          <div className="relative flex justify-center text-xs">
            <span className="px-3 bg-white text-gray-500">Or continue with</span>
          </div>
        </div>

        {/* Google Login */}
        <Button
          type="button"
          variant="outline"
          onClick={() => signIn("google", { callbackUrl: "/" })}
          disabled={isPending}
          className="w-full h-11 border-gray-200 hover:bg-gray-50"
        >
          <FcGoogle className="w-5 h-5 mr-2" />
          <span className="text-gray-700 font-medium text-sm">Google</span>
        </Button>

        {/* Sign In Link */}
        <p className="text-center text-sm text-gray-600 pt-2">
          Already have an account?{" "}
          <a
            href="/login"
            className="text-orange-600 font-medium hover:text-orange-700 hover:underline"
          >
            Sign in
          </a>
        </p>
      </div>
    </form>
  );
};

export default RegisterForm;