/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { success, z } from "zod";
const registerValidationZodSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  email: z.email({ message: "Email is required" }),
  password: z
    .string()
    .min(6, {
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
       return{
         success: false,
         errors: validationResult.error.issues.map((issue) => {
            return{
              field: issue.path[0],
              message: issue.message,
            }
         })
       }

      }
    const name = formData.get("name");
    const email = formData.get("email");
    const password = formData.get("password");
    const file = formData.get("file") as File | null;

    const newFormData = new FormData();

    if (file) newFormData.append("file", file);
    newFormData.append("name", name as string);
    newFormData.append("email", email as string);
    newFormData.append("password", password as string);

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/user/register`,
      {
        method: "POST",
        body: newFormData,
      }
    );

    return await res.json();
  } catch (err) {
    console.log(err);
    return { error: "Registration failed" };
  }
};
