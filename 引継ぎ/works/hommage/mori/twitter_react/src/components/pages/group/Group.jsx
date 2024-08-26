import { Header } from "../../atoms/toppage/Header";
import { RightSidebar } from "../../atoms/toppage/RightSidebar";
import { Sidebar } from "../../atoms/toppage/Sidebar";
import "../../../style/pages/group/Group.scss";
import { GroupArea } from "../../organisms/GroupArea";

export const Group = () => {
    const currentUserData = JSON.parse(sessionStorage.getItem('currentUserData'));

    return (
        <div className="groups">
            <div className="flex-left">
                <Header />
                <Sidebar currentUserData={currentUserData} />
            </div>
            <div className="flex-center">
                <GroupArea />
            </div>
            <div className="flex-right">
                <RightSidebar />
            </div>
        </div>
    );
}