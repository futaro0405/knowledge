import { TweetDetail } from "../components/pages/detail/TweetDetail";
import { Auth } from '../components/atoms/auth/Auth';
import { Home } from "../components/pages/home/home";
import { Toppage } from "../components/pages/toppage/Toppage";
import { Profile } from "../components/pages/profile/Profile";
import { Notification } from "../components/pages/notification/Notification";
import { Group } from "../components/pages/group/Group";
import { GroupDetail } from "../components/pages/group/GroupDetail";
import { Bookmark } from "../components/pages/bookmark/Bookmark";

export const TweetRoutes = [
    {
        path: '/',
        exact: true,
        children: <Home />
    },
    {
        path: '/toppage',
        exact: false,
        children: <Auth><Toppage /></Auth>
    },
    {
        path: '/tweets/:id',
        exact: false,
        children: <Auth><TweetDetail /></Auth>
    },
    {
        path: '/profile/:id',
        exact: false,
        children: <Auth><Profile /></Auth>
    },
    {
        path: '/notifications',
        exact: true,
        children: <Auth><Notification /></Auth>
    },
    {
        path: '/groups',
        exact: false,
        children: <Auth><Group /></Auth>
    },
    {
        path: '/groups/:id',
        exact: false,
        children: <Auth><GroupDetail /></Auth>
    },
    {
        path: '/bookmarks',
        exact: true,
        children: <Auth><Bookmark /></Auth>
    }
];