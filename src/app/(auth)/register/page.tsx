import RegisterForm from '@/components/auth-form/RegisterForm';
import Image from 'next/image';
import loginsinup from "../../../../public/images/loginsinup.png";
import { Metadata } from 'next';


export const metadata :Metadata= {
    title: "Register | TravelBuddy",
    description: "Register to your account and start planning your next adventure!",
}
const RegisterPage = async ({
    searchParams,
}: {
    searchParams?: Promise<{ redirect?: string }>;
}) => {
    const params = (await searchParams) || {};

    return (
        <div className="min-h-screen flex flex-col md:flex-row">
            {/* Left side full-screen image */}
          <div className="relative flex w-full md:w-1/2 h-screen order-1 md:order-2">
                <Image
                    src={loginsinup}
                    alt="Login Illustration"
                    fill
                    /* 3. Added block and h-full to the image classes */
                    className="object-cover block w-full h-full"
                    priority
                    sizes="(max-width: 768px) 100vw, 50vw"
                />
            </div>

            {/* Right side login form */}
            <div className="flex w-full md:w-1/2 items-center justify-center ">
                <div className="w-full max-w-md bg-white rounded-xl shadow-xl">
                  

                    <RegisterForm  />

                  
                </div>
            </div>
        </div>
    );
};

export default RegisterPage;
