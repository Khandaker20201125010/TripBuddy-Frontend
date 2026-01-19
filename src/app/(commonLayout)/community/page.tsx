
import CommunityComponent from "@/components/community/CommunityComponent";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Media Sharing | Travel Buddy",
  description: "Share your travel photos and memories with the community",
};

const Community = () => {
  return (
  <div>
    <CommunityComponent />
  </div>
  );
};

export default Community;