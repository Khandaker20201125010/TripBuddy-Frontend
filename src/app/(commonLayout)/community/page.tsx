import { MediaSharingPage } from "@/components/modules/community/MediaSharingPage";
import ConnectionSidebar from "@/components/shared/ConnectionSidebar";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Media Sharing | Travel Buddy",
  description: "Share your travel photos and memories with the community",
};

const Community = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-stone-50 via-white to-stone-50/50">
      <div className="flex">
        {/* Connection Sidebar - Fixed position */}
        <div className="w-80 flex-shrink-0 border-r border-stone-200">
          <ConnectionSidebar />
        </div>
        
        {/* Main Content Area */}
        <div className="flex-1 overflow-x-hidden">
          <MediaSharingPage />
        </div>
      </div>
    </div>
  );
};

export default Community;