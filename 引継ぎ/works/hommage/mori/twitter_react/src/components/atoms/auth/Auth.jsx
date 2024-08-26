import { memo, useContext } from "react";
import { useLocation, Navigate } from "react-router-dom";
import { CookieContext } from "../../../providers/TwitterProvider";

export const Auth = memo(({ children }) => {
    const { cookies } = useContext(CookieContext);
    const location = useLocation();
    const regexTweetDetail = /\/tweets\/\d+/;
    const regexProfile = /\/profile\/\d+/;
    const regexGroup = /\/groups\/\d+/;
    const isOnHome = (location.pathname === '/toppage')
        || regexTweetDetail.test(location.pathname)
        || regexProfile.test(location.pathname)
        || (location.pathname === '/notifications')
        || (location.pathname === '/groups')
        || regexGroup.test(location.pathname)
        || (location.pathname === '/bookmarks');

    if (!cookies['access-token'] && isOnHome) return <Navigate replace to="/" />;
    if (cookies['access-token'] && isOnHome) return (
        <>
            {children}
        </>
    );
})