import { DashBoardNavbar } from "@/components/dashboard/DashBoardNavbar";
import { DashBoardSidebar } from "@/components/dashboard/DashBoardSidebar";
import { Providers } from "@/components/Providers";


export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    return (
        <Providers>
            <div className="flex min-h-screen font-display">
                {/* Desktop Sidebar */}
                <DashBoardSidebar />

                <div className="flex flex-1 flex-col">
                    {/* Top Navbar */}
                    <DashBoardNavbar />

                    {/* Main Content Area */}
                    <main className="flex-1 bg-muted/30 p-4 md:p-8">
                        <div className="max-w-6xl mx-auto animate-in fade-in duration-500">

                            {children}
                        </div>
                    </main>
                </div>
            </div>

        </Providers>

    );
}