import { memo } from "react";
import "../../style/atoms/bookmark/BookmarkTweet.scss";

export const BookmarkTweet = memo(({ bookmarkTweet }) => {
    return (
        <div className="bookmark-content">
            {bookmarkTweet.user.profile_image_url &&
                <div className="profile-image">
                    <img src={bookmarkTweet.user.profile_image_url} alt="プロフィール画像" />
                </div>
            }
            <div className="bookmark-name-content">
                <p className="name">{bookmarkTweet.user.name}</p>
                <div className="bookmark-tweet-content">
                    <p className="bookmark-tweet-text">{bookmarkTweet.content}</p>
                    <div className="bookmark-tweet-images">
                        {bookmarkTweet.image_urls &&
                            bookmarkTweet.image_urls.map((url, i) => (
                                <img key={`bookmark-image-${i}`} src={url} alt="画像" />
                            )
                            )}
                    </div>
                </div>
            </div>
        </div>
    );
})