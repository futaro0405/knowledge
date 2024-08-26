import React, { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

import { Avatar, CardActions, Typography } from "@mui/material";

import { MessageCard } from "../cards/MessageCard";

export const MessageLists = (props) => {
  const { group, messages } = props;
  const navigate = useNavigate();

  const messagesBottom = useRef(null);

  useEffect(() => {
    // 明細ループ後にrefの要素に描画を移動する
    if (messagesBottom.current) {
      messagesBottom.current.scrollIntoView({ behavior: "smooth" });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [messages]);

  return (
    <>
      <div
        style={{
          position: "fixed",
          top: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-start",
          background: "white",
          width: "100%",
          opacity: "0.9",
        }}
      >
        <CardActions
          sx={{ p: 0, m: 0 }}
          disableSpacing
          onClick={() => navigate(`/${group.user.user_name}`)}
        >
          <Avatar
            sx={{
              height: "4vh",
              width: "4vh",
              "&:hover": {
                cursor: "pointer",
                opacity: "0.8",
              },
            }}
            alt={`${group?.user.name}`}
            src={`${group?.user.profile_image_path}`}
          />
        </CardActions>
        <div>
          <Typography variant="h5" sx={{ m: 2, fontWeight: "bold" }}>
            {group?.user.name}
          </Typography>
        </div>
      </div>
      <div style={{ paddingTop: "5vh" }}>
        {messages?.map((message) => (
          <MessageCard
            key={message.id}
            otherUser={group?.user}
            message={message}
          />
        ))}
        {/* ページスクロール用のref */}
        <div ref={messagesBottom}></div>
      </div>
    </>
  );
};
