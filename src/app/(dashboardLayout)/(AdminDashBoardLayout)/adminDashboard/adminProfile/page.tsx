import AdminProfilePage from "@/components/AdminDashBoardComponents/AdminProfilePage";
import { Metadata } from "next";

export const metadata :Metadata = {
   title: "Admin Profile | TravelBuddy",
    description: "View and manage your profile with ease!",
  
}

const AdminProfile = () => {
  return (
    <div>
      <AdminProfilePage />
    </div>
  );
};

export default AdminProfile;