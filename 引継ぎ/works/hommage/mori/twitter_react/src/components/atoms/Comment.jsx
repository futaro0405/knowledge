import { HiDotsHorizontal } from "react-icons/hi";
import '../../style/atoms/comment/Comment.scss'
import { CommentHook } from "../../hooks/atoms/CommentHook";

export const Comment = ({ comment, user }) => {
    const {
        currentUserData,
        regexProfile,
        location,
        deleteComment
    } = CommentHook(comment);

    return (
        <>
            <div className="comment-name-dot">
                <p>{user.name}</p>
                {(regexProfile.test(location.pathname) && currentUserData.data.id === user.id) && <HiDotsHorizontal className="three-dots" onClick={deleteComment} />}
            </div>
            <p className="comment-text">{comment.content}</p>
        </>
    )
}