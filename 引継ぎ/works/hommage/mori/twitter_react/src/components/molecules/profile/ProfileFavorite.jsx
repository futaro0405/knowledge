import { Favorite } from "../../atoms/Favorite";

export const ProfileFavorite = ({ profileFavorite, users }) => {
    return (
        <>
            <div className="favorite-area">
                {profileFavorite.map((favorite, i) => {
                    return (
                        <div className="favorite" key={i}>
                            <Favorite
                                favorite={favorite}
                                user={users.find(user => user.id === favorite.user_id)}
                            />
                        </div>
                    );
                })}
            </div>
        </>
    );
}