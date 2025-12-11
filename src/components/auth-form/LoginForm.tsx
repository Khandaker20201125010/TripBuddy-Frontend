/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useActionState, useEffect, useState } from "react";
import { Field, FieldDescription, FieldGroup, FieldLabel } from "../ui/field";
import Swal from "sweetalert2";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { loginTraveler } from "@/services/auth/loginTravler";
import { Eye, EyeOff } from "lucide-react";

const LoginForm = ({ redirect }: { redirect?: string }) => {
  const [state, formAction, isPending] = useActionState(loginTraveler, null);
  const [showPassword, setShowPassword] = useState(false);

  const getFieldError = (fieldName: string) => {
    if (state && Array.isArray(state.errors)) {
      const error = state.errors.find((err: any) => err.field === fieldName);
      return error?.message || null;
    }
    return null;
  };

  const togglePassword = () => setShowPassword(!showPassword);

  useEffect(() => {
    if (!state) return;

    console.log("Login State:", state);

    if (state.success) {
      Swal.fire({
        title: "Login Successful!",
        icon: "success",
        timer: 1200,
        showConfirmButton: false,
        timerProgressBar: true,
      });

      if (state.redirect) {
        setTimeout(() => {
          window.location.href = state.redirect;
        }, 1200);
      }
    }

    if (state.error) {
      Swal.fire({
        title: "Login Failed",
        text: state.error,
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  }, [state]);

  return (
    <form action={formAction} className="space-y-4">
      <input type="hidden" name="redirect" value={redirect || window.location.pathname} />

      <FieldGroup>
        {/* Email */}
        <Field>
          <FieldLabel htmlFor="email">Email</FieldLabel>
          <Input id="email" name="email" type="email" placeholder="m@example.com" />
          {getFieldError("email") && (
            <FieldDescription className="text-red-600">{getFieldError("email")}</FieldDescription>
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
            />
            <button
              type="button"
              onClick={togglePassword}
              className="absolute cursor-pointer right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
            >
              {showPassword ? <Eye className="text-orange-400" /> : <EyeOff  className="text-orange-400"/>}
           
            </button>
          </div>
          {getFieldError("password") && (
            <FieldDescription className="text-red-600">{getFieldError("password")}</FieldDescription>
          )}
        </Field>

        {/* Submit */}
        <FieldGroup className="mt-4">
          <Button className="cursor-pointer" variant={"gradient"} type="submit" disabled={isPending}>
            {isPending ? "Logging in..." : "Login"}
          </Button>
        </FieldGroup>
      </FieldGroup>
    </form>
  );
};

export default LoginForm;
