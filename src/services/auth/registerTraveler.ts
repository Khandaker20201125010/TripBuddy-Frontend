/* eslint-disable @typescript-eslint/no-explicit-any */
"use server"

export const registerTraveler = async (currentState: any, formData: FormData): Promise<any> => {
  try {
    const name = formData.get("name");
    const email = formData.get("email");
    const password = formData.get("password");
    const file = formData.get("file") as File | null;

    const newFormData = new FormData();

    if (file) newFormData.append("file", file);
    newFormData.append("name", name as string);
    newFormData.append("email", email as string);
    newFormData.append("password", password as string);

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/register`, {
      method: "POST",
      body: newFormData,
    });

    return await res.json();
  } catch (err) {
    console.log(err);
    return { error: "Registration failed" };
  }
};
