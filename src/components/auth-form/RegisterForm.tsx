"use client";

import { useActionState, useEffect, useState } from "react";
import { Field, FieldDescription, FieldGroup, FieldLabel } from "../ui/field";
import { toast } from "sonner";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import InputFieldError from "../shared/InputFieldError";
import Image from "next/image";
import { registerTraveler } from "@/services/auth/registerTraveler";

const RegisterForm = () => {
  const [state, formAction, isPending] = useActionState(registerTraveler, null);
  const [preview, setPreview] = useState<string | null>(null);

  // Preview selected image
  const handleFilePreview = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) setPreview(URL.createObjectURL(file));
  };

  // Show toast on registration error
  useEffect(() => {
    if (state && !state.success && state.message) {
      toast.error(state.message);
    }
    if (state && state.success) {
      toast.success("Account created successfully!");
    }
  }, [state]);

  return (
    <form
      action={formAction}
      className="space-y-6 p-6 bg-white rounded-xl shadow-md border border-gray-100"
      encType="multipart/form-data"
    >
      {/* Header */}
      <div className="text-center mb-4">
        <h2 className="text-2xl font-bold">Create Your Account</h2>
        <p className="text-gray-500 text-sm">Join Travel Buddy & meet new explorers</p>
      </div>

      {/* Image Upload */}
      <Field>
        <FieldLabel htmlFor="file">Profile Image (optional)</FieldLabel>
        <div className="flex items-center gap-4">
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
        </div>

        {preview && (
          <Image
            src={preview}
            alt="Preview"
            className="mt-4 h-24 w-24 rounded-full object-cover border"
            width={96}
            height={96}
          />
        )}

        <InputFieldError field="file" state={state} />
      </Field>

      {/* User Info */}
      <FieldGroup>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Full Name */}
          <Field>
            <FieldLabel htmlFor="name">Full Name</FieldLabel>
            <Input id="name" name="name" type="text" placeholder="John Doe" />
            <InputFieldError field="name" state={state} />
          </Field>

          {/* Email */}
          <Field>
            <FieldLabel htmlFor="email">Email</FieldLabel>
            <Input id="email" name="email" type="email" placeholder="you@example.com" />
            <InputFieldError field="email" state={state} />
          </Field>

          {/* Password */}
          <Field>
            <FieldLabel htmlFor="password">Password</FieldLabel>
            <Input id="password" name="password" type="password" placeholder="••••••••" />
            <InputFieldError field="password" state={state} />
          </Field>
        </div>
      </FieldGroup>

      {/* Submit */}
      <div className="pt-4 flex flex-col items-center gap-2">
        <Button
          variant="gradient"
          type="submit"
          disabled={isPending}
          className="w-full md:w-1/2"
        >
          {isPending ? "Creating Account..." : "Create Account"}
        </Button>

        <FieldDescription className="text-center">
          Already have an account?{" "}
          <a href="/login" className="text-blue-600 hover:underline">
            Sign in
          </a>
        </FieldDescription>
      </div>
    </form>
  );
};

export default RegisterForm;
