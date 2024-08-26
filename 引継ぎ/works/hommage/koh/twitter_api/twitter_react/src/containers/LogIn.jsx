import React from "react";

import { useLogIn } from "../hooks/useLogIn.jsx";
import { UserForm } from "../components/utils/UserForm.jsx";

export const LogIn = () => {
  const { user, logInFields, onChangeUser, handleSubmit } = useLogIn();

  return (
    <UserForm
      title="ログイン"
      buttonName="ログイン"
      fields={logInFields}
      user={user}
      handleChange={(e) => onChangeUser(e)}
      handleSubmit={handleSubmit}
    />
  );
};
