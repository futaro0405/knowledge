import { useCallback, useEffect, useState } from "react";

import { AxiosInstance } from "../../axios/axiosInstance"
import { useLocation } from "react-router-dom";


export const TweetContentsAreaHook = () => {
    const [allTweets, setAllTweets] = useState([]);

    // リロードしてページが最初に戻らないように、クエリパラメータのoffsetを初期値に設定
    const search = useLocation().search;
    const query = new URLSearchParams(search);
    const [offset, setOffset] = useState(() => {
        if (Number(query.get('offset')) > 0) {
            return Number(query.get('offset'));
        } else {
            return 0;
        }
    });

    const [totalPage, setTotalPage] = useState(0);
    const { instance } = AxiosInstance();
    const LIMIT = 10;

    const getAllTweets = useCallback(async () => {
        const tweets = await instance.get(
            '/api/v1/tweets',
            {
                params: {
                    limit: LIMIT,
                    offset: offset
                }
            }
        )
        setAllTweets(tweets.data.tweet);
        setTotalPage(tweets.data.total_page);
    }, [instance, offset])

    const doGetTweets = useCallback(async () => {
        await getAllTweets();
    }, [getAllTweets])

    useEffect(() => {
        doGetTweets();
    }, [offset])

    return { allTweets, LIMIT, offset, setOffset, totalPage }
}