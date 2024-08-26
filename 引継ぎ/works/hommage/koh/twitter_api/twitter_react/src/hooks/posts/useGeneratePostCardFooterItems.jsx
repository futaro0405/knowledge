import React from "react";
import { useRecoilState, useSetRecoilState } from "recoil";

import { currentUserState, loadingState } from "../../globalStates/atoms.js";
import { Typography } from "@mui/material";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import RepeatIcon from "@mui/icons-material/Repeat";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import FavoriteIcon from "@mui/icons-material/Favorite";

import { createRepost, deleteRepost } from "../../apis/reposts.js";
import { createLike, deleteLike } from "../../apis/likes.js";
import { createBookmark, deleteBookmark } from "../../apis/bookmarks.js";
import { fetchUser } from "../../apis/users.js";

export const useGeneratePostCardFooterItems = (props) => {
  const { post, setOpen, reFetch } = props;

  const [currentUser, setCurrentUser] = useRecoilState(currentUserState);
  const setLoading = useSetRecoilState(loadingState);

  const alreadyReposted =
    currentUser.retweets.filter((item) => item.id === post.id).length !== 0;
  const alreadyLiked =
    currentUser.likes.filter((item) => item.id === post.id).length !== 0;
  const alreadyBookmarked =
    currentUser.bookmarks.filter((item) => item.id === post.id).length !== 0;

  const handleClickIcon = async (alreadyDone, createRecord, deleteRecord) => {
    try {
      setLoading(true);

      if (alreadyDone) {
        await deleteRecord(post.id);
      } else {
        await createRecord(post.id);
      }

      await reFetch();
      const res = await fetchUser(currentUser.user_name);
      setCurrentUser(res.data);
    } catch (err) {
      console.log("err", err);
    } finally {
      setLoading(false);
    }
  };

  const footerItems = [
    // コメント
    {
      color: "#1E9BF0",
      background: "#E7EFF8",
      icon: (
        <>
          <ChatBubbleOutlineIcon />
          {post.comment_count !== 0 && (
            <Typography>{post.comment_count}</Typography>
          )}
        </>
      ),
      onClick: (e) => {
        e.stopPropagation();
        setOpen(true);
      },
    },
    // リツイート
    {
      color: "#00BA7C",
      background: "#E7F2EC",
      alreadyDone: alreadyReposted,
      icon: (
        <>
          <RepeatIcon />
          {post.retweet_count !== 0 && (
            <Typography>{post.retweet_count}</Typography>
          )}
        </>
      ),
      onClick: async (e) => {
        e.stopPropagation();
        await handleClickIcon(alreadyReposted, createRepost, deleteRepost);
      },
    },
    // いいね
    {
      color: "#F91780",
      background: "#FAE6ED",
      alreadyDone: alreadyLiked,
      icon: (
        <>
          {alreadyLiked ? <FavoriteIcon /> : <FavoriteBorderIcon />}
          {post.like_count !== 0 && <Typography>{post.like_count}</Typography>}
        </>
      ),
      onClick: async (e) => {
        e.stopPropagation();
        await handleClickIcon(alreadyLiked, createLike, deleteLike);
      },
    },
    // ブックマーク
    {
      color: "#1E9BF0",
      background: "#E7EFF8",
      alreadyDone: alreadyBookmarked,
      icon: (
        <>
          {alreadyBookmarked ? <BookmarkIcon /> : <BookmarkBorderIcon />}
          {post.bookmark_count !== 0 && (
            <Typography>{post.bookmark_count}</Typography>
          )}
        </>
      ),
      onClick: async (e) => {
        e.stopPropagation();
        await handleClickIcon(
          alreadyBookmarked,
          createBookmark,
          deleteBookmark
        );
      },
    },
  ];

  return footerItems;
};
