import { Comment } from "../../atoms/Comment"

export const ProfileComment = ({ profileComments, profile }) => {
    return (
        <>
            <div className="comment-area">
                {profileComments.map((comment, i) => {
                    return (
                        <div className="comment" key={i}>
                            <Comment comment={comment} user={profile.user} />
                        </div>
                    );
                })}
            </div>
        </>
    );
}