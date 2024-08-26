import React from "react";

import { useSignUp } from "../hooks/useSignUp.jsx";
import { UserForm } from "../components/utils/UserForm.jsx";

export const SignUp = () => {
  const { user, signUpFields, onChangeUser, handleSubmit } = useSignUp();

  return (
    <UserForm
      title="新規登録"
      buttonName="登録"
      fields={signUpFields}
      user={user}
      handleChange={(e) => onChangeUser(e)}
      handleSubmit={handleSubmit}
    />
  );
};
