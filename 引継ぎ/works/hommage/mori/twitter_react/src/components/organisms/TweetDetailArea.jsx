import { memo } from "react";
import { FaArrowLeft } from "react-icons/fa";
import { Tweet } from "../atoms/Tweet";
import { Comment } from "../atoms/Comment";
import { Button } from "../atoms/Button"
import { InputField } from "../atoms/InputField"
import { TweetDetailAreaHook } from "../../hooks/organisms/TweetDetailAreaHook";
import "../../style/organisms/detail/TweetDetailArea.scss";


export const TweetDetailArea = memo(() => {
    const { tweet, navigate, comments } = TweetDetailAreaHook();

    return (
        <div className="tweet-detail-area">
            <div className="header">
                <FaArrowLeft className="arrow" onClick={() => navigate(-1)} />
                <h4>Post</h4>
            </div>
            <div className="tweet">
                <Tweet tweet={tweet} user={tweet.user} />
            </div>
            <form action="" className="reply-form">
                <InputField placeholder="Post your comment" />
                <Button>Comment</Button>
            </form>
            <div className="comments">
                {comments.map((comment, i) => {
                    return (
                        <div key={i} className="comment">
                            <Comment comment={comment} user={comment.user} />
                        </div>
                    )
                })}
            </div>
        </div>
    );
})