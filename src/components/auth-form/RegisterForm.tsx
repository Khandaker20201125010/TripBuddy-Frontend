/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useActionState, useEffect, useState } from "react";
import { Field, FieldDescription, FieldGroup, FieldLabel } from "../ui/field";
import Swal from "sweetalert2";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Eye, EyeOff } from "lucide-react";
import { registerTraveler } from "@/services/auth/registerTraveler";
import InputFieldError from "../shared/InputFieldError";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { FcGoogle } from "react-icons/fc";

const RegisterForm = () => {
  const [state, formAction, isPending] = useActionState(registerTraveler, null);
  const [showPassword, setShowPassword] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const router = useRouter();
  const togglePassword = () => setShowPassword(!showPassword);

  // Preview uploaded profile image
  const handleFilePreview = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) setPreview(URL.createObjectURL(file));
  };

  const getFieldError = (fieldName: string) => {
    if (state && Array.isArray(state.errors)) {
      const error = state.errors.find((err: any) => err.field === fieldName);
      return error?.message || null;
    }
    return null;
  };

  useEffect(() => {
    if (!state) return;

    if (state.success) {
      Swal.fire({
        title: "Account Created!",
        text: "Your account has been successfully registered.",
        icon: "success",
        timer: 1500,
        showConfirmButton: false,
        timerProgressBar: true,
      });
    }

    if (state.error) {
      Swal.fire({
        title: "Registration Failed",
        text: state.error,
        icon: "error",
        confirmButtonText: "OK",
      });
    }

    // 🔥 redirect after auto-login
    if (state.success && state.redirect) {
      router.push(state.redirect);
    }
  }, [state]);

  return (
    <form
      action={formAction}
      className="space-y-6 p-6 bg-white rounded-xl shadow-md border border-gray-100 max-w-lg mx-auto"
      encType="multipart/form-data"
    >
      {/* Header */}
      <div className="text-center mb-4">
        <h2 className="text-2xl font-bold">Create Your Account</h2>
        <p className="text-gray-500 text-sm">Join Travel Buddy & meet new explorers</p>
      </div>

      {/* Profile Image Upload */}
      <Field>
        <FieldLabel htmlFor="file">Profile Image (optional)</FieldLabel>
        <div className="flex items-center gap-4 justify-between">
          <label
            htmlFor="file"
            className="px-4 py-2 bg-orange-600 text-white rounded-lg cursor-pointer hover:bg-orange-700"
          >
            Upload Image
          </label>
          <Input
            id="file"
            name="file"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFilePreview}
          />
          {preview && (
            <div className="mt-4 h-20 w-20 rounded-full ">
              <Image
                src={preview}
                alt="Preview"
                width={80}      // match the div's width
                height={80}     // match the div's height
                className="object-cover"
              />
            </div>
          )}
          <InputFieldError field="file" state={state} />
        </div>


      </Field>

      {/* Name, Email, Password */}
      <FieldGroup>
        <Field>
          <FieldLabel htmlFor="name">Full Name</FieldLabel>
          <Input id="name" name="name" type="text" placeholder="John Doe" />
          {getFieldError("name") && (
            <FieldDescription className="text-red-600">{getFieldError("name")}</FieldDescription>
          )}
        </Field>

        <Field>
          <FieldLabel htmlFor="email">Email</FieldLabel>
          <Input id="email" name="email" type="email" placeholder="you@example.com" />
          {getFieldError("email") && (
            <FieldDescription className="text-red-600">{getFieldError("email")}</FieldDescription>
          )}
        </Field>

        <Field>
          <FieldLabel htmlFor="password">Password</FieldLabel>
          <div className="relative">
            <Input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
            />
            <button
              type="button"
              onClick={togglePassword}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
            >
              {showPassword ? <Eye className="text-orange-400" /> : <EyeOff className="text-orange-400" />}
            </button>
          </div>
          {getFieldError("password") && (
            <FieldDescription className="text-red-600">{getFieldError("password")}</FieldDescription>
          )}
        </Field>
      </FieldGroup>

      {/* Submit */}
      <div className="pt-4 flex flex-col items-center gap-2">
        <Button variant="gradient" type="submit" disabled={isPending} className="w-full">
          {isPending ? "Creating Account..." : "Create Account"}
        </Button>

        <FieldDescription className="text-center">
          Already have an account?{" "}
          <a href="/login" className="text-blue-600 hover:underline">
            Sign in
          </a>
        </FieldDescription>
        <div className="h-2 ">
          <h1 className="flex items-center justify-center font-bold text-lg ">or</h1>
        </div>
        <div className="w-full">
          <Button type="button" variant="gradient" onClick={() =>
            signIn("google", {
              callbackUrl: "/",
            })
          } className="flex items-center justify-center h-9 px-3  w-full ">
            <FcGoogle size={40} />
          </Button>
        </div>
      </div>
    </form>
  );
};

export default RegisterForm;
