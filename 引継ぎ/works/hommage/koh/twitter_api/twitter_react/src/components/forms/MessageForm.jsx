import React, { useState } from "react";

import { IconButton, Stack, TextField } from "@mui/material";
import SendOutlinedIcon from "@mui/icons-material/SendOutlined";
import { useSetRecoilState } from "recoil";
import { loadingState } from "../../globalStates/atoms";
import { createMessage } from "../../apis/messages";

const initialMessage = {
  content: "",
};

export const MessageForm = (props) => {
  const { group, reFetch } = props;
  const [message, setMessage] = useState(initialMessage);

  const setLoading = useSetRecoilState(loadingState);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setMessage((prev) => ({ ...prev, [name]: value }));
  };

  const handleClick = async (e) => {
    try {
      setLoading(true);
      await createMessage(message, group);

      await reFetch();
      setMessage(initialMessage);
    } catch (err) {
      console.log("err", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Stack direction="row" justifyContent="center" alignItems="center">
      <div style={{ width: "90%" }}>
        <TextField
          style={{
            borderRadius: "10px",
            backgroundColor: "#EFF3F4",
            padding: "0.2rem",
          }}
          required
          fullWidth
          multiline
          rows={2}
          name="content"
          value={message.content}
          InputLabelProps={{ shrink: true }}
          placeholder="新しいメッセージを作成"
          variant="standard"
          InputProps={{
            disableUnderline: true,
          }}
          onChange={handleChange}
        />
      </div>
      <IconButton
        disabled={message.content.length === 0}
        aria-label="delete"
        size="large"
        style={{
          backgroundColor: "#EFF3F4",
          color: "#98C8F2",
        }}
        onClick={async (e) => await handleClick(e)}
      >
        <SendOutlinedIcon fontSize="inherit" />
      </IconButton>
    </Stack>
  );
};
