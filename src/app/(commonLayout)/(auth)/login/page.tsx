import LoginForm from '@/components/auth-form/LoginForm';
import Image from 'next/image';
import loginsinup from "../../../../../public/images/loginsinup.png";

const LoginPage = async ({
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
                    <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">
                        Welcome Back
                    </h1>
                    <p className="text-center text-gray-500 mb-6">
                        Enter your credentials to explore amazing travel experiences
                    </p>

                    <LoginForm redirect={params.redirect} />

                    <p className="text-center text-gray-500 mt-6">
                        Don&apos;t have an account?{' '}
                        <a href="/register" className="text-blue-600 hover:underline">
                            Sign up
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
