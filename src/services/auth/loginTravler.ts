/* eslint-disable @typescript-eslint/no-explicit-any */
"use server"

export const loginTraveler = async (_currentState: any, formData: any): Promise<any> => {
    try{
         const loginData ={
            email: formData.get("email"),
            password: formData.get("password")
         }
         const res  = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
            method: "POST",
            body: JSON.stringify(loginData),
            headers:{
                "Content-Type": "application/json"
            }
         }).then(res => res.json());
         return res;
    }catch(err){
        console.log(err);
        return { error: "Login failed" };

    }
}