import axios from "axios";

import { notifications } from "../urls/index";
import { createDefaultHeaders } from "../lib/utility.js";

export const fetchNotifications = () => {
  return axios.get(notifications, {
    headers: createDefaultHeaders(),
  });
};
