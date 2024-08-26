import React from "react";
import { useRecoilValue } from "recoil";
import { Backdrop, CircularProgress } from "@mui/material";
import { loadingState } from "../../globalStates/atoms";

export const Spinner = () => {
  const loading = useRecoilValue(loadingState);

  return (
    <Backdrop
      sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.modal + 1 }}
      open={loading}
    >
      <CircularProgress color="inherit" />
    </Backdrop>
  );
};
