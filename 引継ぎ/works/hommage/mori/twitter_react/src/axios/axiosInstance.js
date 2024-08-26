import axios from "axios";
import { useContext } from "react";
import { CookieContext } from "../providers/TwitterProvider";

export const AxiosInstance = () => {
    const { cookies } = useContext(CookieContext);

    const instance = axios.create({
        baseURL: 'http://localhost:3000',
        headers: {
            'access-token': cookies['access-token'],
            'client': cookies['client'],
            'uid': cookies['uid']
        }
    });
    return { instance };
}