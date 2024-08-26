import axios from "axios";

import { tweets } from "../urls/index";
import { createDefaultHeaders } from "../lib/utility.js";

export const createLike = (id) => {
  return axios.post(`${tweets}/${id}/favorites`, null, {
    headers: createDefaultHeaders(),
  });
};

export const deleteLike = (id) => {
  return axios.delete(`${tweets}/${id}/favorites`, {
    headers: createDefaultHeaders(),
  });
};
