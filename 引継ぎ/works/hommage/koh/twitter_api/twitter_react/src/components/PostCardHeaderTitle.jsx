import React from "react";
import { Stack, Typography } from "@mui/material";

const defaultHeader = { fontWeight: "bold", textAlign: "left" };

const clickableHeader = {
  ...defaultHeader,
  zIndex: (theme) => theme.zIndex.appBar + 1,
  "&:hover": {
    cursor: "pointer",
    textDecoration: "underline",
  },
};

export const PostCardHeaderTitle = (props) => {
  const { header, subHeader, canClick, onClick } = props;

  return (
    <Stack
      direction="row"
      justifyContent="flex-start"
      alignItems="center"
      spacing={0}
    >
      <Typography
        variant="body1"
        // クリック可能な場合、クリック可能なスタイルを設定
        sx={canClick ? clickableHeader : defaultHeader}
        onClick={canClick && onClick}
      >
        {header}
      </Typography>
      <Typography variant="body1" sx={{ color: "grey", px: 1 }}>
        {subHeader}
      </Typography>
    </Stack>
  );
};
