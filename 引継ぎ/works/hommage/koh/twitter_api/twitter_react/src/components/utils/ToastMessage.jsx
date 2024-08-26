import React from "react";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import { useRecoilState } from "recoil";
import { flashState } from "../../globalStates/atoms";

export const ToastMessage = () => {
  const [flash, setFlash] = useRecoilState(flashState);

  const handleClose = (e, reason) => {
    if (reason === "clickaway") return;
    setFlash({ ...flash, isOpen: false });
  };

  return (
    <Snackbar
      open={flash.isOpen}
      autoHideDuration={5000}
      anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      onClose={handleClose}
    >
      <Alert
        sx={{ whiteSpace: "pre-line" }}
        severity={flash.severity}
        onClose={handleClose}
      >
        {flash.message}
      </Alert>
    </Snackbar>
  );
};
