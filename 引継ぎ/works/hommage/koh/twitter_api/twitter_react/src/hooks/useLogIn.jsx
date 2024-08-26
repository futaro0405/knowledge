import { useEffect, useState } from "react";
import { useSetRecoilState } from "recoil";
import { useLocation, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

import { currentUserState, flashState } from "../globalStates/atoms";
import { loadingState } from "../globalStates/atoms";

import { logIn } from "../apis/auth";
import { fetchUser } from "../apis/users";

const logInFields = [
  {
    name: "email",
    label: "メールアドレス",
    type: "text",
    helperText: "",
  },
  {
    name: "password",
    label: "パスワード",
    type: "password",
    helperText: "6文字以上",
  },
];

const initialUser = {
  email: "",
  password: "",
};

export const useLogIn = () => {
  const [user, setUser] = useState(initialUser);

  const navigate = useNavigate();

  const setFlash = useSetRecoilState(flashState);
  const setLoading = useSetRecoilState(loadingState);
  const setCurrentUser = useSetRecoilState(currentUserState);

  const query = new URLSearchParams(useLocation().search);
  // 文字列で取得されるため、Booleanに型変換する
  const isAccountConfirmationSuccess = JSON.parse(
    query.get("account_confirmation_success")
  );

  // メール認証後のログイン画面表示時のみflashを表示する
  useEffect(() => {
    if (!isAccountConfirmationSuccess) return;

    setFlash({
      isOpen: true,
      severity: "success",
      message: "メール認証に成功しました。\r\nログインを行ってください。",
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onChangeUser = (e) => {
    const { name, value } = e.target;
    setUser((prevUser) => ({ ...prevUser, [name]: value }));
  };

  const isBlankSomeField = (user) => {
    return Object.keys(user).some((key) => !user[key]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isBlankSomeField(user)) {
      setFlash({
        isOpen: true,
        severity: "info",
        message: "空欄の項目があります。",
      });
      return;
    }

    try {
      setLoading(true);
      const res = await logIn(user);

      if (res.status === 200) {
        // Cookieにログイン情報のtokenを保持
        Cookies.set("_access_token", res.headers["access-token"]);
        Cookies.set("_client", res.headers["client"]);
        Cookies.set("_uid", res.headers["uid"]);

        // プロフィール画像やツイート一覧情報を取得する
        const fetched = await fetchUser(res.data.data.user_name);
        setCurrentUser(fetched.data);

        navigate("/home");

        setFlash({
          isOpen: true,
          severity: "success",
          message: "ログインに成功しました。",
        });
      } else {
        setFlash({
          isOpen: true,
          severity: "error",
          message: res.data.errors.join("\r\n"),
        });
      }
    } catch (err) {
      console.log("err", err);
      setFlash({
        isOpen: true,
        severity: "error",
        message: err.response.data.errors.join("\r\n"),
      });
    } finally {
      setLoading(false);
    }
  };

  return {
    user,
    logInFields,
    onChangeUser,
    handleSubmit,
  };
};
