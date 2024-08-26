import { useState } from "react";
import { useRecoilState, useSetRecoilState } from "recoil";
import Cookies from "js-cookie";

import {
  currentUserState,
  flashState,
  loadingState,
} from "../../globalStates/atoms.js";
import { updateUser } from "../../apis/users.js";

const userEditFields = [
  {
    label: "表示名",
    name: "name",
    type: "text",
    required: true,
    helperText: "投稿上に表示されるアカウント名（表示名）です。",
  },
  {
    name: "birthdate",
    label: "生年月日",
    type: "date",
    required: true,
    helperText: "",
  },
  {
    name: "introduction",
    label: "自己紹介",
    type: "text",
    required: false,
    helperText: "",
    multiline: true,
    rows: 3,
  },
  {
    name: "place",
    label: "場所",
    type: "text",
    required: false,
    helperText: "",
  },
  {
    name: "website",
    label: "ウェブサイト",
    type: "text",
    required: false,
    helperText: "",
  },
];
export const useUserEdit = (props) => {
  const { setOpen } = props;

  const [currentUser, setCurrentUser] = useRecoilState(currentUserState);
  const [user, setUser] = useState(currentUser);
  const [profileImage, setProfileImage] = useState(null);
  const [headerImage, setHeaderImage] = useState(null);

  const setFlash = useSetRecoilState(flashState);
  const setLoading = useSetRecoilState(loadingState);

  const handleClose = () => setOpen(false);

  const handleAttachImage = (e, setter) => {
    const file = e.target.files[0];
    if (!file) return;

    setter(file);
    e.target.value = "";
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prevUser) => ({ ...prevUser, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const headers = {
        "access-token": Cookies.get("_access_token"),
        client: Cookies.get("_client"),
        uid: Cookies.get("_uid"),
        "content-type": "multipart/form-data",
      };

      const formData = createFormData(user);
      const res = await updateUser(formData, headers);

      setCurrentUser(res.data);
      handleClose();
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

  const createFormData = (user) => {
    const formData = new FormData();

    // keyとなるuser_nameと更新モーダル上の内容をappendする
    formData.append("user_name", user["user_name"]);
    userEditFields.forEach(({ name }) => {
      formData.append(name, user[name]);
    });
    if (headerImage) formData.append("header_image", headerImage);
    if (profileImage) formData.append("profile_image", profileImage);

    return formData;
  };

  return {
    userEditFields,
    user,
    headerImage,
    setHeaderImage,
    profileImage,
    setProfileImage,
    handleClose,
    handleChange,
    handleAttachImage,
    handleSubmit,
  };
};
