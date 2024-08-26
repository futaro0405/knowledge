import { memo } from "react";

import "../../style/atoms/group/Entry.scss"
import { Link } from "react-router-dom";

export const Entry = memo(({ entry }) => {
    return (
        <Link to={`/groups/${entry.group_id}`}>
            <div className="image-name">
                {entry.user.profile_image_url && (
                    <div className="profile-image">
                        <img
                            src={entry.user.profile_image_url}
                            alt="プロフィール画像"
                        />
                    </div>
                )}
                <div className="name-message">
                    <p>{entry.user.name}</p>
                    {(entry.group.last_message) && (
                        <p>{entry.group.last_message.message}</p>
                    )}
                </div>
            </div>
        </Link>
    );
})