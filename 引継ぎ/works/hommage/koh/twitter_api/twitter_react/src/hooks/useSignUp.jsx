import { useState } from "react";
import { useSetRecoilState } from "recoil";
import { useNavigate } from "react-router-dom";

import { CONFIRM_SUCCESS_URL } from "../urls/index";

import { flashState } from "../globalStates/atoms";
import { loadingState } from "../globalStates/atoms";

import { signUp } from "../apis/auth";

const signUpFields = [
  {
    label: "表示名",
    name: "name",
    type: "text",
    helperText: "投稿上に表示されるアカウント名（表示名）です。",
  },
  {
    label: "ユーザ名",
    name: "user_name",
    type: "text",
    helperText: "ユーザを固有に識別する名前です。",
  },
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
  {
    name: "password_confirmation",
    label: "パスワード(確認)",
    type: "password",
    helperText: "",
  },
  {
    name: "phone",
    label: "電話番号",
    type: "text",
    helperText: "",
  },
  {
    name: "birthdate",
    label: "生年月日",
    type: "date",
    helperText: "",
  },
];

const initialUser = {
  name: "",
  email: "",
  password: "",
  password_confirmation: "",
  phone: "",
  birthdate: "",
};

export const useSignUp = () => {
  const [user, setUser] = useState(initialUser);

  const navigate = useNavigate();
  const setFlash = useSetRecoilState(flashState);
  const setLoading = useSetRecoilState(loadingState);

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

      const signUpParams = {
        ...user,
        confirm_success_url: CONFIRM_SUCCESS_URL,
      };
      const res = await signUp(signUpParams);

      if (res.status === 200) {
        navigate("/home");

        setFlash({
          isOpen: true,
          severity: "success",
          message: "認証メールを送信しました。\r\nメールを確認してください。",
        });
      } else {
        setFlash({
          isOpen: true,
          severity: "error",
          message: res.data.errors.full_messages.join("\r\n"),
        });
      }
    } catch (err) {
      console.log("err", err);
      setFlash({
        isOpen: true,
        severity: "error",
        message: err.response.data.errors.full_messages.join("\r\n"),
      });
    } finally {
      setLoading(false);
    }
  };

  return {
    user,
    signUpFields,
    onChangeUser,
    handleSubmit,
  };
};
