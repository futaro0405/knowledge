import axios from "axios";

import { tweets } from "../urls/index";
import { createDefaultHeaders } from "../lib/utility.js";

export const createRepost = (id) => {
  return axios.post(`${tweets}/${id}/retweets`, null, {
    headers: createDefaultHeaders(),
  });
};

export const deleteRepost = (id) => {
  return axios.delete(`${tweets}/${id}/retweets`, {
    headers: createDefaultHeaders(),
  });
};
