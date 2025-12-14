"use client";
import { Footer } from "@/components/shared/Footer";
import { Navbar } from "@/components/shared/Navbar";

import { SessionProvider } from "next-auth/react";

const commonLayout = ({ children }: { children: React.ReactNode }) => {

    return (
        <>
            <SessionProvider>
                <div className="mb-20">
                    <Navbar />
                </div>

                <div className="min-h-screen font-display">
                    {children}
                </div>

                <Footer />
            </SessionProvider>
        </>
    );
};

export default commonLayout;