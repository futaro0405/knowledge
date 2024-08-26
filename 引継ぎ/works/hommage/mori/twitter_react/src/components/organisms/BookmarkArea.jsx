import { memo } from "react";
import "../../style/organisms/bookmark/BookmarkArea.scss";
import { BookmarkAreaHook } from "../../hooks/organisms/BookmarkAreaHook";
import { BookmarkTweet } from "../atoms/BookmarkTweet";

export const BookmarkArea = memo(() => {
    const { bookmarkTweets } = BookmarkAreaHook();

    return (
        <div className="bookmark-area">
            <div className="header">
                <h4>Bookmarks</h4>
            </div>
            <div className="bookmarks">
                {bookmarkTweets.bookmark_tweet.map((bookmarkTweet, i) => (
                    <div className="bookmark" key={`bookmark-${i}`}>
                        <BookmarkTweet bookmarkTweet={bookmarkTweet} />
                    </div>
                ))}
            </div>
        </div>
    );
})