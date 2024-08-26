import { useState } from "react";
import { useSetRecoilState } from "recoil";
import Cookies from "js-cookie";

import { flashState, loadingState } from "../../globalStates/atoms.js";
import { createComment } from "../../apis/comments.js";

const inititalComment = {
  content: "",
};

const MAX_LENGTH = 140;

export const useCommentCreate = (props) => {
  const { post, setOpen, afterCreateComment } = props;
  const [comment, setComment] = useState(inititalComment);
  const setLoading = useSetRecoilState(loadingState);
  const setFlash = useSetRecoilState(flashState);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setComment((prev) => ({ ...prev, [name]: value }));
  };

  const handleCreateComment = async (e) => {
    e.preventDefault();

    if (comment.content.length >= MAX_LENGTH) {
      setFlash({
        isOpen: true,
        severity: "error",
        message: "コメントは140文字以内で入力してください。",
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

      const requestComment = {
        post_id: post.id,
        content: comment.content,
      };
      await createComment(requestComment, headers);

      setOpen(false);
      setComment(inititalComment);
      await afterCreateComment();

      setFlash({
        isOpen: true,
        severity: "success",
        message: "コメントしました",
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

  return {
    comment,
    handleChange,
    handleCreateComment,
  };
};
