import { useCallback, useEffect, useState } from "react"
import { AxiosInstance } from "../../axios/axiosInstance";

export const NotificationAreaHook = () => {
    const { instance } = AxiosInstance();
    const [notifications, setNotifications] = useState([
        {
            action: 'nice',
            visitor: {
                name: ''
            }
        }
    ]);

    const getNotification = useCallback(async () => {
        try {
            const notificationData = await instance.get('/api/v1/notifications');
            setNotifications(notificationData.data.notifications);
        } catch (error) {
            console.log(error);
        }
    }, [])

    useEffect(() => {
        getNotification();
    }, [])

    return {
        notifications
    };
}