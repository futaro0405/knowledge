import { useState } from "react";
import { useSetRecoilState } from "recoil";
import { useNavigate } from "react-router-dom";

import Cookies from "js-cookie";

import { flashState, loadingState } from "../../globalStates/atoms";
import { createPost, attachImages } from "../../apis/posts";

const inititalPost = {
  content: "",
};

const MAX_LENGTH = 140;

export const usePostCreate = (props) => {
  const { fetchPagenatePosts } = props;

  const [post, setPost] = useState(inititalPost);
  const [images, setImages] = useState([]);

  const navigate = useNavigate();
  const setFlash = useSetRecoilState(flashState);
  const setLoading = useSetRecoilState(loadingState);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPost((prevPost) => ({ ...prevPost, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (post.content.length >= MAX_LENGTH) {
      setFlash({
        isOpen: true,
        severity: "error",
        message: "ポストは140文字以内で入力してください。",
      });
      return;
    }

    try {
      setLoading(true);

      const headers = {
        "access-token": Cookies.get("_access_token"),
        client: Cookies.get("_client"),
        uid: Cookies.get("_uid"),
      };

      // 本文を登録する
      const postResponse = await createPost(post, headers);

      // 画像添付されている場合、FormDataを作成し画像を登録する
      if (images.length !== 0) {
        const formData = createFormData(postResponse);
        const imageHeaders = {
          ...headers,
          "content-type": "multipart/form-data",
        };
        await attachImages(formData, imageHeaders);
      }

      setPost(inititalPost);
      setImages([]);
      navigate("/home");

      // 作成した投稿を描画するために再度fetchする
      await fetchPagenatePosts(0);

      setFlash({
        isOpen: true,
        severity: "success",
        message: "ポストしました",
      });
    } catch (err) {
      console.log("err", err);
      setFlash({
        isOpen: true,
        severity: "error",
        message: err.response.data.errors,
      });
    } finally {
      setLoading(false);
    }
  };

  const createFormData = (postResponse) => {
    const formData = new FormData();

    formData.append("post_id", postResponse.data.data.id);
    images.forEach((image) => {
      formData.append("images[]", image);
    });

    return formData;
  };

  return {
    post,
    images,
    setImages,
    handleChange,
    handleSubmit,
  };
};
