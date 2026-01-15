"use client";
import { Footer } from "@/components/shared/Footer";
import { Navbar } from "@/components/shared/Navbar";

import { SessionProvider } from "next-auth/react";

const commonLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <SessionProvider>
            {/* Navbar with fixed height or margin */}
            <div className="mb-20">
                <div className="max-w-[1440px] mx-auto ">
                    <Navbar />
                </div>
            </div>

            {/* Main Content Area */}
            <main className="min-h-screen font-display max-w-[1440px] mx-auto bg-(--color-warm-white)">
                {children}
            </main>

            {/* Footer Container */}
            <footer className="">
                <Footer />
            </footer>
        </SessionProvider>
    );
};
export default commonLayout;