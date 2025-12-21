/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { Field, FieldDescription, FieldGroup, FieldLabel } from "../ui/field";
import Swal from "sweetalert2";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Eye, EyeOff } from "lucide-react";
import { FcGoogle } from 'react-icons/fc';
import { signIn } from "next-auth/react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

const LoginForm = ({ redirect }: { redirect?: string }) => {
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get("redirect");
  const [isPending, setIsPending] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const togglePassword = () => setShowPassword(!showPassword);

 const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  setIsPending(true);

  const formData = new FormData(e.currentTarget);
  const email = formData.get("email");
  const password = formData.get("password");

  // Decode the URL properly and ensure it starts with a slash to stay on-site
  const rawRedirect = searchParams.get("redirect");
  const targetRedirect = rawRedirect ? decodeURIComponent(rawRedirect) : "/";

  const result = await signIn("credentials", {
    email,
    password,
    redirect: false, 
  });

  if (result?.error) {
    // ... error handling
  } else {
    Swal.fire({
      title: "Login Successful!",
      icon: "success",
      timer: 1200,
      showConfirmButton: false,
    });

    // Use window.location.replace to prevent the user from clicking "back" into the login form
    setTimeout(() => {
      window.location.replace(targetRedirect);
    }, 1200);
  }
};

  return (
    <form onSubmit={handleLogin} className="space-y-4">
      <FieldGroup>
        {/* Email */}
        <Field>
          <FieldLabel htmlFor="email">Email</FieldLabel>
          <Input id="email" name="email" type="email" placeholder="m@example.com" required />
        </Field>

        {/* Password */}
        <Field>
          <FieldLabel htmlFor="password">Password</FieldLabel>
          <div className="relative">
            <Input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              required
            />
            <button
              type="button"
              onClick={togglePassword}
              className="absolute cursor-pointer right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
            >
              {showPassword ? <Eye className="text-orange-400" /> : <EyeOff className="text-orange-400" />}
            </button>
          </div>
        </Field>
        {/* Submit Button */}
        <FieldGroup className="mt-6">
          <Button
            className="w-full cursor-pointer h-11"
            variant="gradient"
            type="submit"
            disabled={isPending}
          >
            {isPending ? "Logging in..." : "Login"}
          </Button>
        </FieldGroup>

        {/* Modern "Or" Divider */}
        <div className="relative w-full flex items-center py-4">
          <div className="grow border-t border-gray-200"></div>
          <span className="shrink mx-4 text-gray-400 text-sm font-medium uppercase tracking-wider">
            or
          </span>
          <div className="grow border-t border-gray-200"></div>
        </div>

        {/* Google Login Button */}
        <div className="w-full">
          <Button
            type="button"
            variant="outline" // Changed to outline to differentiate from the main Login button
            onClick={() => signIn("google", { callbackUrl: "/" })}
            className="flex items-center justify-center gap-3 h-11 w-full border-gray-200 hover:bg-gray-50 transition-all"
          >
            <FcGoogle size={24} />
            <span className="text-gray-700 font-medium">Continue with Google</span>
          </Button>
        </div>
      </FieldGroup>
    </form>
  );
};

export default LoginForm;