import React from "react";

import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import PersonAddAltOutlinedIcon from "@mui/icons-material/PersonAddAltOutlined";
import PersonRemoveOutlinedIcon from "@mui/icons-material/PersonRemoveOutlined";

import { useRecoilState, useSetRecoilState } from "recoil";
import {
  confirmingState,
  currentUserState,
  flashState,
  loadingState,
} from "../../globalStates/atoms";
import { Button } from "@mui/material";
import { createFollow, deleteFollow } from "../../apis/follows";
import { fetchUser } from "../../apis/users";

export const useGeneratePostCardMenuItems = (props) => {
  const { record, deleteRecord, afterDeleteRecord, reFetch } = props;

  const [currentUser, setCurrentUser] = useRecoilState(currentUserState);
  const setConfirming = useSetRecoilState(confirmingState);
  const setLoading = useSetRecoilState(loadingState);
  const setFlash = useSetRecoilState(flashState);

  const isLoggedInUser = record.user.user_name === currentUser.user_name;

  // ログインユーザのfolloweesに表示ユーザが含まれていたらフォローしている。明示的にBoolean型にキャストする。
  const isFollowing = !!currentUser.followees.find(
    (followee) => followee.user_name === record.user.user_name
  );

  const handleDeleteRecord = async () => {
    try {
      setLoading(true);
      await deleteRecord(record.id);
      await afterDeleteRecord();

      setFlash({
        isOpen: true,
        severity: "success",
        message: "投稿を削除しました",
      });
    } catch (err) {
      console.log("err", err);
    } finally {
      setLoading(false);
      setConfirming((prev) => ({ ...prev, isOpen: false }));
    }
  };

  const handleClickFollowButton = async () => {
    try {
      setLoading(true);

      if (isFollowing) {
        await deleteFollow(record.user.user_name);
      } else {
        await createFollow(record.user.user_name);
      }

      await reFetch;
      const res = await fetchUser(currentUser.user_name);
      setCurrentUser(res.data);

      setFlash({
        isOpen: true,
        severity: "success",
        message: `@${record.user.user_name}さん${
          isFollowing ? "のフォローを解除しました" : "をフォローしました"
        }`,
      });
    } catch (err) {
      console.log("err", err);
    } finally {
      setLoading(false);
      setConfirming((prev) => ({ ...prev, isOpen: false }));
    }
  };

  /**
   * 削除確認ダイアログ上の情報
   */
  const confirmingDelete = {
    isOpen: true,
    title: "投稿を削除しますか？",
    message:
      "この操作は取り消せません。プロフィール、あなたをフォローしているアカウントのタイムラインから投稿が削除されます。 ",
    agree: (
      <Button
        variant="contained"
        color="error"
        onClick={async () => await handleDeleteRecord()}
        sx={{ borderRadius: 50, fontWeight: "bold" }}
      >
        削除
      </Button>
    ),
    disagree: (
      <Button
        variant="outlined"
        color="black"
        sx={{ borderRadius: 50, fontWeight: "bold" }}
        onClick={() => setConfirming((prev) => ({ ...prev, isOpen: false }))}
      >
        キャンセル
      </Button>
    ),
  };

  /**
   * フォロー解除確認ダイアログ上の情報
   */
  const confirmingUnFollow = {
    isOpen: true,
    title: `@${record.user.user_name}さんをフォロー解除しますか？`,
    message:
      "このアカウントのポストがフォロー中タイムラインに表示されなくなります。プロフィールを表示することはできます。 ",
    agree: (
      <Button
        variant="contained"
        color="black"
        onClick={async () => handleClickFollowButton()}
        sx={{ borderRadius: 50, fontWeight: "bold" }}
      >
        フォロー解除
      </Button>
    ),
    disagree: (
      <Button
        variant="outlined"
        color="black"
        sx={{ borderRadius: 50, fontWeight: "bold" }}
        onClick={() => setConfirming((prev) => ({ ...prev, isOpen: false }))}
      >
        キャンセル
      </Button>
    ),
  };

  const loggedInMenuItems = [
    {
      icon: <DeleteOutlineIcon />,
      title: "削除",
      fontColor: "red",
      onClick: () => setConfirming(confirmingDelete),
    },
  ];

  const followingMenuItems = [
    {
      icon: <PersonAddAltOutlinedIcon />,
      title: `@${record.user.user_name}をフォロー`,
      onClick: () => handleClickFollowButton(),
    },
  ];

  const unFollowingMenuItems = [
    {
      icon: <PersonRemoveOutlinedIcon />,
      title: `@${record.user.user_name}のフォローを解除`,
      onClick: () => setConfirming(confirmingUnFollow),
    },
  ];

  const menuItems = isLoggedInUser
    ? loggedInMenuItems
    : isFollowing
    ? unFollowingMenuItems
    : followingMenuItems;

  return menuItems;
};
