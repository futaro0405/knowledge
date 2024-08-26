import React, { useState } from "react";
import { useRecoilState, useSetRecoilState } from "recoil";
import { useNavigate } from "react-router-dom";

import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import CardMedia from "@mui/material/CardMedia";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import Link from "@mui/material/Link";
import { Button, IconButton, Stack } from "@mui/material";
import RoomOutlinedIcon from "@mui/icons-material/RoomOutlined";
import AttachFileOutlinedIcon from "@mui/icons-material/AttachFileOutlined";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import MailOutlineIcon from "@mui/icons-material/MailOutline";

import { UserEditModal } from "../modals/UserEditModal";

import {
  confirmingState,
  currentUserState,
  loadingState,
} from "../../globalStates/atoms";
import { fetchUser } from "../../apis/users";
import { createFollow, deleteFollow } from "../../apis/follows.js";
import { formatDate } from "../../lib/utility.js";
import { createGroup } from "../../apis/messages.js";

const MessageIconButton = (props) => {
  return (
    <IconButton
      variant="contained"
      edge="start"
      color="black"
      style={{
        border: "1px solid",
        borderColor: "#919496",
      }}
      sx={{ mx: 1 }}
      onClick={props.onClick}
    >
      <MailOutlineIcon />
    </IconButton>
  );
};

const LoggedInButton = (props) => {
  return (
    <Button
      variant="outlined"
      color="black"
      size="large"
      onClick={props.onClick}
      sx={{
        borderRadius: 50,
        fontWeight: "bold",
      }}
    >
      プロフィールを編集
    </Button>
  );
};

const FollowingButton = (props) => {
  return (
    <>
      <MessageIconButton onClick={props.onClicksSendMessage} />
      <Button
        variant="contained"
        color="black"
        size="large"
        onClick={props.onClickFollow}
        sx={{
          borderRadius: 50,
          fontWeight: "bold",
        }}
      >
        フォロー
      </Button>
    </>
  );
};

const UnFollowingButton = (props) => {
  return (
    <>
      <MessageIconButton onClick={props.onClicksSendMessage} />
      <Button
        variant="outlined"
        color="black"
        size="large"
        onClick={props.onClickFollow}
        sx={{
          width: "10rem",
          borderRadius: 50,
          fontWeight: "bold",
          // ホバー時にボタンデザインを変更する
          "& .hoverText": {
            display: "none",
          },
          "&:hover": {
            background: "#FFEDEC",
            borderColor: "#FEC9CE",
            transition: "0s",
            "& .defaultText": { display: "none" },
            "& .hoverText": { display: "inline" },
          },
        }}
      >
        <p className="defaultText">フォロー中</p>
        <p className="hoverText" style={{ color: "#F4202E" }}>
          フォロー解除
        </p>
      </Button>
    </>
  );
};

export const UserDetail = (props) => {
  const { user, isLoggedInUser } = props;
  const [openEditModal, setOpenEditModal] = useState(false);

  const [currentUser, setCurrentUser] = useRecoilState(currentUserState);
  const setLoading = useSetRecoilState(loadingState);
  const setConfirming = useSetRecoilState(confirmingState);

  const navigate = useNavigate();

  /**
   * 確認ダイアログ上の情報
   */
  const confirming = {
    isOpen: true,
    title: `@${user.user_name}さんをフォロー解除しますか？`,
    message:
      "このアカウントのポストがフォロー中タイムラインに表示されなくなります。プロフィールを表示することはできます。 ",
    agree: (
      <Button
        variant="contained"
        color="black"
        onClick={(prev) => {
          handleClickFollowing();
          setConfirming({ ...prev, isOpen: false });
        }}
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

  // ログインユーザのfolloweesに表示ユーザが含まれていたらフォローしている。明示的にBoolean型にキャストする。
  const isFollowing = !!currentUser.followees.find(
    (followee) => followee.user_name === user.user_name
  );

  const handleClickFollowing = async () => {
    try {
      setLoading(true);

      if (isFollowing) {
        await deleteFollow(user.user_name);
      } else {
        await createFollow(user.user_name);
      }

      const res = await fetchUser(currentUser.user_name);
      setCurrentUser(res.data);
    } catch (err) {
      console.log("err", err);
    } finally {
      setLoading(false);
    }
  };

  const handleClickSendMessage = async () => {
    try {
      setLoading(true);
      const res = await createGroup(user);
      const group = res.data;
      navigate(`/messages/${group.id}`);
    } catch (err) {
      console.log("err", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Card variant="outlined" sx={{ border: "none" }}>
        <CardHeader
          title={`${user.name}`}
          titleTypographyProps={{ variant: "h5", fontWeight: "bold" }}
          subheader={`${user.tweets?.length}`.concat("件のポスト")}
        />
        <CardMedia
          component="img"
          height="10"
          sx={{ height: "30vh", margin: "0 auto" }}
          image={user.header_image_path}
          alt="背景画像"
        />
        <CardHeader
          avatar={
            <Avatar
              sx={{ height: "8vh", width: "8vh" }}
              alt={`${user.name}`}
              src={`${user.profile_image_path}`}
            />
          }
          action={
            isLoggedInUser ? (
              <LoggedInButton onClick={() => setOpenEditModal(true)} />
            ) : isFollowing ? (
              <UnFollowingButton
                onClickFollow={() => setConfirming(confirming)}
                onClicksSendMessage={handleClickSendMessage}
              />
            ) : (
              <FollowingButton
                onClickFollow={() => handleClickFollowing()}
                onClicksSendMessage={handleClickSendMessage}
              />
            )
          }
        />
        <CardContent>
          <Typography
            variant="h5"
            fontWeight="bold"
          >{`${user.name}`}</Typography>
          <Typography gutterBottom color="text.secondary">
            {"@".concat(`${user.user_name}`)}
          </Typography>
          <Typography variant="body1" sx={{ whiteSpace: "pre-line" }}>
            {user.introduction}
          </Typography>
          <div
            style={{
              display: "grid",
              gridGap: "0.2rem",
              margin: "0.5rem 0",
              gridTemplateColumns: "repeat(auto-fill, minmax(20rem, 1fr))",
            }}
          >
            {user.place && (
              <Typography noWrap color="secondary">
                <RoomOutlinedIcon />
                {user.place}
              </Typography>
            )}
            {user.website && (
              <Link noWrap href={`https://${user.website}`} underline="hover">
                <AttachFileOutlinedIcon color="secondary" />
                {user.website}
              </Link>
            )}
            <Typography noWrap color="secondary">
              <CalendarMonthOutlinedIcon />
              {`${formatDate(
                new Date(user.created_at)
              )}からTwitterを利用しています`}
            </Typography>
          </div>
          <Stack
            direction="row"
            justifyContent="flex-start"
            alignItems="center"
            spacing={3}
          >
            <Typography color="secondary">
              <strong
                style={{
                  fontWeight: "bold",
                  paddingRight: "0.5rem",
                  color: "black",
                }}
              >
                {user.followees.length}
              </strong>
              フォロー中
            </Typography>
            <Typography color="secondary">
              <strong
                style={{
                  fontWeight: "bold",
                  paddingRight: "0.5rem",
                  color: "black",
                }}
              >
                {user.followers.length}
              </strong>
              フォロワー
            </Typography>
          </Stack>
        </CardContent>
      </Card>
      {/* 編集モーダル */}
      <UserEditModal
        open={openEditModal}
        setOpen={setOpenEditModal}
      ></UserEditModal>
    </>
  );
};
