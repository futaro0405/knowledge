import { useCallback } from "react";
import { useLocation } from "react-router-dom";
import { AxiosInstance } from "../../axios/axiosInstance";

export const CommentHook = (comment) => {
    const currentUserData = JSON.parse(sessionStorage.getItem('currentUserData'));
    const regexProfile = /\/profile\/\d+/;
    const location = useLocation();
    const { instance } = AxiosInstance();

    const deleteComment = useCallback(async () => {
        if (window.confirm('削除してもよろしいですか')) {
            await instance.delete(`/api/v1/comments/${comment.id}`);
            window.location.reload();
        }
    }, [])

    return {
        currentUserData,
        regexProfile,
        location,
        deleteComment
    };
}