import { useCallback, useContext } from "react";
import { AiFillHome } from "react-icons/ai";
import { AiOutlineSearch } from "react-icons/ai";
import { IoMdNotificationsOutline } from "react-icons/io";
import { AiOutlineMail } from "react-icons/ai";
import { CiViewList } from "react-icons/ci";
import { FaTwitter } from "react-icons/fa6";
import { BsPerson } from "react-icons/bs";
import { CiCircleMore } from "react-icons/ci";
import { BsBookmark } from "react-icons/bs";
import { BsPeople } from "react-icons/bs";
import { CookieContext } from "../../providers/TwitterProvider";
import { AxiosInstance } from "../../axios/axiosInstance";

export const SidebarHook = () => {
    const ITEM_LIST = [
        { label: "Home", icon: <AiFillHome /> },
        { label: "Explore", icon: <AiOutlineSearch /> },
        { label: "Notification", icon: <IoMdNotificationsOutline /> },
        { label: "Message", icon: <AiOutlineMail /> },
        { label: "Lists", icon: <CiViewList /> },
        { label: "Bookmarks", icon: <BsBookmark /> },
        { label: "Communities", icon: <BsPeople /> },
        { label: "Premium", icon: <FaTwitter /> },
        { label: "Profile", icon: <BsPerson /> },
        { label: "Withdrawal", icon: <CiCircleMore /> },
    ];
    const { instance } = AxiosInstance();
    const { cookies, removeCookie } = useContext(CookieContext)

    const onClickWithdrawal = useCallback(async () => {
        if (window.confirm('アカウントを削除してもよろしいですか。')) {
            await instance.delete(
                '/api/v1/users',
                {
                    'access-token': cookies['access-token'],
                    'client': cookies['client'],
                    'uid': cookies['uid']
                }
            );
            removeCookie('access-token');
            removeCookie('client');
            removeCookie('uid');
        }
    }, [cookies])

    return { ITEM_LIST, onClickWithdrawal };
}