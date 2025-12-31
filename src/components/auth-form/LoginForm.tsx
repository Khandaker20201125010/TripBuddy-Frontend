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
import { useSearchParams } from "next/navigation";

// Add interface for props
interface LoginFormProps {
  redirect?: string;
}

const LoginForm: React.FC<LoginFormProps> = ({ redirect }) => {
  const searchParams = useSearchParams();
  const [isPending, setIsPending] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<{
    email?: string;
    password?: string;
  }>({});

  const togglePassword = () => setShowPassword(!showPassword);

  const validateForm = (email: string, password: string): boolean => {
    const errors: { email?: string; password?: string } = {};
    let isValid = true;

    // Reset errors
    setError(null);
    setFieldErrors({});

    // Email validation
    if (!email) {
      errors.email = "Email is required";
      isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.email = "Please enter a valid email address";
      isValid = false;
    }

    // Password validation
    if (!password) {
      errors.password = "Password is required";
      isValid = false;
    } else if (password.length < 6) {
      errors.password = "Password must be at least 6 characters";
      isValid = false;
    }

    if (!isValid) {
      setFieldErrors(errors);
    }

    return isValid;
  };

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setFieldErrors({});

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    // Validate form
    if (!validateForm(email, password)) {
      return;
    }

    setIsPending(true);

    // Use the redirect prop if provided, otherwise use searchParams
    const rawRedirect = redirect || searchParams.get("redirect") || "/";
    // Decode the URL properly and ensure it starts with a slash to stay on-site
    const targetRedirect = rawRedirect.startsWith("/") ? rawRedirect : `/${rawRedirect}`;

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        // Handle different error types
        let errorMessage = "Invalid email or password";
        
        if (result.error.includes("Network")) {
          errorMessage = "Network error. Please check your connection.";
        } else if (result.error.includes("fetch") || result.error.includes("API")) {
          errorMessage = "Unable to connect to server. Please try again later.";
        } else if (result.error.includes("CredentialsSignin")) {
          errorMessage = "Invalid email or password. Please check your credentials.";
        }
        
        setError(errorMessage);
        
        // Show error message
        Swal.fire({
          title: "Login Failed",
          text: errorMessage,
          icon: "error",
          confirmButtonText: "Try Again",
          confirmButtonColor: "#ef4444",
          timer: 3000,
          timerProgressBar: true,
        });
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
    } catch (err) {
      console.error("Login error:", err);
      setError("An unexpected error occurred. Please try again.");
      Swal.fire({
        title: "Error",
        text: "An unexpected error occurred. Please try again.",
        icon: "error",
        confirmButtonText: "OK",
      });
    } finally {
      setIsPending(false);
    }
  };

  return (
    <form onSubmit={handleLogin} className="space-y-4">
      <FieldGroup>
        {/* Email */}
        <Field>
          <FieldLabel htmlFor="email">Email</FieldLabel>
          <Input 
            id="email" 
            name="email" 
            type="email" 
            placeholder="m@example.com" 
            required 
            className={fieldErrors.email ? "border-red-500 focus:ring-red-500" : ""}
          />
          {fieldErrors.email && (
            <FieldDescription className="text-red-500 text-sm mt-1">
              {fieldErrors.email}
            </FieldDescription>
          )}
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
              className={fieldErrors.password ? "border-red-500 focus:ring-red-500" : ""}
            />
            <button
              type="button"
              onClick={togglePassword}
              className="absolute cursor-pointer right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
            >
              {showPassword ? <Eye className="text-orange-400" /> : <EyeOff className="text-orange-400" />}
            </button>
          </div>
          {fieldErrors.password && (
            <FieldDescription className="text-red-500 text-sm mt-1">
              {fieldErrors.password}
            </FieldDescription>
          )}
        </Field>

        {/* Error message for login failure */}
        {error && !fieldErrors.email && !fieldErrors.password && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600 text-sm font-medium">{error}</p>
          </div>
        )}

        {/* Submit Button */}
        <FieldGroup className="mt-6">
          <Button
            className="w-full cursor-pointer h-11"
            variant="gradient"
            type="submit"
            disabled={isPending}
          >
            {isPending ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Logging in...
              </span>
            ) : "Login"}
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
            variant="outline"
            onClick={() => signIn("google", { callbackUrl: "/" })}
            className="flex items-center justify-center gap-3 h-11 w-full border-gray-200 hover:bg-gray-50 transition-all"
            disabled={isPending}
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