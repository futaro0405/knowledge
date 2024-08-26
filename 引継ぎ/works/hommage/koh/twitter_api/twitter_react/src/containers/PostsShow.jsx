import React from "react";

import { usePostFetch } from "../hooks/posts/usePostFetch";
import { CommentCard } from "../components/cards/CommentCard";
import { Card } from "@mui/material";
import { PostCard } from "../components/cards/PostCard";

export const PostsShow = () => {
  const {
    post,
    afterDeletePost,
    afterCreateComment,
    afterDeleteComment,
    reFetch,
  } = usePostFetch();

  return (
    <>
      {post && (
        <Card
          variant="outlined"
          sx={{
            textAlign: "center",
            borderRight: "none",
            borderLeft: "none",
            borderRadius: "0%",
          }}
        >
          <PostCard
            key={post.id}
            post={post}
            afterDeletePost={() => afterDeletePost()}
            afterCreateComment={() => afterCreateComment()}
            reFetch={() => reFetch()}
          />
          {post.comments?.map((comment) => (
            <CommentCard
              key={comment.id}
              comment={comment}
              afterDeleteComment={() => afterDeleteComment()}
              afterCreateComment={() => afterCreateComment()}
              reFetch={() => reFetch()}
            />
          ))}
        </Card>
      )}
    </>
  );
};
