import "../../style/atoms/favorite/Favorite.scss"

export const Favorite = ({ favorite, user }) => {
    return (
        <>
            <p>{user.name}</p>
            <p className="favorite-text">
                {favorite.content}
            </p>
        </>
    );
}