import axios from "axios";

export const AuthHook = () => {
    const BASEURL = 'http://localhost:3000';
    const signUp = async (params) => {
        const response = await axios.post(`${BASEURL}/api/v1/users`, params);
        console.log(response);
    }

    const login = async (params) => {
        const response = await axios.post(`${BASEURL}/api/v1/users/sign_in`, params);
        return response;
    }

    const currentUser = async (cookies) => {
        return await axios.get(`${BASEURL}/api/v1/sessions`, {
            headers: {
                'access-token': cookies['access-token'],
                'client': cookies['client'],
                'uid': cookies['uid']
            }
        }
        )
    }

    return { signUp, login, currentUser };
}