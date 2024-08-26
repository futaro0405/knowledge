import React from "react";
import Cookies from "js-cookie";
import { useRecoilState, useSetRecoilState } from "recoil";
import { NavLink, Outlet } from "react-router-dom";

import { Box, Button, ListItem, Stack, Typography } from "@mui/material";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";

import { UnLoggedInHome } from "../pages/UnLoggedInHome";
import { SideBarFooter } from "../components/SideBarFooter";

import {
  confirmingState,
  currentUserState,
  flashState,
} from "../globalStates/atoms";

export const Layout = () => {
  const [currentUser, setCurrentUser] = useRecoilState(currentUserState);
  const setFlash = useSetRecoilState(flashState);
  const setConfirming = useSetRecoilState(confirmingState);

  const isLogin = Object.keys(currentUser).length !== 0;

  const handleLogout = () => {
    setCurrentUser({});

    Cookies.remove("_access_token");
    Cookies.remove("_client");
    Cookies.remove("_uid");

    setFlash({
      isOpen: true,
      severity: "success",
      message: "ログアウトしました。",
    });
  };

  const navItems = [
    {
      icon: <HomeOutlinedIcon sx={{ fontSize: 40 }} />,
      href: "/home",
      title: "ホーム",
    },
    {
      icon: <NotificationsOutlinedIcon sx={{ fontSize: 40 }} />,
      href: "/notifications",
      title: "通知",
    },
    {
      icon: <MailOutlineIcon sx={{ fontSize: 40 }} />,
      href: "/messages",
      title: "メッセージ",
    },
    {
      icon: <BookmarkBorderIcon sx={{ fontSize: 40 }} />,
      href: "/bookmarks",
      title: "ブックマーク",
    },
    {
      icon: <PersonOutlineIcon sx={{ fontSize: 40 }} />,
      href: `/${currentUser.user_name}`,
      title: "プロフィール",
    },
    {
      icon: <ExitToAppIcon sx={{ fontSize: 40 }} />,
      onClick: () => setConfirming(confirming),
      title: `ログアウト`,
    },
  ];

  /**
   * ログアウト確認ダイアログ上の情報
   */
  const confirming = {
    isOpen: true,
    title: "Xからログアウトしますか？",
    message: "いつでもログインし直すことができます。",
    agree: (
      <Button
        variant="contained"
        color="black"
        onClick={(prev) => {
          handleLogout();
          setConfirming({ ...prev, isOpen: false });
        }}
        sx={{ borderRadius: 50, fontWeight: "bold" }}
      >
        ログアウト
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
    <>
      {isLogin ? (
        // ログインしている場合、サイドバー付きの各ページを表示
        <div className="min-h-screen flex flex-col">
          <div className="flex flex-row flex-1">
            <aside className="pl-3 pt-3 w-80 border-r-2 fixed z-40 h-screen translate-x-0">
              <nav className="h-full px-3 py-4 overflow-y-auto">
                <div className="pl-3 mb-5">
                  <svg
                    className="w-[36px] h-[36px] text-gray-800 dark:text-white"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fill="currentColor"
                      d="M12.186 8.672 18.743.947h-2.927l-5.005 5.9-4.44-5.9H0l7.434 9.876-6.986 8.23h2.927l5.434-6.4 4.82 6.4H20L12.186 8.672Zm-2.267 2.671L8.544 9.515 3.2 2.42h2.2l4.312 5.719 1.375 1.828 5.731 7.613h-2.2l-4.699-6.237Z"
                    />
                  </svg>
                </div>
                <ul className="space-y-2 font-medium">
                  {navItems.map(({ icon, href, title, onClick }) => (
                    <li className="mx-2 py-4" key={title}>
                      <NavLink to={href} onClick={onClick}>
                        <ListItem button sx={{ p: 0 }}>
                          <Stack
                            direction="row"
                            justifyContent="flex-start"
                            alignItems="center"
                            spacing={3}
                          >
                            {icon}
                            <Typography variant="h5">{title}</Typography>
                          </Stack>
                        </ListItem>
                      </NavLink>
                    </li>
                  ))}
                </ul>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    my: 4,
                  }}
                >
                  <Button
                    type="submit"
                    variant="contained"
                    size="large"
                    onClick={() => {}}
                    sx={{
                      borderRadius: 50,
                      fontWeight: "bold",
                      width: "80%",
                    }}
                  >
                    ポストする
                  </Button>
                </Box>
                <Box
                  sx={{
                    position: "absolute",
                    boxSizing: "border-box",
                    width: "90%",
                    bottom: 0,
                    mb: 2,
                  }}
                >
                  <SideBarFooter
                    user={currentUser}
                    handleLogout={handleLogout}
                  />
                </Box>
              </nav>
            </aside>
            <main className="flex-1 ml-80">
              <Outlet />
            </main>
          </div>
        </div>
      ) : (
        // ログインしていない場合、非ログイン時のホーム画面を表示
        <UnLoggedInHome />
      )}
    </>
  );
};
