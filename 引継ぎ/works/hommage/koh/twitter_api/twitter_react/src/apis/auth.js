import axios from "axios";
import Cookies from "js-cookie";

import { users, sessions, sign_in } from "../urls/index";

export const signUp = (params) => {
  return axios.post(users, params);
};

export const logIn = (params) => {
  return axios.post(sign_in, params);
};

export const initializeCurrentUser = async () => {
  // Cookie未設定の場合、空のオブジェクトを返す
  if (
    !Cookies.get("_access_token") ||
    !Cookies.get("_client") ||
    !Cookies.get("_uid")
  )
    return {};

  const res = await axios.get(sessions, {
    headers: {
      "access-token": Cookies.get("_access_token"),
      client: Cookies.get("_client"),
      uid: Cookies.get("_uid"),
    },
  });

  if (res.status === 200) {
    return res.data.data;
  } else {
    return {};
  }
};
