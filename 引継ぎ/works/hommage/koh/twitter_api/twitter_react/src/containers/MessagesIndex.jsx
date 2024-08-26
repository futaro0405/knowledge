import React from "react";

import { Typography } from "@mui/material";
import { GroupCard } from "../components/cards/GroupCard";

import { MessageForm } from "../components/forms/MessageForm";
import { useMessagesFetch } from "../hooks/posts/useMessagesFetch";
import { MessageLists } from "../components/lists/MessageLists";

export const MessagesIndex = () => {
  const {
    groups,
    displayingGroup,
    messages,
    messagesBottom,
    fetchInitialGroups,
  } = useMessagesFetch();

  return (
    <div className="h-screen flex flex-row flex-1">
      <div className="w-2/5 border-r-2 overflow-y-auto">
        <Typography variant="h5" sx={{ m: 2, fontWeight: "bold" }}>
          メッセージ
        </Typography>
        {groups?.map((group) => (
          <GroupCard
            key={group.id}
            group={group}
            displayingGroupId={displayingGroup?.id}
          />
        ))}
      </div>
      <div className="h-full w-3/5">
        {displayingGroup && (
          <>
            <div className="h-[90%] px-2 border-b-2 overflow-y-auto">
              <MessageLists
                group={displayingGroup}
                messages={messages}
                refName={messagesBottom}
              />
            </div>
            <div className="h-[10%] pt-4">
              <MessageForm
                group={displayingGroup}
                reFetch={fetchInitialGroups}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
};
