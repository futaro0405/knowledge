import "../../style/atoms/retweet/Retweet.scss"

export const Retweet = ({ retweet, user }) => {
    return (
        <>
            <p>{user.name}</p>
            <p className="retweet-text">
                {retweet.content}
            </p>
        </>
    );
}