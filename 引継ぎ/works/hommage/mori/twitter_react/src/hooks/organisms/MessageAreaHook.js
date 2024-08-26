import { useCallback, useEffect, useState } from "react";
import { AxiosInstance } from "../../axios/axiosInstance"
import { useParams } from "react-router-dom";

export const MessageAreaHook = () => {
    const { instance } = AxiosInstance();
    const [messages, setMessages] = useState([{
        message: ''
    }]);
    const [anotherUser, setAnotherUser] = useState({
        id: 0,
        name: ''
    })
    const { id } = useParams();
    const [message, setMessage] = useState(
        {
            message: '',
            group_id: id
        }
    );

    const getMessageData = useCallback(async () => {
        try {
            const data = await instance.get(`/api/v1/groups/${id}/messages`);
            setMessages(data.data.messages);
            setAnotherUser(data.data.another_user);
        } catch (error) {
            console.log(error);
        }
    }, [id])

    const onChangeMessage = useCallback(e => {
        const { name, value } = e.target
        setMessage(m => ({
            ...m,
            [name]: value
        }))
    }, [setMessage])


    const submitMessage = useCallback(async (e) => {
        try {
            e.preventDefault();
            await instance.post(
                `/api/v1/groups/${id}/messages`,
                { message: message }
            );
            setMessage(
                {
                    message: '',
                    group_id: id
                }
            )
            getMessageData();
        } catch (error) {
            console.log(error);
        }
    }, [id, message])


    useEffect(() => {
        getMessageData();
    }, [])

    return { messages, anotherUser, submitMessage, message, onChangeMessage };
}