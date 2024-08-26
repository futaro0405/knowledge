import { atom } from "recoil";
import { initializeCurrentUser } from "../apis/auth";

export const flashState = atom({
  key: "flash",
  default: {
    isOpen: false,
    severity: "info",
    message: "",
  },
});

export const loadingState = atom({
  key: "loading",
  default: false,
});

export const currentUserState = atom({
  key: "currentUser",
  default: await initializeCurrentUser(),
});

export const confirmingState = atom({
  key: "confirming",
  default: {
    isOpen: false,
    title: "",
    message: "",
    agree: null,
    disagree: null,
  },
});
