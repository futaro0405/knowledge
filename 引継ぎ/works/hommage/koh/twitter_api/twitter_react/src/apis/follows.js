import axios from "axios";

import { users } from "../urls/index";
import { createDefaultHeaders } from "../lib/utility.js";

export const createFollow = (user_name) => {
  return axios.post(`${users}/${user_name}/follows`, null, {
    headers: createDefaultHeaders(),
  });
};

export const deleteFollow = (user_name) => {
  return axios.delete(`${users}/${user_name}/follows`, {
    headers: createDefaultHeaders(),
  });
};
