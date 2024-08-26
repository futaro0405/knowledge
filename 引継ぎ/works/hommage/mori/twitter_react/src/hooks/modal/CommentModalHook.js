import { useCallback, useState } from "react";
import { AxiosInstance } from "../../axios/axiosInstance";

export const CommentModalHook = (showCommentModal, setShowCommentModal, tweet_id) => {
    const [comment, setComment] = useState({
        content: ''
    });
    const { instance } = AxiosInstance();

    const onChangeComment = useCallback(e => {
        const { name, value } = e.target;
        setComment({
            [name]: value
        });
    }, [setComment])

    const onClickComment = useCallback(async e => {
        try {
            e.preventDefault();
            const resComment = await instance.post(
                '/api/v1/comments',
                {
                    id: tweet_id,
                    comment: comment
                }
            )
            console.log(resComment);
            setShowCommentModal(!showCommentModal);
            setComment({ content: '' })
            window.location.reload();
        } catch (error) {
            console.log(error);
        }
    }, [tweet_id, comment])

    return {
        onChangeComment,
        onClickComment,
        comment
    };
}