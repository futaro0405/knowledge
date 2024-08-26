import { useEffect, useState } from "react";
import { useSetRecoilState } from "recoil";

import { loadingState } from "../../globalStates/atoms";
import { fetchPost } from "../../apis/posts";
import { useNavigate, useParams } from "react-router-dom";

export const usePostFetch = () => {
  const [post, setPost] = useState(null);
  const { id } = useParams();

  const setLoading = useSetRecoilState(loadingState);
  const navigate = useNavigate();

  useEffect(() => {
    (async () => await initializeShowingPost(id))();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const initializeShowingPost = async (id) => {
    try {
      setLoading(true);
      const res = await fetchPost(id);
      setPost(res.data);
    } catch (err) {
      // データがなかった場合、NotFoundページに遷移する
      console.log("err", err);
      navigate("/not_found");
    } finally {
      setLoading(false);
    }
  };

  /**
   * コメント削除後、コメント投稿後は投稿詳細を再取得する
   */
  const afterDeleteComment = async () => initializeShowingPost(id);
  const afterCreateComment = async () => initializeShowingPost(id);

  const reFetch = async () => initializeShowingPost(id);

  /**
   * 投稿削除後はプロフィール画面を表示する
   */
  const afterDeletePost = () => navigate(`/${post.user.user_name}`);

  return {
    post,
    afterDeletePost,
    afterCreateComment,
    afterDeleteComment,
    reFetch,
  };
};
