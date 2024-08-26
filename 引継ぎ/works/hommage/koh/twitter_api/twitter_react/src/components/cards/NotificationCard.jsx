import React from "react";

import { CommentCard } from "./CommentCard";
import { PostShowingCard } from "./PostShowingCard";
import { FollowCard } from "./FollowCard";

export const NotificationCard = (props) => {
  const { notification } = props;

  const actionType = notification.action_type;

  const cardMap = {
    Follow: <FollowCard notification={notification} />,
    Like: <PostShowingCard notification={notification} />,
    Comment: <CommentCard comment={notification.target} sx={{ m: 0 }} />,
  };

  return cardMap[actionType];
};
