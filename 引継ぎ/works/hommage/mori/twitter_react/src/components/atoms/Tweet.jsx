import { HiOutlineChatBubbleLeft } from "react-icons/hi2";
import { AiOutlineRetweet } from "react-icons/ai";
import { CiHeart } from "react-icons/ci";
import { FaHeart } from "react-icons/fa6";
import { CiBookmark } from "react-icons/ci";
import { FaBookmark } from "react-icons/fa6";
import { HiDotsHorizontal } from "react-icons/hi";
import { Link } from "react-router-dom";
import "../../style/atoms/tweet/Tweet.scss";
import { TweetHook } from "../../hooks/atoms/TweetHook";
import { CommentModal } from "../modals/CommentModal";

export const Tweet = ({ tweet, user }) => {
    const {
        currentUserData,
        regexProfile,
        location,
        deleteTweet,
        showCommentModal,
        setShowCommentModal,
        createRetweet,
        deleteRetweet,
        createFavorite,
        deleteFavorite,
        createBookmark,
        deleteBookmark
    } = TweetHook(tweet);


    return (
        <>
            {(tweet.retweets.find(retweet => retweet.user_id === currentUserData.data.id)) ?
                <p className="is-retweet-text">リツイート済み</p>
                : <div></div>
            }
            <div className="tweet-name-dots">
                <Link to={`/profile/${user.id}`}>
                    <p>{user.name}</p>
                </Link>
                {(regexProfile.test(location.pathname) && currentUserData.data.id === user.id) && <HiDotsHorizontal onClick={deleteTweet} />}
            </div>
            <Link to={`/tweets/${tweet.id}`}>
                <p className="tweet-text">{tweet.content}</p>
                <div className="images">
                    {tweet.image_urls &&
                        tweet.image_urls.map((url, i) => {
                            return <img key={i} src={url} alt="画像" />
                        })
                    }
                </div>
            </Link >
            <div className="icon-area">
                <HiOutlineChatBubbleLeft className="comment-icon" onClick={() => setShowCommentModal(!showCommentModal)} />
                <div className="retweet">
                    {(tweet.retweets.find(retweet => retweet.user_id === currentUserData.data.id)) ? <AiOutlineRetweet className="retweet-icon active" onClick={deleteRetweet} />
                        :
                        <AiOutlineRetweet className="retweet-icon" onClick={createRetweet} />
                    }
                    <p>{tweet.retweets_count}</p>
                </div>
                <div className="favorite">
                    {(tweet.nices.find(nice => nice.user_id === currentUserData.data.id)) ? <FaHeart
                        className="favorite-icon active"
                        onClick={deleteFavorite}
                    /> : <CiHeart
                        className="favorite-icon"
                        onClick={createFavorite}
                    />}
                    <p>{tweet.nices_count}</p>
                </div>
                {tweet.bookmarked ? (
                    <FaBookmark
                        className="bookmark-icon"
                        onClick={deleteBookmark}
                    />
                ) : (
                    <CiBookmark
                        className="bookmark-icon"
                        onClick={createBookmark}
                    />
                )}
            </div>
            <CommentModal
                showCommentModal={showCommentModal}
                setShowCommentModal={setShowCommentModal}
                tweet_id={tweet.id}
            />
        </>
    );
}