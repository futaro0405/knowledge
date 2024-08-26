import { memo } from "react";
import { Header } from "../../atoms/toppage/Header";
import { Sidebar } from "../../atoms/toppage/Sidebar";
import { RightSidebar } from "../../atoms/toppage/RightSidebar";
import "../../../style/pages/group/GroupDetail.scss";
import { MessageArea } from "../../organisms/MessageArea";

export const GroupDetail = memo(() => {
    const currentUserData = JSON.parse(sessionStorage.getItem('currentUserData'));
    return (
        <div className="group-detail">
            <div className="flex-left">
                <Header />
                <Sidebar currentUserData={currentUserData} />
            </div>
            <div className="flex-center">
                <MessageArea currentUserData={currentUserData} />
            </div>
            <div className="flex-right">
                <RightSidebar />
            </div>
        </div>
    );
})