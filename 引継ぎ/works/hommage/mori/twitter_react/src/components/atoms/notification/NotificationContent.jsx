import { FaHeart } from "react-icons/fa6";
import { HiOutlineChatBubbleLeft } from "react-icons/hi2";
import { SlUserFollow } from "react-icons/sl";
import '../../../style/atoms/notification/NotificationContent.scss'

export const NotificationContent = ({ notification }) => {
    return (
        <div className="notification">
            {(notification.action === 'nice') ? (
                <div className="notification-nice">
                    <FaHeart />
                    <p>{notification.visitor.name}がいいねしました</p>
                </div>
            ) : (notification.action === 'follow') ? (
                <div className="notification-follow">
                    <SlUserFollow />
                    <p>{notification.visitor.name}がフォローしました</p>
                </div>
            ) : (notification.action === 'comment') ? (
                <div className="notification-comment">
                    <HiOutlineChatBubbleLeft />
                    <p>{notification.visitor.name}がコメントしました</p>
                </div>
            ) : <></>}
        </div>
    )
}