import { useCallback, useEffect, useState } from "react";
import { AxiosInstance } from "../../axios/axiosInstance";

export const BookmarkAreaHook = () => {
    const { instance } = AxiosInstance();
    const [bookmarkTweets, setBookmarkTweets] = useState({
        bookmark_tweet: [{
            content: '',
            user: {
                name: ''
            }
        }]
    })

    const getBookmarkTweet = useCallback(async () => {
        try {
            const bookmarkTweetData = await instance.get('/api/v1/bookmarks');
            setBookmarkTweets(bookmarkTweetData.data);
        } catch (error) {
            console.log(error);
        }
    }, [])

    useEffect(() => {
        getBookmarkTweet();
    }, [])

    return { bookmarkTweets };
}