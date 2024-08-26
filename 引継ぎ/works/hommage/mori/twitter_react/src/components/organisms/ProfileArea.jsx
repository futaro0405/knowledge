import { FaArrowLeft } from "react-icons/fa";
import { CiLocationOn } from "react-icons/ci";
import { LiaBirthdayCakeSolid } from "react-icons/lia";
import { CgWebsite } from "react-icons/cg";
import { FaRegEnvelope } from "react-icons/fa";
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';

import { Button } from "../atoms/Button";
import { ProfileAreaHook } from "../../hooks/organisms/ProfileAreaHook";
import "../../style/organisms/profile/ProfileArea.scss"
import { ProfileTweet } from "../molecules/profile/ProfileTweet";
import { ProfileComment } from "../molecules/profile/ProfileComment";
import { ProfileRetweet } from "../molecules/profile/ProfileRetweet";
import { ProfileFavorite } from "../molecules/profile/ProfileFavorite";


export const ProfileArea = ({ showProfileEditModal, setShowProfileEditModal }) => {
    const {
        currentUserData,
        navigate,
        profile,
        profileTweets,
        userId,
        selectTab,
        profileComments,
        defaultTab,
        onSelectTab,
        profileRetweet,
        profileFavorite,
        following,
        followers,
        onClickFollow,
        onClickUnFollow,
        moveGroupArea
    } = ProfileAreaHook(showProfileEditModal);


    return (
        <div className="profile-area">
            <div className="header">
                <FaArrowLeft className="arrow" onClick={() => navigate(-1)} />
                <h4>{profile.user.name}</h4>
            </div>
            <div className="user-profile">
                <div className="header-image">
                    {profile.user.header_image_url && <img src={profile.user.header_image_url} alt="ヘッダー画像" />}
                </div>
                <div className="profile-image">
                    {profile.user.profile_image_url && <img src={profile.user.profile_image_url} alt="プロフィール画像" />}
                </div>
                <div className="bio">
                    <div className="edit-profile-button">
                        {(currentUserData.data.id !== Number(userId)) &&
                            <>
                                {currentUserData.data.following.find(following => following.id === Number(userId)) &&
                                    <div className="msg-btn">
                                        <Button onClick={moveGroupArea}>
                                            <FaRegEnvelope />
                                        </Button>
                                    </div>
                                }
                            </>
                        }
                        {(currentUserData.data.id === Number(userId)) &&
                            <Button onClick={() => setShowProfileEditModal(!showProfileEditModal)}>Edit profile</Button>
                        }
                        {
                            (currentUserData.data.id !== Number(userId)) && (
                                <>
                                    {currentUserData.data.following.find(follow => follow.id === Number(userId)) ?
                                        <Button onClick={onClickUnFollow}>Following</Button> : <Button onClick={onClickFollow}>Follow</Button>
                                    }
                                </>
                            )

                        }
                    </div>
                    <div className="bio-name">
                        <h4>{profile.user.name}</h4>
                    </div>
                    <div className="bio-text">
                        <p>{profile.user.bio}</p>
                    </div>
                    <div className="bio-other-info">
                        <div className="birthday">
                            <LiaBirthdayCakeSolid />
                            <p>{profile.user.birthday}</p>
                        </div>
                        <div className="location">
                            <CiLocationOn />
                            <p>{profile.user.location}</p>
                        </div>
                        <div className="website">
                            <CgWebsite />
                            <p>{profile.user.website}</p>
                        </div>
                    </div>
                    <div className="bio-follow">
                        <p>{following.length} Following</p>
                        <p>{followers.length} Followers</p>
                    </div>
                </div>
                <div className="profile-tweet">
                    <Tabs
                        defaultActiveKey={defaultTab}
                        id="uncontrolled-tab-example"
                        className="mb-3"
                        onSelect={tab => onSelectTab(tab)}
                    >
                        <Tab eventKey="posts" title="Posts" />
                        <Tab eventKey="comments" title="Comments" />
                        <Tab eventKey="retweets" title="Retweets" />
                        <Tab eventKey="favorites" title="Favorites" />
                        <Tab eventKey="media" title="Media" />
                        <Tab eventKey="likes" title="Likes" />
                    </Tabs>
                    {(selectTab === 'posts') ? (
                        <ProfileTweet
                            profileTweets={profileTweets}
                            profile={profile}
                        />
                    ) : (selectTab === 'comments') ? (
                        <ProfileComment
                            profileComments={profileComments}
                            profile={profile}
                        />
                    ) : (selectTab === 'retweets') ? (
                        <ProfileRetweet
                            profileRetweet={profileRetweet[0]}
                            users={profileRetweet[1]}
                        />
                    ) : (selectTab === 'favorites') ? (
                        <ProfileFavorite
                            profileFavorite={profileFavorite[0]}
                            users={profileFavorite[1]}
                        />
                    ) : <div></div>}
                </div>
            </div>
        </div>
    )
}