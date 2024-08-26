import { Retweet } from "../../atoms/Retweet";

export const ProfileRetweet = ({ profileRetweet, users }) => {
    return (
        <>
            <div className="retweet-area">
                {profileRetweet.map((retweet, i) => {
                    return (
                        <div className="retweet" key={i}>
                            <Retweet
                                retweet={retweet}
                                user={users.find(user => user.id === retweet.user_id)}
                            />
                        </div>
                    );
                })}
            </div>
        </>
    );
}