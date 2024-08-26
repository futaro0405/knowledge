import axios from "axios";

import { tweets, images } from "../urls/index";

export const fetchPosts = (limit, offset) => {
  return axios.get(`${tweets}?limit=${limit}}&offset=${offset}}`);
};

export const fetchPost = (id) => {
  return axios.get(`${tweets}/${id}/comments`);
};

export const createPost = (post, headers) => {
  return axios.post(tweets, { post: post }, { headers: headers });
};

export const attachImages = (formData, headers) => {
  return axios.post(images, formData, { headers: headers });
};

export const deletePost = (id) => {
  return axios.delete(`${tweets}/${id}`);
};
