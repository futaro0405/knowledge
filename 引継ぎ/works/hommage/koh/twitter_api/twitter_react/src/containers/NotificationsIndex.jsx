import React, { useEffect, useState } from "react";
import { useSetRecoilState } from "recoil";

import { NotificationCard } from "../components/cards/NotificationCard";

import { loadingState } from "../globalStates/atoms";
import { fetchNotifications } from "../apis/notifications";

export const NotificationsIndex = () => {
  const [notifications, setNotifications] = useState([]);

  const setLoading = useSetRecoilState(loadingState);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const res = await fetchNotifications();
      setNotifications(res.data);
      setLoading(false);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      {notifications.map((notification) => (
        <NotificationCard key={notification.id} notification={notification} />
      ))}
    </>
  );
};
