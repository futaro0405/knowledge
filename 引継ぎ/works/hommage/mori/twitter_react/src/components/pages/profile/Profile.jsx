import { useState } from "react";
import { Header } from "../../atoms/toppage/Header";
import { RightSidebar } from "../../atoms/toppage/RightSidebar";
import { Sidebar } from "../../atoms/toppage/Sidebar";
import { ProfileArea } from "../../organisms/ProfileArea";
import { ProfileEditModal } from "../../modals/ProfileEditModal";
import "../../../style/pages/profile/Profile.scss"

export const Profile = () => {
    const currentUserData = JSON.parse(sessionStorage.getItem('currentUserData'));
    const [showProfileEditModal, setShowProfileEditModal] = useState(false);

    return (
        <div className="profile">
            <div className="flex-left">
                <Header />
                <Sidebar currentUserData={currentUserData} />
            </div>
            <div className="flex-center">
                <ProfileArea showProfileEditModal={showProfileEditModal} setShowProfileEditModal={setShowProfileEditModal} />
            </div>
            <div className="flex-right">
                <RightSidebar />
            </div>
            <ProfileEditModal
                showProfileEditModal={showProfileEditModal}
                setShowProfileEditModal={setShowProfileEditModal}
            />
        </div>
    );
}