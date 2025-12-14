import RegisterForm from '@/components/auth-form/RegisterForm';
import LoginForm from '@/components/auth-form/LoginForm';
import Image from 'next/image';
import loginsinup from "../../../../../public/images/loginsinup.png";

const RegisterPage = async ({
    searchParams,
}: {
    searchParams?: Promise<{ redirect?: string }>;
}) => {
    const params = (await searchParams) || {};

    return (
        <div className="min-h-screen flex flex-col md:flex-row">
            {/* Left side full-screen image */}
            <div className="relative w-full md:w-1/2 h-screen">
                <Image
                    src={loginsinup}
                    alt="Login Illustration"
                    fill
                    className="object-cover"
                    priority
                />
            </div>

            {/* Right side login form */}
            <div className="flex w-full md:w-1/2 items-center justify-center bg-gray-50 p-8">
                <div className="w-full max-w-md bg-white rounded-xl shadow-xl p-8">
                  

                    <RegisterForm  />

                  
                </div>
            </div>
        </div>
    );
};

export default RegisterPage;
