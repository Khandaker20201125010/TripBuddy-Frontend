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
import { usePathname, useRouter } from "next/navigation";

const LoginForm = ({ redirect }: { redirect?: string }) => {
  const pathname = usePathname();
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const togglePassword = () => setShowPassword(!showPassword);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsPending(true);

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email");
    const password = formData.get("password");
    const targetRedirect = redirect || pathname || "/";

    // Call NextAuth signIn - this triggers the 'authorize' callback in your route.ts
    const result = await signIn("credentials", {
      email,
      password,
      redirect: false, // Handle redirect manually to show Swal
    });

    if (result?.error) {
      setIsPending(false);
      Swal.fire({
        title: "Login Failed",
        text: "Invalid email or password",
        icon: "error",
        confirmButtonText: "OK",
      });
    } else {
      Swal.fire({
        title: "Login Successful!",
        icon: "success",
        timer: 1200,
        showConfirmButton: false,
        timerProgressBar: true,
      });

      // Force a hard refresh to the redirect URL to ensure session is active
      setTimeout(() => {
        window.location.href = targetRedirect;
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

        {/* Submit */}
        <FieldGroup className="mt-4">
          <Button className="cursor-pointer" variant={"gradient"} type="submit" disabled={isPending}>
            {isPending ? "Logging in..." : "Login"}
          </Button>
        </FieldGroup>

        <div className="h-2">
          <h1 className="flex items-center justify-center font-bold text-lg">or</h1>
        </div>

        <div className="w-full">
          <Button 
            type="button" 
            variant="gradient" 
            onClick={() => signIn("google", { callbackUrl: "/" })} 
            className="flex items-center justify-center h-9 px-3 w-full"
          >
            <FcGoogle size={40} />
          </Button>
        </div>
      </FieldGroup>
    </form>
  );
};

export default LoginForm;