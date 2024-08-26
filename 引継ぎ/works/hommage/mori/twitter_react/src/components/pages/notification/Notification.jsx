import { Header } from "../../atoms/toppage/Header";
import { RightSidebar } from "../../atoms/toppage/RightSidebar";
import { Sidebar } from "../../atoms/toppage/Sidebar";
import "../../../style/pages/notification/Notification.scss";
import { NotificationArea } from "../../organisms/NotificationArea";

export const Notification = () => {
    const currentUserData = JSON.parse(sessionStorage.getItem('currentUserData'));
    return (
        <>
            <div className="notifications">
                <div className="flex-left">
                    <Header />
                    <Sidebar currentUserData={currentUserData} />
                </div>
                <div className="flex-center">
                    <NotificationArea />
                </div>
                <div className="flex-right">
                    <RightSidebar />
                </div>
            </div>
        </>
    );
}