import { useEffect, useState } from "react";
import { useSetRecoilState } from "recoil";

import { loadingState } from "../../globalStates/atoms";
import { fetchPosts } from "../../apis/posts";

const LIMIT = 10;

const initialPostsData = {
  posts: [],
  prevOffset: 0,
  nextOffset: LIMIT,
};

export const useAllPostsFetch = () => {
  const [postsData, setPostsData] = useState(initialPostsData);

  const setLoading = useSetRecoilState(loadingState);

  useEffect(() => {
    (async () => {
      setLoading(true);
      await fetchPagenatePosts(0);
      setLoading(false);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /**
   * 投稿削除後は0ページ目の一覧の情報を再取得
   */
  const afterDeletePost = async () => await fetchPagenatePosts(0);

  /**
   * コメント投稿後は現在表示中のページの一覧の情報を再取得
   */
  const afterCreateComment = async () => await reFetch();

  const reFetch = async () => {
    const { prevOffset, nextOffset } = postsData;
    const currentOffset =
      nextOffset - prevOffset === LIMIT ? 0 : nextOffset - LIMIT;
    await fetchPagenatePosts(currentOffset);
  };

  const handleClickPrev = () => {
    (async () => {
      setLoading(true);
      await fetchPagenatePosts(postsData.prevOffset);
      setLoading(false);
    })();
  };

  const handleClickNext = () => {
    (async () => {
      setLoading(true);
      await fetchPagenatePosts(postsData.nextOffset);
      setLoading(false);
    })();
  };

  const fetchPagenatePosts = async (offset) => {
    const { data } = await fetchPosts(LIMIT, offset);
    const fetchedData = data.data;

    // fetchした際に次に表示するデータがある場合のみ、次の表示データとして格納する。
    if (fetchedData.length !== 0) {
      setPostsData((prev) => ({
        ...prev,
        posts: fetchedData,
        prevOffset: data.prev_offset,
        nextOffset: data.next_offset,
      }));
    }
  };

  return {
    postsData,
    handleClickPrev,
    handleClickNext,
    fetchPagenatePosts,
    afterDeletePost,
    afterCreateComment,
    reFetch,
  };
};
