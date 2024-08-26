import axios from "axios";

import { groups } from "../urls/index";
import { createDefaultHeaders } from "../lib/utility.js";

export const fetchGroups = () => {
  return axios.get(groups, {
    headers: createDefaultHeaders(),
  });
};

export const createGroup = (user) => {
  return axios.post(
    groups,
    { user_id: user.id },
    {
      headers: createDefaultHeaders(),
    }
  );
};

export const fetchMessages = (group_id) => {
  return axios.get(`${groups}/${group_id}/messages`, {
    headers: createDefaultHeaders(),
  });
};

export const createMessage = (message, group) => {
  return axios.post(
    `${groups}/${group.id}/messages`,
    { message: message, group_id: group.id },
    {
      headers: createDefaultHeaders(),
    }
  );
};
