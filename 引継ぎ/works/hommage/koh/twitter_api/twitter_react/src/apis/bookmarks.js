import axios from "axios";

import { tweets, bookmarks } from "../urls/index";
import { createDefaultHeaders } from "../lib/utility.js";

export const fetchBookmarkingPosts = () => {
  return axios.get(bookmarks, {
    headers: createDefaultHeaders(),
  });
};

export const createBookmark = (id) => {
  return axios.post(`${tweets}/${id}/bookmarks`, null, {
    headers: createDefaultHeaders(),
  });
};

export const deleteBookmark = (id) => {
  return axios.delete(`${tweets}/${id}/bookmarks`, {
    headers: createDefaultHeaders(),
  });
};
