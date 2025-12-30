/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { z } from "zod";

const registerValidationZodSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  email: z.string().email({ message: "Email is required" }),
  password: z.string().min(6, {
    message: "Password is required and must be at least 6 characters",
  }),
});

export const registerTraveler = async (
  currentState: any,
  formData: FormData
): Promise<any> => {
  try {
    const validatedField = {
      name: formData.get("name"),
      email: formData.get("email"),
      password: formData.get("password"),
    };

    const validationResult = registerValidationZodSchema.safeParse(validatedField);

    if (!validationResult.success) {
      return {
        success: false,
        errors: validationResult.error.issues.map((issue) => ({
          field: issue.path[0],
          message: issue.message,
        })),
      };
    }

    // Prepare form data for registration
    const newFormData = new FormData();
    const file = formData.get("file") as File | null;

    if (file && file.size > 0) {
      newFormData.append("file", file);
    } else {
      newFormData.append("file", "");
    }

    newFormData.append("name", validatedField.name as string);
    newFormData.append("email", validatedField.email as string);
    newFormData.append("password", validatedField.password as string);

    // Register the user
    console.log("Registering user...");
    const registerRes = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/user/register`,
      {
        method: "POST",
        body: newFormData,
      }
    );

    const registerResult = await registerRes.json();
    console.log("Registration result:", registerResult);

    if (!registerRes.ok || !registerResult.success) {
      console.error("Registration failed:", registerResult);
      return {
        success: false,
        error: registerResult.message || "Registration failed. Please try again.",
      };
    }

    // Return success with credentials for auto-login
    return {
      success: true,
      email: validatedField.email as string,
      password: validatedField.password as string,
      message: "Account created successfully!",
    };

  } catch (err: any) {
    console.error("Registration error:", err);
    return { 
      success: false, 
      error: err.message || "Registration failed. Please try again." 
    };
  }
};