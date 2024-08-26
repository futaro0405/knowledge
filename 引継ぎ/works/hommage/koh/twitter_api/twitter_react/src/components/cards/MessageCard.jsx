import React from "react";
import { Typography } from "@mui/material";
import { useRecoilValue } from "recoil";
import { currentUserState } from "../../globalStates/atoms";
import { formatDateTime } from "../../lib/utility";

const currentUserDesign = {
  justifyContent: "flex-end",
  alignItems: "flex-end",
  borderRadius: "17px 17px 2px 17px",
  fontColor: "#F3F8FD",
  background: "#1E9BF0",
  textAlign: "right",
};

const otherUserDesign = {
  justifyContent: "flex-start",
  alignItems: "flex-start",
  borderRadius: "17px 17px 17px 2px",
  fontColor: "#0E1419",
  background: "#EEF3F4",
  textAlign: "left",
};

export const MessageCard = (props) => {
  const { message } = props;
  const currentUser = useRecoilValue(currentUserState);

  const design =
    currentUser.id === message.user_id ? currentUserDesign : otherUserDesign;

  return (
    <div
      style={{
        margin: "1rem",
        display: "flex",
        flexDirection: "column",
        alignItems: design.alignItems,
        justifyContent: design.justifyContent,
      }}
    >
      <Typography
        variant="body1"
        sx={{
          p: 2,
          color: design.fontColor,
          background: design.background,
          borderRadius: design.borderRadius,
          width: "60%",
          textAlign: "left",
          whiteSpace: "pre-line",
        }}
        style={{
          overflowWrap: "break-word",
          wordBreak: "normal",
        }}
      >
        {message.content}
      </Typography>
      <Typography variant="body2" sx={{ my: 1, textAlign: design.textAlign }}>
        {formatDateTime(new Date(message.created_at))}
      </Typography>
    </div>
  );
};
