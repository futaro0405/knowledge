import axios from "axios";

import { comments } from "../urls/index";

export const createComment = (comment, headers) => {
  return axios.post(comments, { comment: comment }, { headers: headers });
};

export const deleteComment = (id) => {
  return axios.delete(`${comments}/${id}`);
};
