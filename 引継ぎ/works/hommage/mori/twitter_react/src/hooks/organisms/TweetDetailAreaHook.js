import { useCallback, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { AxiosInstance } from "../../axios/axiosInstance";

export const TweetDetailAreaHook = () => {
    const navigate = useNavigate();
    const [tweet, setTweet] = useState({
        user: {
            name: ''
        },
        image_urls: null,
        content: '',
        retweets: [''],
        nices: ['']
    });
    const [comments, setComments] = useState([
        {
            content: '',
            user: {
                name: ''
            }
        }
    ]);

    const { instance } = AxiosInstance();
    const location = useLocation();

    const getTweetDetail = useCallback(async () => {
        try {
            const tweetDetail = await instance.get(`/api/v1/${location.pathname}`);
            setTweet(tweetDetail.data.tweet);

            const tweetId = tweetDetail.data.tweet.id;
            const comments = await instance.get(`/api/v1/tweets/${tweetId}/comments`);
            setComments(comments.data.comments);
        } catch (error) {
            console.log(error);
        }
    }, [instance, location.pathname])

    const doGetTweetDetail = useCallback(async () => {
        await getTweetDetail();
    }, [getTweetDetail])

    useEffect(() => {
        doGetTweetDetail();
    }, [])

    return { tweet, navigate, comments };
}