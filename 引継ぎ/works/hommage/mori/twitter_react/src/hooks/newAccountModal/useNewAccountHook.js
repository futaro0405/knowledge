import { useState } from "react";
import { AuthHook } from "../auth/authHook";

export const useNewAccountHook = () => {
    const [account, setAccount] = useState({
        name: '',
        email: '',
        password: '',
        passwordConfirmation: ''
    });
    const { signUp } = AuthHook();
    const [errorMsgs, setErrorMsgs] = useState([]);

    const onChangeAccount = (e) => {
        const { name, value } = e.target
        setAccount({ ...account, [name]: value });
    }

    const onClickSignup = async (e) => {
        try {
            e.preventDefault();
            console.log(account);
            await signUp(account);
        } catch (error) {
            setErrorMsgs(error.response.data.errors.full_messages);
        }
    }

    return {
        account,
        onChangeAccount,
        errorMsgs,
        onClickSignup
    };
}