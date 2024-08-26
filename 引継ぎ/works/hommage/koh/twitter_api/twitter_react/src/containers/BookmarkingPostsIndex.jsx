import React from "react";
import { useSetRecoilState } from "recoil";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { Card } from "@mui/material";
import { PostCard } from "../components/cards/PostCard";

import { loadingState } from "../globalStates/atoms";
import { fetchBookmarkingPosts } from "../apis/bookmarks";

export const BookmarkingPostsIndex = () => {
  const [posts, setPosts] = useState(null);

  const setLoading = useSetRecoilState(loadingState);
  const navigate = useNavigate();

  useEffect(() => {
    (async () => await initializeShowingPosts())();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const initializeShowingPosts = async () => {
    try {
      setLoading(true);
      const res = await fetchBookmarkingPosts();
      setPosts(res.data);
    } catch (err) {
      // データがなかった場合、NotFoundページに遷移する
      console.log("err", err);
      navigate("/not_found");
    } finally {
      setLoading(false);
    }
  };

  const afterCreateComment = async () => await initializeShowingPosts();
  const afterDeletePost = async () => await initializeShowingPosts();

  const reFetch = async () => await initializeShowingPosts();

  return (
    <>
      {posts && (
        <Card
          variant="outlined"
          sx={{
            textAlign: "center",
            borderRight: "none",
            borderLeft: "none",
            borderRadius: "0%",
          }}
        >
          {posts.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              afterDeletePost={afterDeletePost}
              afterCreateComment={() => afterCreateComment()}
              reFetch={() => reFetch()}
            />
          ))}
        </Card>
      )}
    </>
  );
};
