
import { Metadata } from "next";
import LandingPage from "../pages/LandingPage";

export const metadata: Metadata = {
  title: "TravelBuddy",
  description: "Make your travel dreams come true with TravelBuddy!",
  
}
export default function Home() {
  return (
    <div className="min-h-screen ">
      <LandingPage />
    </div>
  );
}
