/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { z } from "zod";
import { loginTraveler } from "./loginTravler";
const registerValidationZodSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  email: z.email({ message: "Email is required" }),
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

    const validationResult =
      registerValidationZodSchema.safeParse(validatedField);

    if (!validationResult.success) {
      return {
        success: false,
        errors: validationResult.error.issues.map((issue) => ({
          field: issue.path[0],
          message: issue.message,
        })),
      };
    }

    // Prepare form data
    const newFormData = new FormData();
    const file = formData.get("file") as File | null;

    if (file && file.size > 0) {
      newFormData.append("file", file);
    } else {
      // Send empty string so Multer won't treat as a file
      newFormData.append("file", "");
    }

    newFormData.append("name", validatedField.name as string);
    newFormData.append("email", validatedField.email as string);
    newFormData.append("password", validatedField.password as string);

    // Register
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/user/register`,
      {
        method: "POST",
        body: newFormData,
      }
    );

    const result = await res.json();

    if (!res.ok || !result.success) {
      return {
        success: false,
        error:
          typeof result.message === "string"
            ? result.message
            : JSON.stringify(result.message),
      };
    }

    // Auto login
    const loginResult = await loginTraveler(currentState, formData);

    return {
      success: true,
      redirect: loginResult.redirect,
      role: loginResult.role,
    };
  } catch (err: any) {
    console.log(err);
    return { success: false, error: "Registration failed" };
  }
};
