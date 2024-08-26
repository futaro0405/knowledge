import axios from "axios";

import { users, profile } from "../urls/index";
import { createDefaultHeaders } from "../lib/utility";

export const fetchUser = (user_name) => {
  return axios.get(`${users}/${user_name}`);
};

export const updateUser = (formData, headers) => {
  return axios.post(profile, formData, { headers: headers });
};

export const deleteUser = () => {
  return axios.delete(users, { headers: createDefaultHeaders() });
};
