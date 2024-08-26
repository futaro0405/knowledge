import { memo } from "react";
import { Header } from "../../atoms/toppage/Header";
import { Sidebar } from "../../atoms/toppage/Sidebar";
import { RightSidebar } from "../../atoms/toppage/RightSidebar";
import "../../../style/pages/bookmark/Bookmark.scss";
import { BookmarkArea } from "../../organisms/BookmarkArea";

export const Bookmark = memo(() => {
    const currentUserData = JSON.parse(sessionStorage.getItem('currentUserData'));

    return (
        <div className="bookmark-page">
            <div className="flex-left">
                <Header />
                <Sidebar currentUserData={currentUserData} />
            </div>
            <div className="flex-center">
                <BookmarkArea />
            </div>
            <div className="flex-right">
                <RightSidebar />
            </div>
        </div>
    );
})