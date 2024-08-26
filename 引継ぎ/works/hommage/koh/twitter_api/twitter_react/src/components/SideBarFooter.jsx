import React from "react";
import { useSetRecoilState } from "recoil";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

import {
  Avatar,
  Button,
  Card,
  CardActionArea,
  CardActions,
  CardHeader,
} from "@mui/material";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import PersonOffIcon from "@mui/icons-material/PersonOff";

import { ExpandableMenu } from "./utils/ExpandableMenu";

import {
  confirmingState,
  currentUserState,
  flashState,
  loadingState,
} from "../globalStates/atoms";
import { deleteUser } from "../apis/users";

export const SideBarFooter = (props) => {
  const { user } = props;
  const setConfirming = useSetRecoilState(confirmingState);
  const setLoading = useSetRecoilState(loadingState);
  const setFlash = useSetRecoilState(flashState);

  const setCurrentUser = useSetRecoilState(currentUserState);

  const navigate = useNavigate();

  const handleDeleteUser = async () => {
    try {
      setLoading(true);
      await deleteUser();

      setCurrentUser({});

      Cookies.remove("_access_token");
      Cookies.remove("_client");
      Cookies.remove("_uid");

      setFlash({
        isOpen: true,
        severity: "success",
        message: "Xから退会しました",
      });
    } catch (err) {
      console.log("err", err);
    } finally {
      setLoading(false);
    }
  };

  const menuItems = [
    {
      icon: <PersonOffIcon />,
      title: `Xから退会`,
      onClick: () => setConfirming(confirming),
    },
  ];

  /**
   * 確認ダイアログ上の情報
   */
  const confirming = {
    isOpen: true,
    title: "Xから退会しますか？",
    message:
      "アカウントが削除されます。この操作は取り消せません。表示名、ユーザー名、公開プロフィールがXに表示されなくなります。",
    agree: (
      <Button
        variant="contained"
        color="error"
        onClick={async (prev) => {
          await handleDeleteUser();
          setConfirming({ ...prev, isOpen: false });
        }}
        sx={{ borderRadius: 50, fontWeight: "bold" }}
      >
        退会
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

  return (
    <Card
      variant="outlined"
      sx={{
        width: "100%",
        border: "none",
        margin: "0 auto",
      }}
    >
      <CardActionArea
        onClick={(e) => {
          navigate(`/${user.user_name}`);
        }}
      >
        <CardHeader
          sx={{ p: 1 }}
          avatar={
            <CardActions
              sx={{
                zIndex: (theme) => theme.zIndex.appBar + 1,
              }}
              disableSpacing
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/${user.user_name}`);
              }}
            >
              <Avatar
                sx={{
                  height: "40px",
                  width: "40px",
                  p: 0,
                  "&:hover": {
                    cursor: "pointer",
                    opacity: "0.8",
                  },
                }}
                alt={`${user.name}`}
                src={`${user.profile_image_path}`}
              />
            </CardActions>
          }
          action={
            <ExpandableMenu
              displayIcon={<MoreHorizIcon />}
              menuItems={menuItems}
            />
          }
          title={`${user.name}`}
          titleTypographyProps={{
            variant: "body1",
            fontWeight: "bold",
            px: 1,
          }}
          subheader={"@".concat(`${user.user_name}`)}
          subheaderTypographyProps={{ px: 1 }}
        />
      </CardActionArea>
    </Card>
  );
};
