import { Tweet } from "../../atoms/Tweet";

export const ProfileTweet = ({ profileTweets, profile }) => {
    return (
        <>
            <div className="tweet-area">
                {profileTweets.map((tweet, i) => {
                    return (
                        <div className="tweet" key={i}>
                            <Tweet tweet={tweet} user={profile.user} />
                        </div>
                    );
                })}
            </div>
        </>
    );
}