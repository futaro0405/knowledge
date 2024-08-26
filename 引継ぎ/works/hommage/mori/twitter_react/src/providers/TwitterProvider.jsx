import { createContext, useState } from "react";
import { useCookies } from "react-cookie";

export const CookieContext = createContext({});
export const currentUserContext = createContext({});

export const TwitterProvider = ({ children }) => {
    const dataInCurrentUser = {
        uid: '',
        client: '',
        name: ''
    };

    const [cookies, setCookie, removeCookie] = useCookies();
    const [currentUserData, setCurrentUserData] = useState({
        is_login: false,
        data: dataInCurrentUser
    });


    return (
        <CookieContext.Provider value={{ cookies, setCookie, removeCookie }}>
            <currentUserContext.Provider value={{ currentUserData, setCurrentUserData }}>
                {children}
            </currentUserContext.Provider>
        </CookieContext.Provider>
    )
}