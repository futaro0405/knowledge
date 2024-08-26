import { NotificationContent } from "../atoms/notification/NotificationContent"
import { NotificationAreaHook } from "../../hooks/organisms/NotificationAreaHook";
import "../../style/organisms/notification/NotificationArea.scss"

export const NotificationArea = () => {
    const { notifications } = NotificationAreaHook();

    return (
        <div className="notification-area">
            <div className="header">
                <h4>Notifications</h4>
            </div>
            <div className="notification-contents">
                {notifications.map((notification, i) => (
                    <NotificationContent key={i} notification={notification} />
                ))}
            </div>
        </div>
    );
}