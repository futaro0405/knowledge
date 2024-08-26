import { useCallback, useEffect, useState } from "react";
import { AxiosInstance } from "../../axios/axiosInstance"

export const GroupAreaHook = () => {
    const { instance } = AxiosInstance();
    const [entries, setEntries] = useState([{
        group_id: 0,
        group: {
            last_message: {
                user_id: 0,
                message: ''
            }
        },
        user: {
            name: '',
            profile_image_url: ''
        }
    }]);

    const getGroup = useCallback(async () => {
        try {
            const entryDatas = await instance.get('/api/v1/groups');
            setEntries(entryDatas.data.another_entries);
        } catch (error) {
            console.log(error);
        }
    }, [])

    useEffect(() => {
        getGroup();
    }, [])

    return { entries };
}