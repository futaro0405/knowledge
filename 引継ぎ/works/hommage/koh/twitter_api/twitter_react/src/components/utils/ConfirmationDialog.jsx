import React from "react";
import { useRecoilState } from "recoil";

import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";

import { confirmingState } from "../../globalStates/atoms";

export const ConfirmationDialog = () => {
  const [confirming, setConfirming] = useRecoilState(confirmingState);

  return (
    <Dialog
      open={confirming.isOpen}
      onClose={() => setConfirming((prev) => ({ ...prev, isOpen: false }))}
    >
      <DialogTitle fontWeight="bold">{confirming.title}</DialogTitle>
      <DialogContent>
        <DialogContentText>{confirming.message}</DialogContentText>
      </DialogContent>
      <DialogActions>
        {confirming.agree}
        {confirming.disagree}
      </DialogActions>
    </Dialog>
  );
};
