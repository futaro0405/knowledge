import { Link } from "react-router-dom";
import "../../style/molecules/TweetContentsArea.scss"
import { TweetContentsAreaHook } from "../../hooks/molecules/TweetContentsAreaHook";
import { Tweet } from "../atoms/Tweet";

export const TweetContentsArea = () => {
    const { allTweets, LIMIT, offset, setOffset, totalPage } = TweetContentsAreaHook();

    return (
        <div className="tweet-content">
            <p></p>
            {allTweets.map((tweet, i) => {
                return (
                    <div key={i} className="tweet">
                        <Tweet tweet={tweet} user={tweet.user} />
                    </div>
                )
            })}
            <div className="pagination">
                {Array.from({ length: totalPage }, (_, i) => {
                    return (offset === i * LIMIT) ? <p key={i + 1}>{i + 1}</p> :
                        <Link
                            key={i + 1}
                            to={`/toppage?limit=${LIMIT}&offset=${i * LIMIT}`}
                            onClick={() => setOffset(i * LIMIT)}
                        >
                            {i + 1}
                        </Link>
                })}
            </div>
        </div>
    )
}