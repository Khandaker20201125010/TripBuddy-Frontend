"use client"
import { MediaSharingPage } from "@/components/modules/community/MediaSharingPage";
import ConnectionSidebar from "@/components/shared/ConnectionSidebar";
import { Menu, X } from 'lucide-react';
import { useState, useEffect } from 'react';

const CommunityComponent = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Check if mobile on mount and resize
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Close sidebar when clicking outside on mobile
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const sidebar = document.querySelector('.connection-sidebar');
      const hamburger = document.querySelector('.hamburger-button');
      
      if (isMobile && isSidebarOpen && 
          sidebar && 
          !sidebar.contains(event.target as Node) &&
          hamburger &&
          !hamburger.contains(event.target as Node)) {
        setIsSidebarOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isMobile, isSidebarOpen]);

  // Prevent body scroll when sidebar is open on mobile
  useEffect(() => {
    if (isMobile && isSidebarOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isMobile, isSidebarOpen]);

  return (
    <div className="min-h-screen ">
      {/* Desktop Header */}
      <div className="hidden lg:flex items-center justify-between px-6 py-4 border-b border-stone-200 bg-stone-100">
        <div className="flex  items-center gap-3">
          
          <div className="p-2  rounded-lg">
            <h1 className="text-2xl font-bold text-stone-900">Travel Community</h1>
            <p className="text-sm text-stone-500">Share memories & connect with travelers</p>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm font-medium text-stone-600">
              Online
            </span>
          </div>
        </div>
      </div>

      {/* Mobile Header with Hamburger */}
      <div className="lg:hidden sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-stone-200 shadow-sm">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                className="hamburger-button p-2 rounded-lg hover:bg-stone-100 transition-colors active:scale-95"
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                aria-label={isSidebarOpen ? "Close menu" : "Open menu"}
              >
                {isSidebarOpen ? (
                  <X className="w-5 h-5 text-stone-700" />
                ) : (
                  <Menu className="w-5 h-5 text-stone-700" />
                )}
              </button>
              
              <div className="flex flex-col">
                <h2 className="text-lg font-semibold text-stone-900 leading-tight">
                  Travel Community
                </h2>
                <p className="text-xs text-stone-500">
                  Share & Connect
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-xs font-medium text-stone-600">
                Online
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area - Sidebar & Media Content */}
      <div className="flex">
        {/* Connection Sidebar */}
        <div className={`
          connection-sidebar min-h-screen
          lg:w-80 lg:flex-shrink-0 lg:border-r lg:border-stone-200
          fixed lg:relative lg:top-0 lg:inset-y-0 left-0 z-40 lg:z-auto
          transform transition-all duration-300 ease-in-out
          ${isMobile ? (isSidebarOpen ? 'translate-x-0' : '-translate-x-full') : 'translate-x-0'}
          ${isMobile ? 'w-full max-w-xs sm:max-w-sm' : 'w-80'}
          h-screen lg:h-[calc(100vh-80px)]  // Adjusted for header height
          overflow-y-auto
          bg-white lg:bg-gradient-to-b lg:from-white lg:to-stone-50
          shadow-xl lg:shadow-none
        `}>
          {/* Mobile Overlay Background */}
          {isMobile && isSidebarOpen && (
            <div 
              className="fixed inset-0 bg-black/50 lg:hidden -z-10"
              onClick={() => setIsSidebarOpen(false)}
            />
          )}
          
          {/* Sidebar Content */}
          <div className="relative z-10 h-full">
            <div className="sticky top-0 h-full overflow-y-auto">
              {/* Mobile Sidebar Header */}
              <div className="lg:hidden p-4 border-b border-stone-200 bg-white">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="p-2 bg-gradient-to-br from-orange-500/10 to-pink-500/10 rounded-lg">
                      <Menu className="h-4 w-4 text-orange-600" />
                    </div>
                    <h3 className="font-bold text-stone-900">Connections</h3>
                  </div>
                  <button
                    onClick={() => setIsSidebarOpen(false)}
                    className="p-2 hover:bg-stone-100 rounded-lg transition-colors"
                    aria-label="Close sidebar"
                  >
                    <X className="w-4 h-4 text-stone-500" />
                  </button>
                </div>
                <p className="text-xs text-stone-500">
                  Manage your travel buddies and requests
                </p>
              </div>
              
              <ConnectionSidebar 
                onMobileAction={() => setIsSidebarOpen(false)}
              />
            </div>
          </div>
        </div>
        
        {/* Media Content Area */}
        <div className="flex-1 min-h-[calc(100vh-64px)] lg:min-h-[calc(100vh-80px)]">
          <MediaSharingPage />
        </div>
      </div>
    </div>
  );
};

export default CommunityComponent;