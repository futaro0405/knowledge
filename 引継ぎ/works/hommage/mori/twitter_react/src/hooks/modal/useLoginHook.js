import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthHook } from "../auth/authHook";
import { CookieContext } from "../../providers/TwitterProvider";

export const useLoginHook = () => {
    const [loginAccount, setLoginAccount] = useState({
        email: '',
        password: ''
    });
    const { setCookie } = useContext(CookieContext);
    const [errorMsgs, setErrorMsgs] = useState([]);
    const history = useNavigate();

    const { login } = AuthHook();

    const onChangeLoginAccount = (e) => {
        const { name, value } = e.target;
        setLoginAccount({ ...loginAccount, [name]: value });
    }

    const onClickLogin = async (e) => {
        try {
            e.preventDefault();
            const res = await login(loginAccount);
            if (res.status === 200) {
                setCookie('access-token', res.headers['access-token']);
                setCookie('client', res.headers['client']);
                setCookie('uid', res.headers['uid']);
                history('/toppage');
            }
        } catch (error) {
            console.log(error);
            setErrorMsgs(error.response.data.errors);
        }
    }

    return { loginAccount, errorMsgs, onChangeLoginAccount, onClickLogin };
}