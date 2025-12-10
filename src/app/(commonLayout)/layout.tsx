import { Footer } from "@/components/shared/Footer";
import { Navbar } from "@/components/shared/Navbar";

const commonLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <>
            <div className="mb-20">
                <Navbar />
            </div>
            <div className="min-h-screen ">
                {children}
            </div>
            <Footer />
        </>
    );
};

export default commonLayout;